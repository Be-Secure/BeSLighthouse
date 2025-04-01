/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Modal,
  Typography,
  Card,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableBody,
  TablePagination,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { fetchJsonReport } from '../../../utils/fatchJsonReport';
import { Link } from 'react-router-dom';
import { assessmentDatastoreURL, versionDetailsURL } from '../../../dataStore';
import MKTypography from '../../../components/MKTypography';
import {
  assessmentPath,
  assessmentReport,
} from '../../../utils/assessmentReport';
import { useEffect, useRef, useState } from 'react';
import vulnerabilityIcon from '../../../assets/images/bug.png';
import dependencyIcon from '../../../assets/images/data-flow.png';
import licenseIcon from '../../../assets/images/certificate.png';
import scorecardIcon from '../../../assets/images/speedometer.png';
import encryptionIcon from '../../../assets/images/encryption.png';
import tavossIcon from '../../../assets/images/verified.png';
import BasicTable from './BasicTable';
import FetchSastReport from './FetchSastReport';
import { PieChart, Pie, Legend, Cell, Tooltip } from 'recharts';

import cryptoDictionary from '../../../resources/crypto-dictionary.json';
import * as d3 from 'd3';

type CryptoPrimitive = keyof typeof cryptoDictionary

export const fetchJsonData = async (link: any, setJsonData: any) => {
  try {
    const response = await fetchJsonReport(link);

    try {
      const data = JSON.parse(response);

      if (link.toLocaleLowerCase().endsWith('.pdf')) {
        setJsonData(true);
      } else {
        setJsonData(data);
      }

      return true;
    } catch (err) {
      if (link.toLocaleLowerCase().endsWith('.pdf')) {
        setJsonData(false);
      } else {
        setJsonData({});
      }

      return false;
    }
  } catch (error) {
    if (link.toLocaleLowerCase().endsWith('.pdf')) {
      setJsonData(false);
    } else {
      setJsonData({});
    }

    return false;
  }
};

export const fetchvulJsonData = async (
  link: string,
  vulTool: 'codeql' | 'sonarqube',
  setCQData: (data: any) => void,
  setSQData: (data: any) => void
): Promise<boolean> => {
  if (typeof link !== 'string') return false;

  try {
    const response = await fetchJsonReport(link);
    const data = JSON.parse(response);

    if (vulTool === 'codeql') {
      setCQData(data);
    } else if (vulTool === 'sonarqube') {
      setSQData(data);
    } else {
      return false;
    }
  } catch (error) {
    if (vulTool === 'codeql') {
      setCQData([]);
    } else if (vulTool === 'sonarqube') {
      setSQData(Object.create(null)); // Empty object without prototype
    }

    return false;
  }

  return true;
};

const FetchLowScores = ({ data }: any) => {
  const headings = ['Issue', 'Reason'];

  // Filter issues with scores <= 5
  const lowscorers = data.checks?.filter(
    (issue: { score?: number }) => issue?.score === undefined || issue.score <= 5
  ) || [];

  // Transform lowscorers into table data
  const tableData = lowscorers.map((issue: any) => ({
    Issue: issue?.name || 'Unknown Issue',
    Reason: issue?.reason || 'No reason provided',
  }));

  return (
    <>
      <MKTypography
        style={ {
          paddingTop: '10px',
          fontWeight: 'bold',
          fontSize: '18px',
        } }
      >
        Summary Report
      </MKTypography>
      <BasicTable
        tableData={ tableData }
        tableHeading={ headings }
        tableStyle={ { textAlign: 'center' } }
      />
    </>
  );
};

const FetchCS = ({ data }: any) => {
  const headings = [
    'Age (in months)',
    'Contributors',
    'Organizations',
    'Closed Issues',
    'Last Updated',
  ];

  // Destructure values safely
  const isLegacy = 'default_score' in data;
  const dataSource = isLegacy ? data.legacy : data;

  // Ensure data exists before constructing tableData
  if (!dataSource) {
    return (
      <MKTypography
        variant="h6"
        key="CSNotAvailable"
        color="inherit"
        style={ {
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
        } }
      >
        Data not available
      </MKTypography>
    );
  }

  // Construct table data
  const tableData = [
    {
      'Age (in months)': dataSource?.created_since || 'N/A',
      Contributors: dataSource?.contributor_count || 'N/A',
      Organizations: dataSource?.org_count || 'N/A',
      'Closed Issues': dataSource?.closed_issues_count || 'N/A',
      'Last Updated': dataSource?.updated_since || 'N/A',
    },
  ];

  return (
    <>
      <MKTypography
        style={ {
          fontSize: '18px',
          fontWeight: 'bold',
          paddingTop: '20px',
        } }
      >
        Summary Report
      </MKTypography>

      <BasicTable
        tableData={ tableData }
        tableHeading={ headings }
        tableStyle={ { textAlign: 'center' } }
      />
    </>
  );
};

const FetchLicense = ({ data, uniq_lic, itemData }: any) => {
  const headings = ['Project License', 'Undetermined Files', 'Licenses Found'];

  // Filter unique licenses
  const licenseList = uniq_lic.filter((ul: any) => ul.length !== 0);

  // Count undetermined license files
  const nonLicFiles = data.filter(
    (licenseData: { LicenseConcluded: string | any[] }) =>
      !licenseData.LicenseConcluded ||
            licenseData.LicenseConcluded === 'NOASSERTION' ||
            licenseData.LicenseConcluded.length === 0
  ).length;

  // Extract project license
  const projectLicense = itemData?.license?.key || 'Not Found';

  // Prepare table data
  const tableData = [
    {
      'Project License': projectLicense,
      'Undetermined Files': nonLicFiles,
      'Licenses Found': licenseList.join('; '),
    },
  ];

  return Object.keys(itemData).length !== 0 ? (
    <>
      <MKTypography
        style={ {
          paddingTop: '10px',
          fontWeight: 'bold',
          fontSize: '18px',
        } }
      >
        Summary Report
      </MKTypography>
      <BasicTable
        tableData={ tableData }
        tableHeading={ headings }
        tableStyle={ { textAlign: 'center' } }
      />
    </>
  ) : (
    <MKTypography
      variant="h6"
      key="MKTypoLBlank"
      color="inherit"
      style={ {
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
      } }
    >
      Not Available
    </MKTypography>
  );
};

async function checkForWeakness(dataObject: any[], setWeakness: any) {
  const foundPackages: Record<string, boolean> = {};

  // Process all dependencies concurrently
  await Promise.all(
    dataObject.map(async (dependency) => {
      try {
        // Fetch version details
        const versionData = await fetchJsonReport(
          `${versionDetailsURL}${dependency.id}-${dependency.name}-Versiondetails.json`
        );

        const version = versionData?.[0]?.version;
        if (!version) return;

        // Define report URLs
        const sonarqubeLink = `${assessmentDatastoreURL}/${dependency.name}/${version}/sast/${dependency.name}-${version}-sonarqube-report.json`;
        const codeqlLink = `${assessmentDatastoreURL}/${dependency.name}/${version}/sast/${dependency.name}-${version}-codeql-report.json`;

        // Fetch both reports concurrently
        const [codeqlData, sonarqubeData] = await Promise.all([
          fetchJsonReport(codeqlLink).catch(() => []), // Default to empty array on failure
          fetchJsonReport(sonarqubeLink).catch(() => ({})), // Default to empty object on failure
        ]);

        // Check if vulnerability exists
        if (
          (codeqlData?.length ?? 0) > 0 ||
                    (sonarqubeData?.total ?? 0) > 0
        ) {
          foundPackages[dependency.name] = true;
        }
      } catch (error) {
        console.error(`Error processing ${dependency.name}:`, error);
      }
    })
  );

  setWeakness(foundPackages);
}

const FetchSBOM = ({ data, masterData, name, weakness }: any) => {
  const headings = [
    'ID',
    'Name',
    'BeS Tech Stack',
    'License',
    'Link',
    'Weakness',
  ];
  const tableData: any[] = [];
  const tracked = new Set<string>(); // Use Set for efficient duplicate tracking

  // Create a lookup map from masterData for quick access
  const masterDataMap = new Map(
    masterData.map((item: { name: string }) => [
      item.name.toLowerCase(),
      item,
    ])
  );

  data.forEach((dp: { name: string }) => {
    if (!dp.name || dp.name.toLowerCase() === name.toLowerCase()) return;

    const dataObject: any = masterDataMap.get(dp.name.toLowerCase());
    if (dataObject && !tracked.has(dp.name.toLowerCase())) {
      tracked.add(dp.name.toLowerCase());

      tableData.push({
        ID: dataObject.id,
        Name: dataObject.name,
        'BeS Tech Stack': dataObject.bes_technology_stack,
        License: dataObject.license?.spdx_id || 'N/A',
        Link: (
          <a
            href={ `/BeSLighthouse/Project-Of-Interest/bes_version_history/:${dataObject.id}/:${dataObject.name}` }
          >
            link
          </a>
        ),
        Weakness: weakness[dataObject.name] ? 'Exist' : 'Absent',
      });
    }
  });

  return (
    <>
      { tracked.size ? (
        <>
          <MKTypography
            sx={ {
              paddingTop: 2,
              fontWeight: 'bold',
              fontSize: '18px',
            } }
          >
            Dependencies Tracked under the Lab
          </MKTypography>
          <BasicTable
            tableData={ tableData }
            tableHeading={ headings }
            tableStyle={ { textAlign: 'center' } }
          />
        </>
      ) : (
        <MKTypography
          sx={ {
            fontWeight: 'bold',
            fontSize: '18px',
            width: '100%',
            height: '100%',
            paddingY: '15%',
            marginX: 4,
          } }
        >
          <b>
            None of the dependencies detected are currently tracked
            in this lab
          </b>
        </MKTypography>
      ) }
    </>
  );
};

function generateCryptoFunctionsData(cryptography: any) {
  const functionCounts: any = {};

  cryptography.components.forEach((component: any) => {
    const { cryptoProperties, evidence }: any = component;

    if (cryptoProperties && cryptoProperties.algorithmProperties) {
      const { cryptoFunctions } = cryptoProperties.algorithmProperties;

      if (cryptoFunctions) {
        cryptoFunctions.forEach((func: any) => {
          if (!functionCounts[func]) {
            functionCounts[func] = 0;
          }
          functionCounts[func] += evidence.occurrences.length;
        });
      }
    }
  });

  // Define hardcoded colors for functions
  const colorMap: any = {
    keygen: '#F06292', // Pink
    digest: '#2196F3', // Blue
    tag: '#6A0DAD', // Purple
  };

  // Convert object to array format
  const cryptoFunctionsData = Object.entries(functionCounts).map(
    ([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value: count,
      color: colorMap[name.toLowerCase()] || '#757575', // Default color if not found
    })
  );

  // Calculate total occurrences
  // const total = cryptoFunctionsData.reduce((sum, item: any) => sum + item.value, 0);

  // Normalize values to percentage
  return cryptoFunctionsData.map((item: any) => ({
    ...item,
    value: item.value, // Convert to percentage
  }));
}

function generateCryptoStats(cryptographyData: any) {
  const primitiveCounts: any = {};

  const colorMapping: any = {
    'key-agree': '#1E88E5', // Deep Blue
    hash: '#6A0DAD', // Purple
    pke: '#4CAF50', // Green
    other: '#FFC107', // Amber
    signature: '#D32F2F', // Crimson Red
    mac: '#795548', // Warm Brown
    'block-cipher': '#607D8B', // Muted Cyan
    ae: '#9C27B0', // Dark Magenta
    kdf: '#FFD700', // Light Cyan
  };
  // Count occurrences of each "primitive" type
  cryptographyData.components.forEach((component: any) => {
    if (
      component.cryptoProperties &&
            component.cryptoProperties.algorithmProperties
    ) {
      const primitive: any =
                component.cryptoProperties.algorithmProperties.primitive.toLowerCase() ||
                'other';
      const occurrenceCount: any =
                component.evidence.occurrences.length || 0;

      if (!primitiveCounts[primitive]) {
        primitiveCounts[primitive] = {
          count: 0,
          color: colorMapping[primitive] || colorMapping.other,
        };
      }
      primitiveCounts[primitive].count += occurrenceCount;
    }
  });

  // Calculate total occurrences
  // const total: any = Object.values(primitiveCounts).reduce((sum, { count }: any) => sum + count, 0);

  // Convert counts to JSON format with hardcoded colors
  return Object.entries(primitiveCounts).map(
    ([primitive, { count, color }]: any) => ({
      name: primitive.charAt(0).toUpperCase() + primitive.slice(1), // Capitalize first letter
      value: count, // Convert count to percentage
      color: color,
    })
  );
}

// Function to render outside segment labels
const renderLabel = (
  { cx, cy, midAngle, outerRadius, value, fill }: any,
  cryptoPrimitivesData: any
) => {
  const total: number = cryptoPrimitivesData.reduce(
    (sum: any, item: any) => sum + item.value,
    0
  );

  const RADIAN = Math.PI / 180;
  const x = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN);
  const y = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={ x }
      y={ y }
      fill={ fill }
      textAnchor="middle"
      fontSize="16px"
      fontWeight="bold"
    >
      { Number(total > 0 ? (value / total) * 100 : 0).toFixed(2) }%
    </text>
  );
};

const TABLE_HEAD = [
  {
    id: 'cryptographicAsset',
    label: 'Cryptographic asset',
    alignRight: false,
  },
  { id: 'Primitive', label: 'Primitive', alignRight: false },
  { id: 'Location', label: 'Location', alignRight: false },
];

type BubbleData = {
    name: string
    value: number
    color: string
    x?: number
    y?: number
}

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + name.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = hash & hash; // Convert to 32bit integer
  }

  const hue = Math.abs(hash % 360); // Hue based on the hash
  return `hsl(${hue}, 80%, 60%)`; // HSL format with dynamic hue
}

const BubbleChart: any = ({ cryptography }: any) => {
  const occurrenceMap: any = {};

  // Loop through each component and accumulate the value (occurrences)
  cryptography.components.forEach((component: any) => {
    const name = component.name;
    const count = component.evidence.occurrences.length;

    if (occurrenceMap[name]) {
      occurrenceMap[name] += count;
    } else {
      occurrenceMap[name] = count;
    }
  });

  // Convert the map to an array of BubbleData objects
  const data = Object.keys(occurrenceMap).map((name) => {
    return {
      name: name,
      value: occurrenceMap[name],
      color: getColorForName(name),
    };
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const width = 400,
      height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const tooltip = d3.select(tooltipRef.current);

    d3.forceSimulation<BubbleData>(data)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(0, 0))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => d.value * 4 + 5)
      )
      .on('tick', ticked);

    function ticked() {
      const bubbles = svg
        .selectAll<SVGCircleElement, BubbleData>('circle')
        .data(data);

      bubbles
        .enter()
        .append('circle')
        .attr('r', (d) => d.value * 4)
        .attr('fill', (d) => d.color)
        .attr('stroke', '#000')
        .merge(bubbles)
        .attr('cx', (d: any) => d.x!)
        .attr('cy', (d: any) => d.y!)
        .on('mouseover', (event: MouseEvent, d: BubbleData) => {
          d3.select(event.target as SVGCircleElement)
            .attr('stroke-width', 3)
            .attr('stroke', '#fff');

          tooltip
            .style('opacity', 1)
            .style('left', `${d.x! + width / 2 + 10}px`) // Adjust left position relative to bubble
            .style('top', `${d.y! + height / 2 - 20}px`) // Position slightly above bubble
            .html(`<strong>${d.name}</strong> ${d.value}`);
        })
        .on('mouseout', (event: MouseEvent) => {
          d3.select(event.target as SVGCircleElement)
            .attr('stroke-width', 1)
            .attr('stroke', '#000');

          tooltip.style('opacity', 0);
        });
    }
  }, []);

  return (
    <Card
      sx={ {
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      } }
    >
      { /* Title */ }
      <Typography
        variant="h5"
        sx={ { textAlign: 'center', textTransform: 'none' } }
      >
        Crypto Assets
      </Typography>
      <svg ref={ svgRef } width={ 345 } height={ 345 } />

      { /* Tooltip */ }
      <div
        ref={ tooltipRef }
        style={ {
          position: 'absolute',
          backgroundColor: 'white',
          padding: '5px 10px',
          border: '1px solid black',
          borderRadius: '5px',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          opacity: 0, // Hidden by default
        } }
      />

      { /* Legend */ }
      <Box
        sx={ {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          position: 'relative',
          // pb: 2,
          justifyContent: 'center', // Centers horizontally
          alignItems: 'center', // Centers vertically
          width: '100%', // Ensures full width
        } }
      >
        { data.slice(0, 6).map((item, index) => (
          <Box
            key={ index }
            sx={ {
              display: 'flex',
              alignItems: 'center',
              fontSize: '13px',
            } }
          >
            <span
              style={ {
                width: 15,
                height: 15,
                backgroundColor: item.color,
                display: 'inline-block',
                marginRight: 5,
              } }
            />
            { item.name }
          </Box>
        )) }
        { data.length > 6 && (
          <Box sx={ { fontSize: '13px', fontWeight: 'bold' } }>
            +{ data.length - 6 } other crypto assets
          </Box>
        ) }
      </Box>
    </Card>
  );
};

const CryptographyModal = ({ cryptography }: any) => {
  const cryptoPrimitivesData = generateCryptoStats(cryptography);
  const cryptoFunctionsData = generateCryptoFunctionsData(cryptography);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box
      sx={ {
        bgcolor: '#f4f4f4',
        width: '100%',
        padding: '20px',
        paddingTop: '22px',
      } }
    >
      { /* <Grid container spacing={ 2 } alignItems="center" pb={ 2 }> */ }
      <Grid container spacing={ 2 } alignItems="stretch" pb={ 2 } pt={ 1.2 }>
        <Grid item xs={ 12 } xl={ 4 } sx={ { display: 'flex' } }>
          <BubbleChart cryptography={ cryptography } />
        </Grid>
        { /* Left Section (Crypto Primitives) */ }
        <Grid item xs={ 12 } xl={ 4 } sx={ { display: 'flex' } }>
          <Card
            sx={ {
              padding: '20px',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            } }
          >
            <Typography
              variant="h5"
              sx={ { textAlign: 'center', textTransform: 'none' } }
            >
              Crypto Primitives
            </Typography>
            <PieChart width={ 400 } height={ 400 }>
              <Pie
                data={ cryptoPrimitivesData }
                cx="50%"
                cy="50%"
                innerRadius={ 100 }
                outerRadius={ 140 }
                labelLine={ true }
                label={ (props) =>
                  renderLabel(props, cryptoPrimitivesData)
                }
                dataKey="value"
              >
                { cryptoPrimitivesData.map((entry, index) => (
                  <Cell
                    key={ `cell-${index}` }
                    fill={ entry.color }
                  />
                )) }
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={ {
                  fontSize: '13px',
                  paddingTop: '8px',
                } }
              />
              { /* Central Text Inside Donut */ }
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="28px"
                fontWeight="bold"
              >
                { cryptoPrimitivesData.length }
                <tspan
                  x="50%"
                  dy="24px"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  Crypto Primitives
                </tspan>
              </text>
            </PieChart>
          </Card>
        </Grid>

        { /* Right Section (Crypto Functions) */ }
        <Grid
          item
          xs={ 12 }
          xl={ 4 }
          sx={ { display: 'flex', justifyContent: 'center' } }
        >
          <Card
            sx={ {
              padding: '20px',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            } }
          >
            <Typography
              variant="h5"
              sx={ { textAlign: 'center', textTransform: 'none' } }
            >
              Crypto Functions
            </Typography>
            <PieChart width={ 400 } height={ 400 }>
              <Pie
                data={ cryptoFunctionsData }
                cx="50%"
                cy="50%"
                innerRadius={ 100 }
                outerRadius={ 140 }
                labelLine={ true }
                label={ (props) =>
                  renderLabel(props, cryptoPrimitivesData)
                }
                dataKey="value"
              >
                { cryptoFunctionsData.map((entry, index) => (
                  <Cell
                    key={ `cell-${index}` }
                    fill={ entry.color }
                  />
                )) }
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={ {
                  fontSize: '13px',
                  paddingTop: '8px',
                } }
              />
              { /* Central Text Inside Donut */ }
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan fontSize="28px" fontWeight="bold">
                  { cryptoFunctionsData.length }
                </tspan>
                <tspan x="50%" dy="24px" fontSize="16px">
                  Crypto Functions
                </tspan>
              </text>
            </PieChart>
          </Card>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead sx={ { display: 'contents' } }>
            <TableRow>
              { TABLE_HEAD.map((headCell) => (
                <TableCell
                  key={ headCell.id }
                  sx={ {
                    color: '#637381',
                    backgroundColor: '#F4F6F8',
                  } }
                  align={
                    headCell.alignRight ? 'right' : 'left'
                  }
                >
                  <TableSortLabel hideSortIcon>
                    { headCell.label }
                  </TableSortLabel>
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { cryptography.components
              .flatMap((component: any) =>
                component.evidence.occurrences.map(
                  (occurrence: any) => ({
                    name: component.name.toUpperCase(),
                    primitive:
                                            component.cryptoProperties?.algorithmProperties?.primitive.toUpperCase() ||
                                            'Unspecified',
                    filename: `${occurrence.location.split('/').pop()}:${occurrence.line}`,
                  })
                )
              )
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ) // <-- Apply pagination here
              .map((row: any, index: any) => (
                <TableRow key={ index }>
                  <TableCell>{ row.name }</TableCell>
                  <TableCell>
                    <div>{ row.primitive }</div>
                    <div style={ { color: '#888' } }>
                      { cryptoDictionary?.[
                                                row.primitive.toLowerCase() as CryptoPrimitive
                      ]?.fullName || '' }
                    </div>
                  </TableCell>
                  <TableCell>{ row.filename }</TableCell>
                </TableRow>
              )) }
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={ [5, 10, 15] }
          component="div"
          count={ cryptography.components.reduce(
            (total: any, component: any) =>
              total + (component.evidence?.occurrences?.length || 0),
            0
          ) }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
          sx={ {
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':{
              margin: 'auto',
            },
          } }
        />
      </TableContainer>
    </Box>
  );
};

function GetAssessmentData(
  version: string,
  name: string,
  report: string,
  itemData: any,
  masterData: any[]
) {
  const [jsonData, setJsonData]: any = React.useState({});
  const [codeQlData, setCQData]: any = React.useState([]);
  const [sonarqubeData, setSQData]: any = React.useState({});
  const [weakness, setWeakness]: any = React.useState({});
  const [cryptography, setCryptography]: any = React.useState({});

  const reportMappings: any = {
    'Criticality Score': 'Criticality Score',
    Vulnerabilities: 'Codeql',
    'License Compliance': 'Fossology',
    Dependencies: 'SBOM',
    ScoreCard: 'Scorecard',
    Cryptography: 'cryptography',
  };

  const reportNameMap = reportMappings[report] || '';

  React.useEffect(() => {
    if (version?.trim()) {
      const baseUrl = `${assessmentDatastoreURL}/${name}/${version}`;
      if (reportNameMap) {
        const link = `${baseUrl}/${assessmentPath[reportNameMap]}/${name}-${version}-${assessmentReport[reportNameMap]}-report.json`;
        fetchJsonData(link, setJsonData);
      }
      if (reportNameMap === 'cryptography') {
        fetchJsonData(
          `${baseUrl}/${reportNameMap}/${name}-${version}-${reportNameMap}-report.json`,
          setCryptography
        );
      }
      fetchvulJsonData(
        `${baseUrl}/sast/${name}-${version}-sonarqube-report.json`,
        'sonarqube',
        setCQData,
        setSQData
      );
      fetchvulJsonData(
        `${baseUrl}/${assessmentPath.Codeql}/${name}-${version}-codeql-report.json`,
        'codeql',
        setCQData,
        setSQData
      );
    }
  }, [version]);

  React.useEffect(() => {
    if (masterData && jsonData?.packages) {
      const dataObject = masterData.filter((element) =>
        jsonData.packages.some(
          (item: any) =>
            item.name.toLowerCase() === element.name.toLowerCase()
        )
      );
      if (dataObject.length > 0 && Object.keys(weakness).length === 0) {
        checkForWeakness(dataObject, setWeakness);
      }
    }
  }, [jsonData, masterData]);

  const jsonDataLength = Object.keys(jsonData).length;
  const pathName = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;
  const myObject = { pathname: pathName, state: jsonData };

  const getRiskColor = (score: any, ranges: any) => {
    for (const [min, max, color, risk] of ranges) {
      if (score >= min && score < max) return [color, risk];
    }
    return ['', ''];
  };

  if (report === 'Criticality Score' && jsonDataLength) {
    const criticality_score = parseFloat(
      jsonData.default_score || jsonData.criticality_score || 0
    ).toFixed(2);
    const [color_code, risk_level] = getRiskColor(criticality_score, [
      [0.1, 0.4, '#008000', 'Low risk'],
      [0.4, 0.6, '#FFC300', 'Medium risk'],
      [0.6, 1.0, '#FF5733', 'High risk'],
    ]);
    return [
      criticality_score,
      <FetchCS data={ jsonData } />,
      color_code,
      '',
      risk_level,
    ];
  }

  if (report === 'ScoreCard' && jsonDataLength !== 0) {
    let color_code = '';

    let risk_level = '';

    if (jsonData.score >= 0 && jsonData.score <= 2) {
      color_code = '#008000';

      risk_level = 'Low risk';
    } else if (jsonData.score > 2 && jsonData.score <= 5) {
      color_code = '#FFC300';

      risk_level = 'Medium risk';
    } else if (jsonData.score > 5 && jsonData.score <= 7.5) {
      color_code = '#FF5733';

      risk_level = 'High risk';
    } else if (jsonData.score > 7.5 && jsonData.score <= 10) {
      color_code = '#C70039';

      risk_level = 'Critical risk';
    }

    return [
      jsonData.score,
      <FetchLowScores data={ jsonData } />,
      color_code,
      myObject,
      risk_level,
    ];
  }

  if (report === 'Vulnerabilities') {
    if (codeQlData.length && !Object.keys(sonarqubeData).length) {
      return [
        codeQlData.length,
        <FetchSastReport cqData={ codeQlData } sqData={ sonarqubeData } />,
        '',
        '',
      ];
    }
    if (!codeQlData.length && Object.keys(sonarqubeData).length) {
      const issues: any = Object.values(sonarqubeData)[5] || [];
      const count = issues.filter((issue: any) =>
        ['CRITICAL', 'MAJOR', 'MINOR', 'BLOCKER'].includes(
          issue.severity
        )
      ).length;
      return [
        count,
        <FetchSastReport cqData={ codeQlData } sqData={ issues } />,
        '',
        '',
      ];
    }
    if (codeQlData.length && Object.keys(sonarqubeData).length) {
      return [
        codeQlData.length,
        <FetchSastReport
          cqData={ codeQlData }
          sqData={ Object.values(sonarqubeData)[5] }
        />,
        '',
        '',
      ];
    }
  }

  if (report === 'License Compliance' && jsonDataLength) {
    const uniqueLicenses = Array.from(
      new Set(
        jsonData
          .filter(
            (item: any) =>
              item.LicenseConcluded &&
                            item.LicenseConcluded !== 'NOASSERTION'
          )
          .map(
            (item: { LicenseConcluded: any }) =>
              item.LicenseConcluded
          )
      )
    );
    return [
      uniqueLicenses.length,
      <FetchLicense
        data={ jsonData }
        uniq_lic={ uniqueLicenses }
        itemData={ itemData }
      />,
      '',
      myObject,
    ];
  }

  if (report === 'Dependencies' && jsonDataLength) {
    const packages = jsonData.packages.filter(
      (pkg: { name: string }) =>
        pkg.name.toLowerCase() !== name.toLowerCase()
    );
    return [
      packages.length,
      <FetchSBOM
        data={ packages }
        masterData={ masterData }
        name={ name }
        weakness={ weakness }
      />,
      '',
      myObject,
    ];
  }

  if (report === 'Cryptography' && Object.keys(cryptography).length) {
    return [
      cryptography.components.reduce(
        (total: any, component: any) =>
          total + (component.evidence?.occurrences?.length || 0),
        0
      ),
      <CryptographyModal cryptography={ cryptography } />,
      '',
      '',
      '',
      true
    ];
  }

  return (
    <MKTypography
      variant="h6"
      color="inherit"
      style={ {
        fontSize: '12px',
        textAlign: 'center',
        position: 'relative',
        top: '67px',
      } }
    >
      Assessment report not available
    </MKTypography>
  );
}

function printText(item: string): string {
  switch (item) {
  case 'Dependencies':
    return `${item} found`;
  case 'Vulnerabilities':
    return 'weaknesses found';
  case 'License Compliance':
    return 'unique licenses found';
  case 'ScoreCard':
  case 'Criticality Score':
    return `OpenSSF ${item}`;
  case 'Cryptography':
    return `${item} dependencies`;
  default:
    return `on ${item}`;
  }
}

const imageMap: Record<string, any> = {
  Vulnerabilities: vulnerabilityIcon,
  Dependencies: dependencyIcon,
  'License Compliance': licenseIcon,
  'TAVOSS Score': tavossIcon,
  ScoreCard: scorecardIcon,
  'Criticality Score': scorecardIcon,
  Cryptography: encryptionIcon,
};

function getImage(report: string): any {
  return imageMap[report] || undefined;
}

function modalStyle(report: string) {
  const baseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    height: 'fit-content',
    boxShadow: '24',
    padding: '4',
    backgroundColor: 'white',
    display: 'flex',
    flexWrap: 'wrap',
    placeContent: 'center',
  };

  const styleOverrides: any = {
    Vulnerabilities: { width: '50%' },
    ScoreCard: { height: '90%' },
  };

  return { ...baseStyle, ...styleOverrides[report] };
}

const ReportModal = ({ version, name, item, itemData, masterData }: any) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleOpen = () => setOpen((prev) => !prev);
  // const toggleHover = (state: any) => () => setIsHovered(state);

  const data: any = GetAssessmentData(
    version,
    name,
    item,
    itemData,
    masterData
  );
  const color = data?.[2] || '';
  const countData = data?.[0];
  const hasValidData = data && countData !== undefined;

  const tooltipContent =
  item === 'ScoreCard' ? (
    <>
      <p>
        Scorecard is an automated tool that
        assesses a number of important
        heuristics associated with software
        security and assigns each check a score
        of 0-10.
      </p>
      <ul
        style={ {
          listStyleType: 'disc',
          margin: '8px',
          paddingInlineStart: '14px',
        } }
      >
        <li>Low risk: 0 - 2</li>
        <li>Medium risk: 2 - 5</li>
        <li>High risk: 5 - 7.5</li>
        <li>Critical risk: 7.5 - 10</li>
      </ul>
    </>
  ) : (
    <>
      <p>
        A project's criticality score defines
        the influence and importance of a
        project. It is a number between 0
        (least-critical) and 1 (most-critical).
      </p>
      <ul
        style={ {
          listStyleType: 'disc',
          margin: '8px',
          paddingInlineStart: '14px',
        } }
      >
        <li>Low Critical: 0.1 - 0.4</li>
        <li>Medium critical: 0.4 - 0.6</li>
        <li>Highly critical: 0.6 - 1.0</li>
      </ul>
    </>
  );

  return (
    <>
      <Button
        variant="contained"
        onClick={ toggleOpen }
        disabled={ !hasValidData }
        sx={ {
          height: '100px',
          width: '100%',
          padding: '8px',
          ':hover': {
            boxShadow: '0 15px 20px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.5s ease-in-out',
            border: '1px solid #5c4f4f',
            color: 'blueviolet',
          },
        } }
        style={ { backgroundColor: 'white', display: 'block', textAlign: 'left' } }
      >
        
        { color ? (
          <MKTypography
            style={ {
              fontSize: '40px',
              color: color,
              fontWeight: 'bold',
            } }
          >
            { data ? data[0] : 0 }
            <img
              style={ {
                width: '40px',
                float: 'right',
                position: 'relative',
                top: '14px',
                height: '40px',
              } }
              src={ getImage(item) }
            />
          </MKTypography>
        ) : (
          <MKTypography
            style={ {
              fontSize: '40px',
              fontWeight: 'bold',
              color: 'black',
              display: 'flex',         // Enables flexbox
              alignItems: 'center',    // Aligns items vertically
              width: '100%',           // Ensures full width
            } }
          >
            <span style={ { flex: 8, textAlign: 'left' } }>
              { data ? data[0] : 0 }
            </span>
            <img
              style={ {
                flex: 2,              // Allocates 20% width to the image
                maxWidth: '80px',     // Prevents excessive stretching
                height: '40px',
              } }
              src={ getImage(item) }
            />
          </MKTypography>
        ) }

        <MKTypography
          textTransform="capitalize"
          style={ {
            fontSize: '12px',
          } }
        >
          { printText(item) }
          { item === 'ScoreCard' || item === 'Criticality Score' ? (
            <span
              style={ {
                position: 'absolute',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'color 0.5s',
                color: '#36454F',
                marginLeft: '5px',
              } }
              onMouseEnter={ () => setIsHovered(true) }
              onMouseLeave={ () => setIsHovered(false) }
            >
              <i className="fas fa-info-circle" />
            </span>
          ) : (
            ''
          ) }
          { isHovered && (
            <div
              style={ {
                position: 'absolute',
                top: '98%',
                left: '55%',
                transform: 'translateX(-70%)',
                backgroundColor: '#fff',
                color: 'black',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
                fontSize: '12px',
                fontWeight: 'normal',
                transition: 'opacity 0.5s',
                zIndex: 9999,
                whiteSpace: 'nowrap',
              } }
            >
              { tooltipContent }
            </div>
          ) }
        </MKTypography>
      </Button>

      <Modal open={ open } onClose={ toggleOpen } closeAfterTransition>
        <Fade in={ open }>
          <Box
            style={ {
              ...(data?.[5]
                ? {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '95%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  bgcolor: '#f4f4f4',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }
                : {
                  ...modalStyle(item),
                  borderRadius: '9px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.6)',
                }),
            } }
          >
            <IconButton
              style={ { position: 'absolute', top: 0, right: 0 } }
              onClick={ toggleOpen }
            >
              <CloseIcon
                fontSize="medium"
                sx={ { ':hover': { color: 'red' } } }
              />
            </IconButton>
            { data?.[1] || 'Not found' }
            { data?.[3] && (
              <Typography
                style={ {
                  fontSize: '15px',
                  color: 'black',
                  position: 'fixed',
                  right: '40px',
                  bottom: '10px',
                } }
              >
                <Link to={ data[3] }>Detailed Report</Link>
              </Typography>
            ) }
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

const AssessmentReport: React.FC<any> = ({
  name,
  version,
  itemData,
  masterData,
}) => {
  const reports = React.useMemo(
    () => [
      'Vulnerabilities',
      'Dependencies',
      'License Compliance',
      'ScoreCard',
      'Criticality Score',
      'TAVOSS Score',
      'Cryptography',
    ],
    []
  );

  return (
    <>
      { reports.map((item: any) => (
        <Grid key={ item } item xs={ 6 } md={ 4 } lg={ 4 } xl={ 1.71 }>
          <ReportModal
            version={ version }
            name={ name }
            item={ item }
            itemData={ itemData }
            masterData={ masterData }
          />
        </Grid>
      )) }
    </>
  );
};

export default AssessmentReport;
