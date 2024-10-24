import React, { useState } from "react";

import { Card, CircularProgress, Grid } from "@mui/material";
import MKTypography from "../../components/MKTypography";
import DefenceReport from "./DefenceReport";
import MKButton from "../../components/MKButton";
import { fetchJsonData } from "../BesVersionHistory/AssessmentReport";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { NavLink, useLocation } from "react-router-dom";

function reportDisplay(report: any) {
  return <DefenceReport report={ report } />;
}

function loadingCircular(loading: any) {
  if (loading) {
    return (
      <CircularProgress
        style={ {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        } }
        color="secondary"
        size={ 60 }
        thickness={ 4 }
      />
    );
  }
}

export default function DefenceData({ report, reportName }: any) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const name: string = location.state.selectedFuzz;

  const [defenceReport, setDefenceReport]: any = React.useState(false);
  const [vulnerabilityReport, setvulnerabilityReport]: any =
    React.useState(false);

  const defenceReportLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/${reportName}/DefenceReport.pdf`;
  const vulnerabilityReportLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/${reportName}/VulnerabilityReport.pdf`;
  React.useEffect(() => {
    fetchJsonData(defenceReportLink, setDefenceReport);
    fetchJsonData(vulnerabilityReportLink, setvulnerabilityReport);
    try {
      setTimeout(setLoading, 6000);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const reportLength = Object.values(report).length;
  return (
    <>
      { loading ? (
        <Card
          style={ {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f2f5",
            padding: "0.4rem",
            width: "100%"
          } }
        >
          { " " }
          { loadingCircular(loading) }
        </Card>
      ) : (
        <Grid container>
          <Grid item width={ "65%" }>
            <Card
              style={ {
                backgroundColor: "#f0f2f5",
                padding: "0.4rem",
                width: "100%",
                margin: "1%"
              } }
            >
              <MKTypography
                variant="body2"
                component="p"
                color="text"
                textAlign="left"
              >
                { reportLength > 0 ? (
                  reportDisplay(report)
                ) : (
                  <MKTypography
                    color="black"
                    textAlign="center"
                    variant="h6"
                    sx={ { margin: "auto" } }
                    pt={ 8 }
                    pb={ 8 }
                  >
                    Not Available
                  </MKTypography>
                ) }
              </MKTypography>
            </Card>
          </Grid>
          <Grid item width={ "35%" } pt={ 3 }>
            { defenceReport ? (
              <NavLink
                to={ defenceReportLink }
                rel="noopener noreferrer"
                style={ { color: "#587f2f", cursor: "pointer" } }
              >
                <MKButton
                  variant={ "gradient" }
                  color={ "info" }
                  size="small"
                  sx={ { width: "80%" } }
                >
                  Defense Report
                </MKButton>
              </NavLink>
            ) : (
              <MKButton
                variant={ "gradient" }
                color={ "info" }
                size="small"
                sx={ { width: "80%" } }
                disabled
              >
                Defense Report
              </MKButton>
            ) }

            { vulnerabilityReport ? (
              <NavLink
                to={ vulnerabilityReportLink }
                rel="noopener noreferrer"
                style={ { color: "#587f2f", cursor: "pointer" } }
              >
                <MKButton
                  variant={ "gradient" }
                  color={ "info" }
                  size="small"
                  sx={ { width: "80%", marginTop: "34%" } }
                >
                  Vulnerability Report
                </MKButton>
              </NavLink>
            ) : (
              <MKButton
                variant={ "gradient" }
                color={ "info" }
                size="small"
                sx={ { width: "80%", marginTop: "34%" } }
                disabled
              >
                Vulnerability Report
              </MKButton>
            ) }
          </Grid>
        </Grid>
      ) }
    </>
  );
}
