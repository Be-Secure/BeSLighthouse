import * as React from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import { Divider, Grid, Typography } from "@mui/material";
import { fetchJsonReportOsspoiMaster } from "../../../utils/fatch_json_report";
import { Link } from "react-router-dom";
import { assessment_datastore } from "../../../dataStore";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";
import { assessment_path, assessment_report } from "../../../utils/assessmentReport";

const dividerDiv = (index: number) => {
  if (index !== 0) return <Divider sx={{ my: 1.5 }} />;
};

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReportOsspoiMaster(link);
    try {
      let data = JSON.parse(response);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus({});
    }
  } catch (error) {
    setLinkStatus({});
  }
};

const CheckLink = ({ version, name, report }: any) => {
  const [linkStatus, setLinkStatus]: any = React.useState({});
  
  React.useEffect(() => {
    if (version.trim()) {
      let link: string = `${assessment_datastore}/${name}/${version}/${assessment_path[report]}/${name}-${version}-${assessment_report[report]}-report.json`;
      verifyLink(link, setLinkStatus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  let linkStatusLength: number = Object.values(linkStatus).length;
  if (report === "Criticality Score" && linkStatusLength !== 0)
    return (
      <Typography variant="subtitle1" color="inherit">
        {linkStatus.criticality_score}
      </Typography>
    );
  const pathName: string = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${report}`;
  const myObject = { pathname: pathName, state: linkStatus } as { pathname: string; };
  if (report === "Scorecard" && linkStatusLength !== 0) {
    return (
      <Link to={myObject}>
        {linkStatus.score}
      </Link>
    );
    // href={`/BeSLighthouse/bes_version_history/${version}/${name}`}
  }
  if (linkStatusLength !== 0) {
    return (
      <Link to={myObject}>Click here</Link>
    );
  }
  return (
    <Typography variant="subtitle1" color="inherit">
      Not Available
    </Typography>
  );
};

function AssessmentReport({ title, name, version, ...other }: any) {
  const report: string[] = [
    "Scorecard",
    "Criticality Score",
    "Sonarqube",
    "Codeql",
    "SBOM",
    "Fossology",
    "Fuzz Report",
    "Snyk",
  ];
  return (
    <Card sx={{ height: "100%" }}>
      <MKBox pt={3} px={3}>
        <MKTypography variant="h5" fontWeight="medium">
          {title}
        </MKTypography>
        <MKBox mt={0} mb={2}></MKBox>
      </MKBox>
      <MKBox p={2}>
        <Grid item xs={12}>
          {report.map((value, index) => {
            return (
              <>
                {dividerDiv(index)}
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          {value}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <CheckLink
                              version={version}
                              name={name}
                              report={value}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            );
          })}
        </Grid>
      </MKBox>
    </Card>
  );
}

export default AssessmentReport;
