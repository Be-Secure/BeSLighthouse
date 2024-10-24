import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import AttackVulnerabilityReport from "../AttackType/AttackVulnerabilityReport";
import { fetchJsonData } from "../../BesVersionHistory/AssessmentReport";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { useLocation } from "react-router-dom";

function RightFuzzing() {
  const location = useLocation();
  const modelName: string = location.state.selectedFuzz;
  const [loadingEvasion, setLoadingEvasion] = useState(true);
  const [loadingInference, setLoadingInference] = useState(true);
  const [loadingExtraction, setLoadingExtraction] = useState(true);
  const [loadingDataPoisoning, setLoadingDataPoisoning] = useState(true);

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
      // ignore
    }
    const evasionLink = `${besecureMlAssessmentDataStore}/${modelName}/fuzz-test/evasion/VulnerabilityReport.json`;
    const inferenceLink = `${besecureMlAssessmentDataStore}/${modelName}/fuzz-test/inference/VulnerabilityReport.json`;
    const extractionLink = `${besecureMlAssessmentDataStore}/${modelName}/fuzz-test/extraction/VulnerabilityReport.json`;
    const dataPoisoningLink = `${besecureMlAssessmentDataStore}/${modelName}/fuzz-test/dataPoisoning/VulnerabilityReport.json`;
    fetchJsonData(evasionLink, evasionSetreport);
    fetchJsonData(inferenceLink, inferenceSetreport);
    fetchJsonData(extractionLink, extractionSetreport);
    fetchJsonData(dataPoisoningLink, dataPoisoningSetreport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid container width={ "17%" } mr={ 2 }>
      <Grid item width={ "100%" }>
        <MKBox mb={ 1 }>
          <AttackVulnerabilityReport
            keyvalue="RightEvasion"
            position={ { color: "info" } }
            name="Evasion"
            cardSide={ true }
            textAllign="center"
            attackTimmer={ loadingEvasion }
            report={ evasion }
          />
          <AttackVulnerabilityReport
            keyvalue="RightInference"
            position={ { color: "info" } }
            name="Inference"
            cardSide={ true }
            textAllign="center"
            attackTimmer={ loadingInference }
            report={ inference }
          />

          <AttackVulnerabilityReport
            keyvalue="RightExtraction"
            position={ { color: "info" } }
            name="Extraction"
            cardSide={ true }
            textAllign="center"
            attackTimmer={ loadingExtraction }
            report={ extraction }
          />

          <AttackVulnerabilityReport
            keyvalue="RightDataPoisoning"
            position={ { color: "info" } }
            name="Data Poisoning"
            cardSide={ true }
            textAllign="center"
            attackTimmer={ loadingDataPoisoning }
            report={ dataPoisoning }
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default RightFuzzing;
