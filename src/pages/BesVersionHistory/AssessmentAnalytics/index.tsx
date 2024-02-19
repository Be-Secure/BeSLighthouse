import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SeverityLevels from "../../../examples/Charts/PieChart/SeverityLevels";
import VulHistory from "../../../examples/Charts/BarChart/VulHistory";
import { fetchJsonReport } from "../../../utils/fatch_json_report";
import { Link } from "react-router-dom";
import { assessment_datastore } from "../../../dataStore";
import MKBox from "../../../components/MKBox";
import {
  assessment_path,
  assessment_report
} from "../../../utils/assessmentReport";
import MKTypography from "../../../components/MKTypography";
import Language from "../../../examples/Charts/PieChart/Languages";

export const getLinkData = async (link: any, setRiskData: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
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
    let supportedSeverityLevels: string[] = [
      "low",
      "medium",
      "high",
      "critical"
    ];

    let severityCounts: any = {};
    const severityForChart: any = [];

    for (let i = 0; i < supportedSeverityLevels.length; i++) {
      severityCounts[supportedSeverityLevels[i]] = 0;
    }

    for (let i = 0; i < vulnerabilityData.length; i++) {
      for (let j = 0; j < supportedSeverityLevels.length; j++) {
        if (
          vulnerabilityData[i]["rule"]["security_severity_level"] ===
          supportedSeverityLevels[j]
        )
          severityCounts[supportedSeverityLevels[j]]++;
      }
    }

    for (let sevStack of Object.keys(severityCounts)) {
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

const FetchCritical = ({ cqRiskData, sqRiskData }: any) => {
  let sqres: any = {};
  let cqres: any = {};
  let foundCrtical: boolean = false;

  //if(JSON.stringify(Object.values(sqRiskData).length) !== "0"){
  sqres = Object.values(sqRiskData).map(function (sqrisk: any, index: number) {
    if (index === 5) {
      let tmpres: any = {};
      tmpres = sqrisk.map(function (issue: any, innerindex: number) {
        if (issue.severity === "BLOCKER" || issue.severity === "CRITICAL") {
          foundCrtical = true;
          return (
            <>
              <MKTypography
                key={`SQRISKDATATYPO1${index}${innerindex}`}
                variant="h6"
                color="inherit"
                style={{ fontSize: "calc(0.3rem + 0.5vw)" }}
              >
                {issue.rule} :
                <MKTypography
                  key={`SQRISKDATATYPO2${index}${innerindex}`}
                  variant="body1"
                  color="inherit"
                  style={{ fontSize: "calc(0.3rem + 0.5vw)" }}
                >
                  {issue.message}
                </MKTypography>
              </MKTypography>
            </>
          );
        } else {
          return <></>;
        }
      });
      return <>{tmpres}</>;
    } else {
      return <></>;
    }
  });
  //}

  //if(JSON.stringify(Object.values(cqRiskData).length) !== "0"){
  cqres = Object.values(cqRiskData).map(function (vul: any, index: number) {
    if (vul !== undefined && vul.rule.security_severity_level === "critical") {
      foundCrtical = true;
      return (
        <>
          <MKTypography
            key={`CQRISKDATATYPO1${index}`}
            variant="h6"
            color="inherit"
            style={{ fontSize: "calc(0.3rem + 0.5vw)" }}
          >
            {vul.rule.name} :
            <Link
              key={`CQRISKDATALINK1${index}`}
              to={vul.html_url}
              style={{ fontSize: "calc(0.2rem + 0.4vw)" }}
            >
              {vul.rule.name}
            </Link>
          </MKTypography>
        </>
      );
    } else {
      return <></>;
    }
  });
  //}

  if (foundCrtical) {
    if (cqres.length !== 0 && sqres.length !== 0) {
      return (
        <>
          <Grid>
            {cqres}
            {sqres}
          </Grid>
        </>
      );
    } else if (cqres.length !== 0 && sqres.length === 0) {
      return (
        <>
          <Grid>{cqres}</Grid>
        </>
      );
    } else if (cqres.length === 0 && sqres.length !== 0) {
      return (
        <>
          <Grid>{sqres}</Grid>
        </>
      );
    } else {
      return (
        <>
          <MKTypography
            key="CQNODATA"
            variant="h6"
            color="inherit"
            style={{
              fontSize: "calc(0.3rem + 0.5vw)",
              justifyContent: "center",
              display: "flex"
            }}
          >
            No Data Available
          </MKTypography>
        </>
      );
    }
  } else {
    return (
      <>
        <MKTypography
          key="NOCRITICALVUL"
          variant="h6"
          color="inherit"
          style={{
            fontSize: "calc(0.3rem + 0.5vw)",
            justifyContent: "center",
            display: "flex"
          }}
        >
          No critical issues found
        </MKTypography>
      </>
    );
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
  const [sqRiskData, setSqRiskData]: any = React.useState({});
  const [severityData, setSeverity] = React.useState([]);
  const [vulHistoryData, setVulHistory] = React.useState([]);
  React.useEffect(() => {
    let link: string = "";
    if (version.trim()) {
      link = `${assessment_datastore}/${name}/${version}/${assessment_path["Codeql"]}/${name}-${version}-${assessment_report["Codeql"]}-report.json`;
      getLinkData(link, setCqRiskData);
    }
  }, [version]);
  React.useEffect(() => {
    let link: string = "";
    if (version.trim()) {
      link = `${assessment_datastore}/${name}/${version}/${assessment_path["Sonarqube"]}/${name}-${version}-${assessment_report["Sonarqube"]}-report.json`;
      getLinkData(link, setSqRiskData);
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

        <Language
          title={title}
          chartData={severityData}
          chartColors={[
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.success.main,
            theme.palette.secondary.main
          ]}
          height={218}
        />

      );
    } else {
      return (
        <Card key="RISKPOSTURECARD1" style={{ height: "266px" }}>
          <MKTypography
            key="RISKPOSTURETYPO2"
            variant="h6"
            color="inherit"
            style={{
              fontSize: "calc(0.3rem + 0.5vw)",
              margin: "auto",
              height: "120px",
              display: "flex",
              alignItems: "center"
            }}
          >
            No Data Available
          </MKTypography>
        </Card>
      );
    }
  }

  else if (report === "Vulnerability History") {
    if (vulHistoryData.length !== 0) {
      return (
        <VulHistory vuldata={vulHistoryData} />
      );
    } else {
      return (
        <Card key="RISKPOSTURECARD1" style={{ height: "266px" }}>
          <MKTypography
            key="RISKPOSTURETYPO2"
            variant="h6"
            color="inherit"
            style={{
              fontSize: "calc(0.3rem + 0.5vw)",
              margin: "auto",
              height: "120px",
              display: "flex",
              alignItems: "center"
            }}
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

const GetHeadings = ({ receivedValue }: any) => {
  //const [fieldInfo, setfieldInfo]: any = React.useState({});
  if (receivedValue === "Risk Posture") {
    return (
      <>
        {" "}
        Risk Posture
        <Icon
          key="RISKPICON"
          title="Percentage of low, high, critical issues found"
          sx={{ fontSize: "calc(0.3rem + 0.4vw) !important" }}
        >
          info
        </Icon>
      </>
    );
  } else if (receivedValue === "Critical Issues") {
    return (
      <>
        {/* {" "} Top Vulnerabilities
                <Icon key="CIICON" title="Top vulnerabilities found." sx={{fontSize: 'calc(0.3rem + 0.4vw) !important'}}>
                  info
                </Icon> */}
      </>
    );
  } else if (receivedValue === "Vulnerability History") {
    return (
      <>
        {" "}
        CVE History
        <Icon
          key="VHICON"
          title="Year wise graph of vulnerabilities found"
          sx={{ fontSize: "calc(0.3rem + 0.4vw) !important" }}
        >
          info
        </Icon>
      </>
    );
  } else return receivedValue;
};

function AssessmentAnalytics({
  title,
  name,
  version,
  versionDetails,
  masterData,
  ...other
}: any) {
  const report: string[] = [
    "Risk Posture",
    "Vulnerability History"
    // "Critical Issues"
  ];
  return (
      <Grid container pt={2} spacing={1} style={{ display: "flex", justifyContent: "space-between"}}>
        {/* <Grid container spacing={1} pt={2} style={{ display: "flex", justifyContent: "space-around" }}> */}

        {report.map((value, index) => {
          return (

            <Grid item xs={12} md={6}
              style={{
                // paddingRight: "9px"
              }}>
              <FetchData
                title={value}
                version={version}
                name={name}
                report={value}
                versionDetails={versionDetails}
                masterData={masterData}
              />
            </Grid>
          );
        })}
      </Grid>

  );
}
export default AssessmentAnalytics;
