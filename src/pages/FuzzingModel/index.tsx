import React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";

function FuzzingModelPage() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <Grid container spacing={-10} pt={7} pl={2}>
        <LeftFuzzing />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>
    </>
  );
}

export default FuzzingModelPage;
