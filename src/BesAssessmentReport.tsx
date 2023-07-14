import React, { useEffect, useState } from "react";

import SiteWrapper from "./SiteWrapper";
import { useParams } from "react-router-dom";
import { Card } from "@mui/material";
import Scorecard from "./report/scorecard/Scorecard";
import ScorecardTable from "./report/scorecard/ScorecardTable";
import { assessment_datastore } from "./data-store/dataStore";
import {
  assessment_path,
  assessment_report,
} from "./data-store/assessmentReport";
import { verifyLink } from "./sections/AssessmentReport";
import CodeQL from "./report/codeQL/CodeQL";
import Sonarqube from "./report/sonarqube/Sonarqube";
import Sbom from "./report/sbom/Sbom";
import Fossology from "./report/fossology/Fossology";
import Page from "./components/Page";

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
    <SiteWrapper>
      <Page.Content key={"pagekey"} title={`${besReport} Report: ${besName}`}>
        <Card key={"cardkey"}>
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
        </Card>
        {displayReport(besReport, report)}
      </Page.Content>
    </SiteWrapper>
  );
}

export default BesAssessmentReport;
