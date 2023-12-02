import React from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import HorizontalModelFuzzCard from "../../../assets/theme/components/card/HorizontalModelFuzzCard";

function DefenseSummary() {
  return (
    <Grid container pr={2} width="30%">
      <Grid item>
        <MKBox mb={1}>
          <HorizontalModelFuzzCard
            name="Timeseries-anomaly-detection"
            position={{ color: "info", label: "Model Card" }}
            description=""
          />
        </MKBox>
      </Grid>
      <Grid>
        <MKBox mb={{ xs: 1, lg: 0 }}>
          <HorizontalModelFuzzCard
            name="Defense Summary"
            position={{ color: "info", label: "" }}
            description="Determine whether a specific data point was part of the training dataset."
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default DefenseSummary;
