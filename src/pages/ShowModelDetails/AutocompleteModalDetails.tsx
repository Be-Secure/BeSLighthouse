/* eslint-disable no-unused-vars */
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(CWE: string, count: number) {
  return { CWE, count };
}

function autocompleteModalDetails() {
  const testName = 'Autocomplete Test';
  const testDetail =
        'measures how often an LLM suggests insecure coding practices in autocomplete contexts, where the LLM predicts subsequent code based on preceding code.';
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
      name: 'Success',
      value: successCount,
      color: '#156082',
    },
    {
      name: 'Failed',
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

function CWETable({ rows }: { rows: any }) {
  return (
    <TableContainer component={ Paper } style={ { maxHeight: 400 } }>
      <Table sx={ { maxWidth: 500 } } aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>CWE</StyledTableCell>
            <StyledTableCell align="right">Count</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row: any) => (
            <StyledTableRow key={ row.CWE }>
              <StyledTableCell component="th" scope="row">
                { row.CWE }
              </StyledTableCell>
              <StyledTableCell align="right">{ row.count }</StyledTableCell>
            </StyledTableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const AutocompleteModal = ({
  autocompleteSummaryData,
  autocompleteDetailedData,
}: {
    autocompleteSummaryData: AutocompleteData
    autocompleteDetailedData: AutocompleteDetailDataArray
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
          ? autocompleteModalDetails()
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
  console.log('rows', rows);
  return (
    <>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          <Card
            sx={ {
              height: '100%',
              display: 'flex',
              marginLeft: '8px',
              marginTop: '9px',
              paddingTop: '10px',
              paddingBottom: '10px',
            } }
          >
            <Typography
              id="transition-modal-title"
              sx={ { fontSize: '16px' } }
            >
              <strong>{ summaryData.testName }</strong>{ ' ' }
              { summaryData.testDetail }
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 } md={ 6 } lg={ 12 }>
              { rows.length > 0 ? <CWETable rows={ rows } /> : null }
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={ 12 } md={ 8 } lg={ 8 }>
          { /* <Card  sx={ { height: "100%", display: "flex", marginLeft: '8px', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px", alignItems: 'center' } }>
            <ResponsiveContainer style={ { alignItems: 'center' } } width={ '100%' }>
              <>
                <PieChart width={ 400 } height={ 300 } style={ { position: 'relative', left: '30%' } }>
                  <Pie
                    data={ pieData }
                    innerRadius={ 60 }
                    outerRadius={ 80 }
                    fill="#8884d8"
                    paddingAngle={ 3 }
                    dataKey="value"
                  >
                    { pieData.map((entry, index) => (
                      <Cell key={ `cell-${index}` } fill={ entry.color } />
                    )) } 
                  </Pie>
                </PieChart>

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
              </>
            </ResponsiveContainer>
          </Card> */ }
        </Grid>
        <Grid item xs={ 12 } md={ 12 } lg={ 12 }>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 } md={ 2 } lg={ 2 }>
              <Card
                sx={ {
                  height: '100%',
                  backgroundColor: 'white',
                } }
              >
                <CardContent
                  sx={ {
                    textAlign: 'center',
                    padding: '16px',
                  } }
                >
                  <Typography
                    variant="h5"
                    sx={ {
                      fontWeight: 'bold',
                      marginTop: '4px',
                    } }
                  >
                    { totalCWECount }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={ { color: '#000', marginTop: '4px' } }
                  >
                    CWEs were identified for the code
                    generated by the LLM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={ 12 } md={ 2 } lg={ 2 }>
              <Card
                sx={ {
                  height: '100%',
                  backgroundColor: 'white',
                } }
              >
                <CardContent
                  sx={ {
                    textAlign: 'center',
                    padding: '16px',
                  } }
                >
                  <Typography
                    variant="h5"
                    sx={ {
                      fontWeight: 'bold',
                      marginTop: '4px',
                    } }
                  >
                    { mostCommonCWE }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={ { color: '#000', marginTop: '4px' } }
                  >
                    is the most common CWE in the generated
                    code
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } md={ 12 } lg={ 12 }>
          <Card
            style={ {
              paddingBottom: '8px',
              paddingTop: '8px',
              margin: '10px',
              marginTop: '20px',
            } }
          >
            <Typography
              variant="h6"
              sx={ {
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
              } }
              pb={ 1 }
            >
              % of Safe and Insecure Code Generated
            </Typography>
            <ResponsiveContainer width={ '100%' } height={ 300 }>
              <BarChart
                data={ autocompleteBarData }
                margin={ {
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                } }
                barSize={ 35 }
              >
                <XAxis dataKey="language" name="Language" />
                <YAxis name="Percentage" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="safe"
                  name="Safe Code"
                  stackId="a"
                  fill="#156082"
                />
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
