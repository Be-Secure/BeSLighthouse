import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";
import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";

import bgImage from "../../../assets/images/neuralimage.png";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";
import DefenceData from "../DefenceData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function DefenseSummary() {
  const [value, setValue] = React.useState(0);

  const handleChange: any = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  
  const [evasion, evasionSetreport]: any = React.useState({});
  const [inference, inferenceSetreport]: any = React.useState({});
  const [extraction, extractionSetreport]: any = React.useState({});
  const [dataPoisoning, dataPoisoningSetreport]: any = React.useState({});

  React.useEffect(() => {
    let evasionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/DefenceReport.json`;
    let inferenceLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/inference/DefenceReport.json`;
    let extractionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/extraction/DefenceReport.json`;
    let dataPoisoningLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/dataPoisoning/DefenceReport.json`;
    verifyLink(evasionLink, evasionSetreport);
    verifyLink(inferenceLink, inferenceSetreport);
    verifyLink(extractionLink, extractionSetreport);
    verifyLink(dataPoisoningLink, dataPoisoningSetreport);
  }, []);
  return (
    <Grid
      container
      pr={2}
      pt={2}
      spacing={1}
      width="40%"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <div id="arrowpass">
          <img style={{ display: "block", width: "255px" }} src={bgImage} />
        </div>
      </Grid>
      <Grid item width={"80%"}>
        <Card style={{ backgroundColor: "#90ee90" }}>
          <MKBox textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="regular"
              sx={{ fontSize: "14px" }}
            >
              Defense Model Capability
            </MKTypography>
            <Box sx={{ width: "100%" }} >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  style={{ backgroundColor: "#90ee90" }}
                >
                  <Tab
                    sx={{ fontSize: "12px" }}
                    label="Evasion"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{ fontSize: "12px" }}
                    label="Inference"
                    {...a11yProps(1)}
                  />
                  <Tab
                    sx={{ fontSize: "12px" }}
                    label="Extraction"
                    {...a11yProps(2)}
                  />
                  <Tab
                    sx={{ fontSize: "12px" }}
                    label="Data Poisoning"
                    {...a11yProps(3)}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <DefenceData report={evasion} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <DefenceData report={inference} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <DefenceData report={extraction} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <DefenceData report={dataPoisoning} />
              </CustomTabPanel>
            </Box>
          </MKBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DefenseSummary;
