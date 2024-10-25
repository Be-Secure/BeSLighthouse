import React, { useEffect } from "react";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { verifyLink } from "../../utils/verifyLink";

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
      backgroundColor: '#F3F9FB',
      display: 'flex'
    } }>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="left"
        height="50%"
        textAlign="left"
      >
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>Insecure Code Detection</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />

      { /* Main container with F3F9FB background surrounding grid items */ }
      <Box sx={ { backgroundColor: '#F3F9FB', width: '100%', textAlign: 'center', p: 2, borderRadius: '8px' } }>
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
