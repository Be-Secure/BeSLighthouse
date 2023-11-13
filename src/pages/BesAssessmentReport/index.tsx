import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assessment_datastore } from "../../dataStore";
import {
  assessment_path,
  assessment_report,
} from "../../utils/assessmentReport";
import { verifyLink } from "../BesVersionHistory/AssessmentReport";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import ScorecardTable from "./Scorecard/scorecardTable";
import CodeQL from "./CodeQL";
import Sonarqube from "./Sonarqube";
import Fossology from "./Fossology";
import Sbom from "./SBOM";
import Scorecard from "./Scorecard";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

export const spanStyle: any = {
  fontSize: "1rem",
  fontWeight: 700,
  paddingRight: "13px",
};

function displayReport(besReport: any, report: any): any {
  if (besReport === "Scorecard") {
    return <ScorecardTable data={report} />;
  }
  if (besReport === "Codeql") {
    return <CodeQL data={report} />;
  }
  if (besReport === "Sonarqube") {
    return <Sonarqube data={report} />;
  }
  if (besReport === "Fossology") {
    return <Fossology data={report} />;
  }
  if (besReport === "SBOM") {
    return <Sbom data={report} />;
  }
}

function BesAssessmentReport() {
  let { besName, besVersion, besReport }: any = useParams();
  besName = besName.slice(1);
  besVersion = besVersion.slice(1);
  besReport = besReport.slice(1);
  const [report, setreport]: any = useState({});
  useEffect(() => {
    const link: string = `${assessment_datastore}/${besName}/${besVersion}/${assessment_path[besReport]}/${besName}-${besVersion}-${assessment_report[besReport]}-report.json`;
    verifyLink(link, setreport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox minHeight="12vh" width="100%"></MKBox>
      <MKBox key={"cardkey"} sx={{mx: { xs: 2, lg: 3 }}}>
        {besReport === "Scorecard" ? (
          <Scorecard
            date={report?.date ?? ""}
            version={report?.scorecard?.version ?? ""}
            github={report?.repo?.name ?? ""}
            commit={report?.scorecard?.commit ?? ""}
            score={report?.score ?? ""}
          />
        ) : (
          <></>
        )}
      </MKBox>
      <MKBox >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{mx: { xs: 2, lg: 3 }}}>
              <MKBox >{displayReport(besReport, report)}</MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default BesAssessmentReport;
