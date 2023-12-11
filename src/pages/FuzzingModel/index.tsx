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

function runLineGraph(
  lineRefStartEvasion: any,
  lineRefStartInference: any,
  lineRefStartExtraction: any,
  lineRefStartDataPoisoning: any,
  lineRefRightEvasion: any,
  lineRefRightInference: any,
  lineRefRightExtraction: any,
  lineRefRightDataPoisoning: any
) {
  const lineOptions = {
    startPlug: "disc",
    color: "red",
    dash: { animation: true }
  };
  const arrow = {
    startPlug: "disc",
    color: "red"
  };
  try {
    //left
    lineRefStartEvasion.current = new LeaderLine(
      document.getElementById("startEvasion"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    lineRefStartInference.current = new LeaderLine(
      document.getElementById("startInference"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    lineRefStartExtraction.current = new LeaderLine(
      document.getElementById("startExtraction"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    lineRefStartDataPoisoning.current = new LeaderLine(
      document.getElementById("startDataPoisoning"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    //Right
    setTimeout(() => {
      lineRefRightEvasion.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightEvasion"),
        arrow
      );
    }, 2000);
    setTimeout(() => {
      lineRefRightInference.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightInference"),
        arrow
      );
    }, 3000);

    setTimeout(() => {
      lineRefRightExtraction.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightExtraction"),
        arrow
      );
    }, 4000);

    setTimeout(() => {
      lineRefRightDataPoisoning.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightDataPoisoning"),
        arrow
      );
    }, 5000);
  } catch (e) {
    // ignore
  }
}

function FuzzingModelPage() {
  const lineRefStartEvasion: any = React.useRef(null);
  const lineRefStartInference: any = React.useRef(null);
  const lineRefStartExtraction: any = React.useRef(null);
  const lineRefStartDataPoisoning: any = React.useRef(null);
  const lineRefRightEvasion: any = React.useRef(null);
  const lineRefRightInference: any = React.useRef(null);
  const lineRefRightExtraction: any = React.useRef(null);
  const lineRefRightDataPoisoning: any = React.useRef(null);
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = React.useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    verifyLink(link, setreport).then((data) => {
      if (data)
        setTimeout(
          () =>
            runLineGraph(
              lineRefStartEvasion,
              lineRefStartInference,
              lineRefStartExtraction,
              lineRefStartDataPoisoning,
              lineRefRightEvasion,
              lineRefRightInference,
              lineRefRightExtraction,
              lineRefRightDataPoisoning
            ),
          200
        );
    });
    return () => {
      lineRefStartEvasion && lineRefStartEvasion.current.remove();
      lineRefStartInference && lineRefStartInference.current.remove();
      lineRefStartExtraction && lineRefStartExtraction.current.remove();
      lineRefStartDataPoisoning && lineRefStartDataPoisoning.current.remove();
      lineRefRightEvasion && lineRefRightEvasion.current.remove();
      lineRefRightInference && lineRefRightInference.current.remove();
      lineRefRightExtraction && lineRefRightExtraction.current.remove();
      lineRefRightDataPoisoning && lineRefRightDataPoisoning.current.remove();
    };
  }, []);
  return (
    <div>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} pr={2} pl={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p style={{paddingLeft: "15%", color: "red"}}>ATTACKS</p>
          </Grid>
          <Grid item xs={6}>
            <p style={{paddingLeft: "2%", color: "#587f2f"}}>Model: {selectedFuzz.name}</p>
          </Grid>
          <Grid item xs={2}>
            <p style={{color: "red"}}>OUTCOMES</p>
          </Grid>
        </Grid>
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
