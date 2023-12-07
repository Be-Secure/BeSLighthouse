import React from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import ModelAttack from "../AttackType/ModelAttack";

function LeftFuzzing() {
  return (
    <Grid container width="26%">
      <Grid item width={"70%"}>
        <MKBox mb={1}>
          <ModelAttack
            name="Evasion"
            position={{ color: "info" }}
            description="Modify input data in a way that the AI model's predictions are manipulated."
          />
        </MKBox>
        <MKBox mb={1}>
          <ModelAttack
            name="Inference"
            position={{ color: "info" }}
            description="Determine whether a specific data point was part of the training dataset."
          />
        </MKBox>
        <MKBox mb={1}>
          <ModelAttack
            name="Extraction"
            position={{ color: "info" }}
            description="Determine whether a specific data point was part of the training dataset."
          />
        </MKBox>
        <MKBox mb={1}>
          <ModelAttack
            name="Data Poisoning"
            position={{ color: "info" }}
            description="Determine whether a specific data point was part of the training dataset."
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default LeftFuzzing;
