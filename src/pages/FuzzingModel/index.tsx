import React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
// import { Card } from "@mui/material";
import MKBox from "../../components/MKBox";
import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";

function FuzzingModelPage() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <Grid container spacing={3} pt={14} pl={4}>
        <LeftFuzzing />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>
    </>
  );
}

export default FuzzingModelPage;
