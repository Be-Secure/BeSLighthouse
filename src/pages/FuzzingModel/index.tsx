import * as React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";

import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Card, Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";
import MKBox from "../../components/MKBox";

function FuzzingModelPage() {
  return (
    <div>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} pr={2} pl={2}>
        <Card style={{textAlign: "center"}}>bes-image-classification</Card>
      </MKBox>
      <Grid container pl={2}>
        <LeftFuzzing />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>
    </div>
  );
}

export default FuzzingModelPage;
