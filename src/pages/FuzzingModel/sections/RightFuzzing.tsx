import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import AttackVulnerabilityReport from "../AttackType/AttackVulnerabilityReport";

function RightFuzzing() {
  let [loadingEvasion, setLoadingEvasion] = useState(true);
  let [loadingInference, setLoadingInference] = useState(true);
  let [loadingExtraction, setLoadingExtraction] = useState(true);
  let [loadingDataPoisoning, setLoadingDataPoisoning] = useState(true);
  React.useEffect(() => {
    setTimeout(setLoadingEvasion, 2000);
    setTimeout(setLoadingInference, 3000);
    setTimeout(setLoadingExtraction, 4000);
    setTimeout(setLoadingDataPoisoning, 5000);
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
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default RightFuzzing;
