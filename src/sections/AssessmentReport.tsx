// @mui
import PropTypes from "prop-types";
import { Card, Typography, CardContent, Grid, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJsonReportOsspoiMaster } from "../utils/fatch_json_report";
import { assessment_datastore } from "../data-store/dataStore";
import {
  assessment_path,
  assessment_report,
} from "../data-store/assessmentReport";
import { Link } from "react-router-dom";

AssessmentReport.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  version: PropTypes.string,
};

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
  const [linkStatus, setLinkStatus]: any = useState({});
  debugger;
  useEffect(() => {
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
  const pathName: string = `/bes_assessment_report/:${name}/:${version}/:${report}`;
  if (report === "Scorecard" && linkStatusLength !== 0) {
    return (
      <Link to={{ pathname: pathName, state: linkStatus }}>
        {linkStatus.score}
      </Link>
    );
    // href={`/bes_version_history/${version}/${name}`}
  }
  if (linkStatusLength !== 0) {
    debugger;
    return (
      <Link to={{ pathname: pathName, state: linkStatus }}>Click here</Link>
    );
  }
  return (
    <Typography variant="subtitle1" color="inherit">
      Not Available
    </Typography>
  );
};

export default function AssessmentReport({
  title,
  name,
  version,
  ...other
}: any) {
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
    <Card {...other}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid
              container
              alignContent="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h5">{title}</Typography>
              </Grid>
            </Grid>
          </Grid>
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
        </Grid>
      </CardContent>
    </Card>
  );
}
