import React from "react";
import { Card, Typography, Grid, Box, Divider, Button } from "@mui/material";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../../utils/verifyLink";
import MKTypography from "../MKTypography";
import { NavLink } from "react-router-dom";

function weaknessReport(selectedMenu: string, report: any, buttonLabel: string) {
  if (Object.values(report).length > 0) {
    return (
      <NavLink
        to={ {
          pathname: `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu}`,
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

// Custom component for displaying severity level info
const SeverityBox: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <Grid item xs={ 6 }>
      <Box sx={ { backgroundColor: '#F3F6F4', p: 2, borderRadius: '8px' } }>
        <Typography variant="body1" sx={ { color: '#283593' } }>{ title }</Typography>
        <Typography variant="h4" sx={ { fontWeight: 'bold', color: '#283593' } }>{ count }</Typography>
      </Box>
    </Grid>
  );
};

const WeaknessSummary: React.FC<{ name: string }> = ({ name }) => {
  const [linkStatus, setLinkStatus]: any = React.useState({});
  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${name}/sast/${name}-sast-summary-report.json`;
    verifyLink(link, setLinkStatus);
  }, [name]);
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
        <Typography variant="h6" sx={ { position: 'relative', fontWeight: 'bold', top: '-7px' } }>Weakness Summary</Typography>
        { weaknessReport(name, linkStatus, 'Report') }
      </Box>
      <Divider sx={ { my: 2, opacity: 1, position: 'relative', top: '-14px' } } />

      { /* Main container with F3F9FB background, surrounding grid items */ }
      <Box sx={ { backgroundColor: '#fffff', width: '100%', textAlign: 'center', p: 2, borderRadius: '8px', position: 'relative', top: '-30px' } }>
        <Grid container spacing={ 2 } sx={ { textAlign: 'center' } }>

          { /* Critical and High */ }
          <SeverityBox title="Critical" count={ linkStatus?.["Total Model Vulnerabilities Found"]?.Critical ?? 0 } />
          <SeverityBox title="High" count={ linkStatus?.["Total Model Vulnerabilities Found"]?.High ?? 0 } />

          { /* Gap for spacing */ }
          <Grid item xs={ 12 }>
            <Box sx={ { height: '8px' } } />
          </Grid>

          { /* Medium and Low */ }
          <SeverityBox title="Medium" count={ linkStatus?.["Total Model Vulnerabilities Found"]?.Medium ?? 0 } />
          <SeverityBox title="Low" count={ linkStatus?.["Total Model Vulnerabilities Found"]?.Low ?? 0 } />

        </Grid>
      </Box>
      <MKTypography
        pt={ 1 }
        component="div"
        style= { {position: 'relative', top: '-18px'} }
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          sx={ { fontSize: "12px" } }
        >
          Powered by
          <a
            style={ {
              color: "grey",
              cursor: "pointer",
              marginLeft: "4px"
            } }
            href={ `https://github.com/bosch-aisecurity-aishield/watchtower` }
            title={ "Click to go to AIShield Watchtower repo" }
            target="_blank"
          >
            AIShield Watchtower
          </a>
        </Box>
      </MKTypography>
    </Card>
  );
};

export default WeaknessSummary;
