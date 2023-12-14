import React from "react";

import Grid from "@mui/material/Grid";
import ModelAttack from "../AttackType/ModelAttack";

function LeftFuzzing({ evasion, inference, extraction, dataPoisoning  }: any) {
  return (
    <Grid container width="26%">
      <Grid item width={"70%"}>
        <ModelAttack
          keyvalue="startEvasion"
          name="Evasion"
          position={{ color: "info" }}
          description="Manipulate the input to cause incorrect predictions."
          report={evasion}
        />
        <ModelAttack
          keyvalue="startInference"
          name="Inference"
          position={{ color: "info" }}
          description="Adversary determine a specific data point was part of dataset."
          report={inference}
        />
        <ModelAttack
          keyvalue="startExtraction"
          name="Extraction"
          position={{ color: "info" }}
          description="Probe a model's responses to extract information about dataset."
          report={extraction}
        />
        <ModelAttack
          keyvalue="startDataPoisoning"
          name="Data Poisoning"
          position={{ color: "info" }}
          description="Inject misleading data into the training dataset."
          report={dataPoisoning}
        />
      </Grid>
    </Grid>
  );
}

export default LeftFuzzing;
