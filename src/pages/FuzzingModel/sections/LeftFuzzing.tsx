import React from "react";

import Grid from "@mui/material/Grid";
import ModelAttack from "../AttackType/ModelAttack";

function LeftFuzzing({ report }: any) {
  return (
    <Grid container width="26%">
      <Grid item width={"70%"}>
        <ModelAttack
          keyvalue="startEvasion"
          name="Evasion"
          position={{ color: "info" }}
          description="Modify input data in a way that the AI model's predictions are manipulated."
          report={report}
        />
        <ModelAttack
          keyvalue="startInference"
          name="Inference"
          position={{ color: "info" }}
          description="Determine whether a specific data point was part of the training dataset."
          report={report}
        />
        <ModelAttack
          keyvalue="startExtraction"
          name="Extraction"
          position={{ color: "info" }}
          description="Determine whether a specific data point was part of the training dataset."
          report={report}
        />
        <ModelAttack
          keyvalue="startDataPoisoning"
          name="Data Poisoning"
          position={{ color: "info" }}
          description="Determine whether a specific data point was part of the training dataset."
          report={report}
        />
      </Grid>
    </Grid>
  );
}

export default LeftFuzzing;
