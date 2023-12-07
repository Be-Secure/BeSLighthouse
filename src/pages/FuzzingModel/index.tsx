import * as React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import LeaderLine from "react-leader-line";

import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Card, Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";
import MKBox from "../../components/MKBox";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../BesVersionHistory/AssessmentReport";

function runLineGraph() {
  const lineOptions = {
    startPlug: "disc",
    color: "red",
    dash: { animation: true }
  };
  const arrow = {
    startPlug: "disc",
    color: "red"
  };
  const deffencearrow = {
    startPlug: "disc",
    color: "green"
  };
  try {
    //left
    new LeaderLine(
      document.getElementById("startEvasion"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    new LeaderLine(
      document.getElementById("startInference"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    new LeaderLine(
      document.getElementById("startExtraction"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    new LeaderLine(
      document.getElementById("startDataPoisoning"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    //Right
    new LeaderLine(
      document.getElementById("arrowpass"),
      document.getElementById("RightEvasion"),
      arrow
    );
    new LeaderLine(
      document.getElementById("arrowpass"),
      document.getElementById("RightInference"),
      arrow
    );
    new LeaderLine(
      document.getElementById("arrowpass"),
      document.getElementById("RightExtraction"),
      arrow
    );
    new LeaderLine(
      document.getElementById("arrowpass"),
      document.getElementById("RightDataPoisoning"),
      arrow
    );
    new LeaderLine(
      document.getElementById("arrowpass"),
      document.getElementById("defensesummaryarrow"),
      deffencearrow
    );
  } catch (e) {
    // ignore
  }
}

function FuzzingModelPage() {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = React.useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    verifyLink(link, setreport).then((data) => {
      if (data) setTimeout(runLineGraph, 200);
    });
  }, []);
  return (
    <div>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} pr={2} pl={2}>
        <Card style={{ textAlign: "center" }}>bes-image-classification</Card>
      </MKBox>
      <Grid container pl={2}>
        <LeftFuzzing report={report} />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>
    </div>
  );
}

export default FuzzingModelPage;
