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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/DefenceReport.json`;
    verifyLink(link, setreport);
  }, []);
  return (
    <Grid container pr={2} pt={2} spacing={1} width="40%">
      <Grid item width={"100%"}>
        <img
          style={{ display: "block", width: "255px", margin: "auto" }}
          src={bgImage}
        />
      </Grid>
      <Grid item width={"100%"}>
        <Card>
          <MKBox textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="regular"
              sx={{ fontSize: "14px" }}
            >
              Defense Summary
            </MKTypography>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
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
                <DefenceData report={report} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <DefenceData report={report} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <DefenceData report={report} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <DefenceData report={report} />
              </CustomTabPanel>
            </Box>
          </MKBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DefenseSummary;
