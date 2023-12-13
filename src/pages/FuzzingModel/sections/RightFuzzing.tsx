import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import AttackVulnerabilityReport from "../AttackType/AttackVulnerabilityReport";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { useLocation } from "react-router-dom";

function RightFuzzing() {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  let [loadingEvasion, setLoadingEvasion] = useState(true);
  let [loadingInference, setLoadingInference] = useState(true);
  let [loadingExtraction, setLoadingExtraction] = useState(true);
  let [loadingDataPoisoning, setLoadingDataPoisoning] = useState(true);
  
  const [evasion, evasionSetreport]: any = React.useState({});
  const [inference, inferenceSetreport]: any = React.useState({});
  const [extraction, extractionSetreport]: any = React.useState({});
  const [dataPoisoning, dataPoisoningSetreport]: any = React.useState({});

  React.useEffect(() => {
    try {
      setTimeout(setLoadingEvasion, 2000);
      setTimeout(setLoadingInference, 3000);
      setTimeout(setLoadingExtraction, 4000);
      setTimeout(setLoadingDataPoisoning, 5000);
    } catch (e) {
      //ignore
    }
    let evasionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/VulnerabilityReport.json`;
    let inferenceLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/inference/VulnerabilityReport.json`;
    let extractionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/extraction/VulnerabilityReport.json`;
    let dataPoisoningLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/dataPoisoning/VulnerabilityReport.json`;
    verifyLink(evasionLink, evasionSetreport);
    verifyLink(inferenceLink, inferenceSetreport);
    verifyLink(extractionLink, extractionSetreport);
    verifyLink(dataPoisoningLink, dataPoisoningSetreport);
  }, []);
  return (
    <Grid container width="34%">
      <Grid item width={"80%"} ml="auto">
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightEvasion"
            position={{ color: "info" }}
            name="Evasion"
            cardSide={true}
            textAllign="center"
            attackTimmer={loadingEvasion}
            report={evasion}
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightInference"
            position={{ color: "info" }}
            name="Inference"
            cardSide={true}
            textAllign="center"
            attackTimmer={loadingInference}
            report={inference}
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightExtraction"
            position={{ color: "info" }}
            name="Extraction"
            cardSide={true}
            textAllign="center"
            attackTimmer={loadingExtraction}
            report={extraction}
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightDataPoisoning"
            position={{ color: "info" }}
            name="Data Poisoning"
            cardSide={true}
            textAllign="center"
            attackTimmer={loadingDataPoisoning}
            report={dataPoisoning}
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default RightFuzzing;
