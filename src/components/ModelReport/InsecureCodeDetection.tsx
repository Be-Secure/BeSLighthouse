import React, { useEffect } from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { verifyLink } from "../../utils/verifyLink";
import { NavLink } from "react-router-dom";

interface InsecureCodeItem {
  insecure_code: boolean;
  test_case: string;
  issues_found: {
    pattern_id: string;
    description: string;
    severity: string;
    line: string;
  }[];
  recommended_treatment: string;
  llm_output_code: string;
}


function insecureCodeDetectionReport(selectedMenu: string, report: any, buttonLabel: string) {
  if (report.length > 0) {
    return (
      <NavLink
        to={ {
          pathname: `/BeSLighthouse/insecure_code_detection/:${selectedMenu}`,
          search: ""
        } }
        state={ { selectedFuzz: selectedMenu } }
        style={ { color: "#587f2f", cursor: "pointer" } }
      >
        <Button
          sx={ {
            top: '-12px',
            backgroundColor: '#CCF2FF',
            color: 'black',
            '&:hover': {
              backgroundColor: '#99D6FF',
              opacity: 0.9,
            },
          } }
        >
          { buttonLabel }
        </Button>
      </NavLink>
    );
  } else {
    return (
      <Button
        sx={ {
          top: '-12px',
          backgroundColor: '#CCF2FF',
          color: 'black',
          '&:hover': {
            backgroundColor: '#99D6FF',
            opacity: 0.9,
          }
        } }
        disabled
      >
        { buttonLabel }
      </Button>
    );
  }
}

// Custom component for displaying test case info
const InfoBox: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <Grid item xs={ 12 }>
      <Box sx={ { backgroundColor: '#F3F6F4', p: 2, borderRadius: '8px' } }>
        <Typography variant="body1" sx={ { color: '#283593' } }>{ title }</Typography>
        <Typography variant="h4" sx={ { fontWeight: 'bold', color: '#283593' } }>{ count }</Typography>
      </Box>
    </Grid>
  );
};

const InsecureCodeDetection: React.FC<{ name: string }> = ({ name }) => {
  const [insecureCode, setInsecureCode]: any = React.useState(
    []
  );
  const insecureCodeDetection = {
    testCase: 0,
    InsecureCode: 0
  };
  useEffect(() => {
    const insecureCodeLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/insecure-code-detection/${name}-codeshield-summary-report.json`;
    verifyLink(insecureCodeLink, setInsecureCode);
  }, [name]);
  if (insecureCode?.length) {
    insecureCodeDetection.testCase = insecureCode?.length;
    insecureCode.forEach(({ insecure_code }: InsecureCodeItem) => {
      if (insecure_code) insecureCodeDetection.InsecureCode++;
    });
  }
  return (
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#fffff',
      display: 'flex',
      flexDirection: 'column',
    } }>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align to center vertically
      >
        <Typography variant="h6" sx={ { position: 'relative', fontWeight: 'bold', top: '-7px' } }>Insecure Code Detection</Typography>
        { insecureCodeDetectionReport(name, insecureCode, 'Report') }
      </Box>
      <Divider sx={ { mb: 2, opacity: 1, position: 'relative', top: '-14px' } } />

      { /* Main container with F3F9FB background surrounding grid items */ }
      <Box sx={ { backgroundColor: '#fffff', width: '100%', textAlign: 'center', p: 2, borderRadius: '8px', position: 'relative', top: '-30px' } }>
        <Grid container spacing={ 2 } justifyContent="center">

          { /* Test Cases */ }
          <InfoBox title="Test Cases" count={ insecureCodeDetection.testCase } />

          { /* Spacer with F3F9FB color */ }
          <Grid item xs={ 12 }>
            <Box sx={ { height: '16px' } } />
          </Grid>

          { /* Insecure Code */ }
          <InfoBox title="Insecure Code" count={ insecureCodeDetection.InsecureCode } />

        </Grid>
      </Box>
    </Card>
  );
};

export default InsecureCodeDetection;
