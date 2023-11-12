import * as React from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// React components
import MKBox from "../../../components/MKBox";

// React examples
import DefaultCounterCard from "../../../examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" py={3}>
        <Grid container item style={{maxWidth: '100%'}}>
          <Grid item xs={1} md={2.4}>
            <DefaultCounterCard
              count={1}
              title="Security risk"
              description="Understand the security risk of an OSS project before consuming the code."
            />
          </Grid>
          <Grid item xs={1} md={2.4} display="flex">
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              count={2}
              title="Roadmap"
              description="Stay aligned to a well-defined security roadmap."
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={1} md={2.4} display="flex">
            <DefaultCounterCard
              count={3}
              title="Visibility"
              description="Gain visibility into threat vectors and proactively manage security."
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={1} md={2.4} display="flex">
            <DefaultCounterCard
              count={4}
              title="Patching"
              description="Improve timely patching of OSS, driven by a defined security roadmap."
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={1} md={2.4}>
            <DefaultCounterCard
              count={5}
              title="Risk Mitigation"
              description="Empower developers to define risk mitigation measures for OSS components based on their security levels."
            />
          </Grid>
        </Grid>
    </MKBox>
  );
}

export default Counters;
