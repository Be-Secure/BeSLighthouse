/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { fetchJsonReport } from "../../../utils/fatchJsonReport";
import { assessmentDatastoreURL } from "../../../dataStore";
import {
  assessmentPath,
  assessmentReport
} from "../../../utils/assessmentReport";
import MKTypography from "../../../components/MKTypography";
import VulHistory from "../../../components/Charts/BarChart/VulHistory";
import PieChart from "../../../components/Charts/PieChart";

export const getLinkData = async (link: any, setRiskData: any) => {
  try {

    const response = await fetchJsonReport(link);
    try {

      const data = JSON.parse(response);
      setRiskData(data);
    } catch (err) {
      setRiskData({});
    }
  } catch (error) {
    setRiskData({});
  }
};

export const countSeverity = async (
  vulnerabilityData: any,
  setSeverity: any
) => {

  if (Object.keys(vulnerabilityData).length !== 0) {
    const supportedSeverityLevels: string[] = [
      "low",
      "medium",
      "high",
      "critical"
    ];

    const severityCounts: any = {};
    const severityForChart: any = [];

    for (let i = 0; i < supportedSeverityLevels.length; i++) {
      severityCounts[supportedSeverityLevels[i]] = 0;
    }

    for (let i = 0; i < vulnerabilityData.length; i++) {
      for (let j = 0; j < supportedSeverityLevels.length; j++) {
        if (
          vulnerabilityData[i].rule.security_severity_level ===
          supportedSeverityLevels[j]
        )
          severityCounts[supportedSeverityLevels[j]]++;
      }
    }

    for (const sevStack of Object.keys(severityCounts)) {
      severityForChart.push({
        label: sevStack,
        value: severityCounts[sevStack]
      });
    }
    setSeverity(severityForChart);
  }
  else {
    setSeverity([]);
  }
};

const FetchVulHistory = (versionDetails: any, setVulHistory: any) => {
  const vulHsitoryForChart: any = [];
  if (versionDetails[0].cve_details !== "Not Available") {
    for (let j = 0; j < versionDetails[0].cve_details.length; j++) {
      if (
        versionDetails[0].cve_details[j].Year !== "Total" &&
        versionDetails[0].cve_details[j].Year !== null
      )
        vulHsitoryForChart.push({
          label: versionDetails[0].cve_details[j].Year,
          value: versionDetails[0].cve_details[j].No_of_Vulnerabilities
        });
    }
    if (vulHsitoryForChart.length !== 0) setVulHistory(vulHsitoryForChart);
    else return <></>;
    return vulHsitoryForChart;
  } else {
    return <></>;
  }
};

const FetchData = ({
  title,
  version,
  name,
  report,
  versionDetails,
}: any) => {
  const [cqRiskData, setCqRiskData]: any = React.useState({});
  const [severityData, setSeverity] = React.useState([]);
  const [vulHistoryData, setVulHistory] = React.useState([]);
  React.useEffect(() => {
    let link: string = "";
    if (version.trim()) {
      link = `${assessmentDatastoreURL}/${name}/${version}/${assessmentPath.Codeql}/${name}-${version}-${assessmentReport.Codeql}-report.json`;
      getLinkData(link, setCqRiskData);
    }
  }, [version]);
  React.useEffect(() => {
    countSeverity(cqRiskData, setSeverity);
  }, [cqRiskData]);

  React.useEffect(() => {
    FetchVulHistory(versionDetails, setVulHistory);
  }, [versionDetails]);

  const theme = useTheme();
  if (report === "Risk Posture") {
    if (severityData.length !== 0) {
      return (
        <PieChart
          title={ title }
          chartData={ severityData }
          chartColors={ [
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.success.main,
            theme.palette.secondary.main
          ] }
          height={ 232 }
        />
      );
    } else {
      return (
        <Card key="RISKPOSTURECARD1" style={ { height: "273px" } }>
          <MKTypography
            variant="h6"
            fontWeight="bold"
            color="text"
            textTransform="capitalize"
            style={ {
              fontSize: "15px",
              display: "flex",
              placeContent: "center",
              padding: '8px'
            } }
          >
            { title }
          </MKTypography>
          <MKTypography
            key="RISKPOSTURETYPO2"
            variant="h6"
            color="inherit"
            style={ {
              fontSize: "calc(0.3rem + 0.5vw)",
              margin: "auto",
              height: "120px",
              display: "flex",
              alignItems: "center"
            } }
          >
            No Data Available
          </MKTypography>
        </Card>
      );
    }
  } else if (report === "Known Vulnerabilities") {
    if (vulHistoryData.length !== 0) {
      return (
        <VulHistory vuldata={ vulHistoryData } title={ report } />
      );
    } else {
      return (
        <Card key="RISKPOSTURECARD1" style={ { height: "273px" } }>
          <MKTypography
            variant="h6"
            fontWeight="bold"
            color="text"
            textTransform="capitalize"
            style={ {
              fontSize: "15px",
              display: "flex",
              placeContent: "center",
              padding: '8px'
            } }
          >
            { title }
          </MKTypography>
          <MKTypography
            key="RISKPOSTURETYPO2"
            variant="h6"
            color="inherit"
            style={ {
              fontSize: "calc(0.3rem + 0.5vw)",
              margin: "auto",
              height: "120px",
              display: "flex",
              alignItems: "center"
            } }
          >
            No Data Available
          </MKTypography>
        </Card>
      );
    }
  } else {
    return <></>;
  }
};

function AssessmentAnalytics({
  name,
  version,
  versionDetails,
  masterData
}: any) {
  const report: string[] = [
    "Risk Posture",
    "Known Vulnerabilities"
  ];
  return (
    <Grid container pt={ 2 } spacing={ 1 } style={ { display: "flex", justifyContent: "space-between" } }>

      { report.map((value) => {
        return (

          <Grid item xs={ 12 } md={ 6 }>
            <FetchData
              title={ value }
              version={ version }
              name={ name }
              report={ value }
              versionDetails={ versionDetails }
              masterData={ masterData }
            />
          </Grid>
        );
      }) }
    </Grid>

  );
}

export default AssessmentAnalytics;
