/* eslint-disable no-unused-vars */

// ***Using the same modal file for Instruct and Autocomplete Modal Details***
import React from 'react';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from 'recharts';

import {
  AutocompleteData,
  AutocompleteDetailDataArray,
} from './SummaryDashboard';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { WidthFull } from '@mui/icons-material';
import BasicTable from '../BesVersionHistory/AssessmentReport/BasicTable';

/** Table Container with rounded corners & light shadow */
export const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: 8,
  overflow: 'auto',
}));

// 2. Styled table
export const StyledTable = styled(Table)(() => ({
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse', // Ensures borders collapse
  // Apply borders to all cells
  '& td, & th': {
    border: '4px solid white', // Light gray border
  },
}));

// 3. Table head with a teal background
export const StyledTableHead = styled(TableHead)(() => ({
  [`& th`]: {
    backgroundColor: '#156082',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
}));

// 4. Styled body cells
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.9rem',
    color: '#333',
    padding: '12px',
  },
}));

// 5. Styled body rows (alternate shading + hover)
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#ccd2d8',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&:last-child td, &:last-child th': {
    border: 0, // Remove bottom border on last row if desired
  },
}));

function createData(CWE: string, count: number) {
  return { CWE, count };
}

function autocompleteModalDetails(data: string) {
  let testName = '';
  let testDetail = '';
  if (data === 'Autocomplete') {
    testName = 'Autocomplete Test';
    testDetail =
          'measures how often an LLM suggests insecure coding practices in autocomplete contexts, where the LLM predicts subsequent code based on preceding code.';
  }else if (data === 'Instruct') {
    testName = 'Instruct Test';
    testDetail =
          'assess an LLM\'s propensity to generate insecure code when given a specific instruction';
  }

  return {
    testName,
    testDetail,
  };
}

function generatePieChartData(autocompleteSummaryData: AutocompleteData) {
  let successCount: number = 0;
  let vulnerableCount: number = 0;

  if (
    !autocompleteSummaryData ||
        Object.keys(autocompleteSummaryData).length === 0
  ) {
    return [];
  }

  Object.values(autocompleteSummaryData).forEach((language: any) => {
    successCount +=
            language.total_count - language.vulnerable_suggestion_count;
    vulnerableCount += language.vulnerable_suggestion_count;
  });

  return [
    {
      name: 'Safe Code',
      value: successCount,
      color: '#156082',
    },
    {
      name: 'Insecure Code',
      value: vulnerableCount,
      color: '#E87437',
    },
  ];
}

function getCWECount(data: AutocompleteDetailDataArray) {
  let count: number = 0;
  if (!data || Object.keys(data).length === 0) {
    return 0;
  }
  Object.values(data).forEach((entry: any) => {
    if (entry.icd_result === 1) {
      count += entry.icd_cwe_detections.length;
    }
  });
  return count;
}

function findMostCommonCWE(data: AutocompleteDetailDataArray) {
  const cweCount: Record<string, number> = {};

  data.forEach((entry) => {
    entry.icd_cwe_detections?.forEach((cwe) => {
      if (cweCount[cwe]) {
        cweCount[cwe]++;
      } else {
        cweCount[cwe] = 1;
      }
    });
  });

  let mostCommonCWE: string = '';
  let maxCount = 0;

  for (const [cwe, count] of Object.entries(cweCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCWE = cwe;
    }
  }
  console.log('object keys', Object.keys(cweCount));
  return { mostCommonCWE, cweCount };
}


export default function CWETable({ rows }: { rows: any[] }) {
  return (
    <StyledTableContainer sx={ { height: 400 } }>
      <StyledTable stickyHeader size="small">
        <StyledTableHead>
          <TableRow>
            { /* Header cells (teal background, white text) */ }
            <StyledTableCell style={ { width: '80'} }>CWE</StyledTableCell>
            <StyledTableCell align="right">Count</StyledTableCell>
          </TableRow>
        </StyledTableHead>

        <TableBody>
          { rows.map((row) => (
            <StyledTableRow key={ row.CWE }>
              { /* Body cells */ }
              <StyledTableCell component="th" scope="row">
                { row.CWE }
              </StyledTableCell>
              <StyledTableCell align="right">
                { row.count }
              </StyledTableCell>
            </StyledTableRow>
          )) }
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
}
export const AutocompleteModal = ({
  autocompleteSummaryData,
  autocompleteDetailedData,
  data
}: {
    autocompleteSummaryData: AutocompleteData
    autocompleteDetailedData: AutocompleteDetailDataArray
    data: string
}) => {
  const pieData = generatePieChartData(autocompleteSummaryData) || [];
  const autocompleteBarData = Object.keys(autocompleteSummaryData).map(
    (language: string) => ({
      language: language,
      safe: autocompleteSummaryData[language].pass_rate,
      insecure: autocompleteSummaryData[language].vulnerable_percentage,
    })
  );
  const summaryData: any =
        Object.keys(autocompleteSummaryData).length > 0
          ? autocompleteModalDetails(data)
          : { testName: '', testDetail: '' };

  const totalCWECount: number = getCWECount(autocompleteDetailedData);
  const { mostCommonCWE, cweCount } = findMostCommonCWE(
    autocompleteDetailedData
  );
  console.log('cweCount', cweCount);
  const rows = cweCount
    ? Object.keys(cweCount).map((cwe: string) => {
      return createData(cwe, cweCount[cwe]);
    })
    : [];

    
  return (
    <>
      <Grid container spacing={ 2 }>
        { /* LEFT COLUMN: Title & Two Cards */ }
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          <Grid container spacing={ 2 } sx={ { height: '100%' } }>
            { /* Title / Description Card */ }
            <Grid item xs={ 12 }>
              <Card sx={ { 
                p: 2, 
                height: '200px', // Fixed height to match other columns
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              } }>
                <Typography variant="body2" style={ { paddingLeft: '10px', fontSize: '18px' } }>
                  <b>{ summaryData.testName }</b> { ' ' }
                  { summaryData.testDetail }
                </Typography>
              </Card>
            </Grid>

            { /* Two Info Cards (Total CWE & Most Common CWE) */ }
            <Grid item xs={ 12 }>
              <Grid container spacing={ 2 }>
                <Grid item xs={ 12 } sm={ 6 }>
                  <Card sx={ { 
                    backgroundColor: '#fff', 
                    height: '180px', // Fixed height
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  } }>
                    <CardContent sx={ { textAlign: 'center', p: 2 } }>
                      <Typography variant="h5" sx={ { fontWeight: 'bold' } }>
                        { totalCWECount }
                      </Typography>
                      <Typography variant="body2" sx={ { mt: 1 } }>
                        CWEs were identified for the code generated by the LLM
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                  <Card sx={ { 
                    backgroundColor: '#fff', 
                    height: '180px', // Fixed height
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  } }>
                    <CardContent sx={ { textAlign: 'center', p: 2 } }>
                      <Typography variant="h5" sx={ { fontWeight: 'bold' } }>
                        { mostCommonCWE }
                      </Typography>
                      <Typography variant="body2" sx={ { mt: 1 } }>
                        is the most common CWE in the generated code
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        { /* MIDDLE COLUMN: CWE Table */ }
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          { rows.length > 0 ? (
            <Card sx={ { 
              p: 2, 
              backgroundColor: '#fff', 
              height: '400px' // Fixed height to match left column total height
            } }>
              <CWETable rows={ rows } />
            </Card>
          ) : null }
        </Grid>

        { /* RIGHT COLUMN: Donut Chart */ }
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          <Card sx={ { 
            height: '400px', // Fixed height to match other columns
            p: 2, 
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column'
          } }>
            <Typography variant="h6" textAlign="center">
              Safe vs Insecure Code Generated
            </Typography>
            <Box sx={ { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
              <ResponsiveContainer width="100%" height={ 300 }>
                <PieChart>
                  <Pie
                    data={ pieData }
                    innerRadius={ 60 }
                    outerRadius={ 80 }
                    fill="#8884d8"
                    paddingAngle={ 3 }
                    dataKey="value"
                    startAngle={ 120 }
                    endAngle={ -240 }
                  >
                    { pieData.map((entry, index) => (
                      <Cell key={ `cell-${index}` } fill={ entry.color } />
                    )) }
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={ {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "100%",
              gap: 1,
            } }>
              { pieData.map((item) => (
                <Box key={ item.name } sx={ { display: "flex", alignItems: "center" } }>
                  <Box
                    sx={ {
                      width: 10,
                      height: 10,
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      mr: 0.5,
                    } }
                  />
                  <Typography variant="caption" sx={ { fontSize: "13px", color: "textSecondary", textTransform: 'capitalize' } }>
                    { item.name }
                  </Typography>
                </Box>
              )) }
            </Box>
          </Card>
        </Grid>
      </Grid>


      { /* BOTTOM ROW: Bar Chart */ }
      <Grid container spacing={ 2 } sx={ { mt: 2 } }>
        <Grid item xs={ 12 }>
          <Card sx={ { p: 2 } }>
            <Typography
              variant="h6"
              fontWeight={ 700 }
              textAlign="center"
              pb={ 1 }
            >
              % of Safe and Insecure Code Generated
            </Typography>
            <ResponsiveContainer width="100%" height={ 300 }>
              <BarChart
                data={ autocompleteBarData }
                margin={ { top: 20, right: 30, left: 20, bottom: 5 } }
                barSize={ 35 }
              >
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="safe" name="Safe Code" stackId="a" fill="#156082" />
                <Bar
                  dataKey="insecure"
                  name="Insecure Code"
                  stackId="a"
                  fill="#E97132"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
