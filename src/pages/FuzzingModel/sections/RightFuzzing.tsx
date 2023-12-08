import React from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import AttackVulnerabilityReport from "../AttackType/AttackVulnerabilityReport";

function RightFuzzing() {
  return (
    <Grid container width="34%">
      <Grid item width={"80%"} ml="auto">
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightEvasion"
            position={{ color: "info" }}
            name="Evasion - Vulnerability Report"
            cardSide={true}
            textAllign="center"
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightInference"
            position={{ color: "info" }}
            name="Inference - Vulnerability Report"
            cardSide={true}
            textAllign="center"
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightExtraction"
            position={{ color: "info" }}
            name="Extraction - Vulnerability Report"
            cardSide={true}
            textAllign="center"
          />
        </MKBox>
        <MKBox mb={1}>
          <AttackVulnerabilityReport
            keyvalue="RightDataPoisoning"
            position={{ color: "info" }}
            name="Data Poisoning - Vulnerability Report"
            cardSide={true}
            textAllign="center"
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default RightFuzzing;
