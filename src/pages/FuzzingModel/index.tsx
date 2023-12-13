import * as React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import LeaderLine from "react-leader-line";

import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";
import MKBox from "../../components/MKBox";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../BesVersionHistory/AssessmentReport";

const lineOptions = {
  startPlug: "disc",
  color: "red",
  dash: { animation: true }
};
const arrow = {
  startPlug: "disc",
  color: "red"
};

function evasionLineGraph(lineRefStartEvasion: any, lineRefRightEvasion: any) {
  try {
    //left
    lineRefStartEvasion.current = new LeaderLine(
      document.getElementById("startEvasion"),
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
  } catch (e) {
    // ignore
  }
}

function inferenceLineGraph(
  lineRefStartInference: any,
  lineRefRightInference: any
) {
  try {
    //left
    lineRefStartInference.current = new LeaderLine(
      document.getElementById("startInference"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    //Right
    setTimeout(() => {
      lineRefRightInference.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightInference"),
        arrow
      );
    }, 3000);
  } catch (e) {
    // ignore
  }
}

function extractionLineGraph(
  lineRefStartExtraction: any,
  lineRefRightExtraction: any
) {
  try {
    //left
    lineRefStartExtraction.current = new LeaderLine(
      document.getElementById("startExtraction"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    //Right
    setTimeout(() => {
      lineRefRightExtraction.current = new LeaderLine(
        document.getElementById("arrowpass"),
        document.getElementById("RightExtraction"),
        arrow
      );
    }, 4000);
  } catch (e) {
    // ignore
  }
}

function dataPoisoningLineGraph(
  lineRefStartDataPoisoning: any,
  lineRefRightDataPoisoning: any
) {
  try {
    //left
    lineRefStartDataPoisoning.current = new LeaderLine(
      document.getElementById("startDataPoisoning"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    //Right
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
  const [evasion, evasionSetreport]: any = React.useState({});
  const [inference, inferenceSetreport]: any = React.useState({});
  const [extraction, extractionSetreport]: any = React.useState({});
  const [dataPoisoning, dataPoisoningSetreport]: any = React.useState({});
  React.useEffect(() => {
    let evasionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    let inferenceLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/inference/JobMetadata.json`;
    let extractionLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/extraction/JobMetadata.json`;
    let dataPoisoningLink = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/dataPoisoning/JobMetadata.json`;
    verifyLink(evasionLink, evasionSetreport).then((data) => {
      if (data)
        setTimeout(
          () => evasionLineGraph(lineRefStartEvasion, lineRefRightEvasion),
          200
        );
    });
    verifyLink(inferenceLink, inferenceSetreport).then((data) => {
      if (data)
        setTimeout(
          () =>
            inferenceLineGraph(lineRefStartInference, lineRefRightInference),
          200
        );
    });

    verifyLink(extractionLink, extractionSetreport).then((data) => {
      if (data)
        setTimeout(
          () =>
            extractionLineGraph(lineRefStartExtraction, lineRefRightExtraction),
          200
        );
    });
    verifyLink(dataPoisoningLink, dataPoisoningSetreport).then((data) => {
      if (data)
        setTimeout(
          () =>
            dataPoisoningLineGraph(
              lineRefStartDataPoisoning,
              lineRefRightDataPoisoning
            ),
          200
        );
    });
    return () => {
      try {
        lineRefStartEvasion && lineRefStartEvasion?.current.remove();
        lineRefStartInference && lineRefStartInference?.current.remove();
        lineRefStartExtraction && lineRefStartExtraction?.current.remove();
        lineRefStartDataPoisoning &&
          lineRefStartDataPoisoning?.current.remove();
        lineRefRightEvasion && lineRefRightEvasion?.current.remove();
        lineRefRightInference && lineRefRightInference?.current.remove();
        lineRefRightExtraction && lineRefRightExtraction?.current.remove();
        lineRefRightDataPoisoning &&
          lineRefRightDataPoisoning?.current.remove();
      } catch (e) {
        // ignore
      }
    };
  }, []);
  return (
    <div>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} pr={2} pl={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <p style={{ paddingLeft: "15%", color: "red" }}>ATTACKS</p>
          </Grid>
          <Grid item xs={6}>
            <p
              style={{
                paddingLeft: "8%",
                paddingRight: "41%",
                color: "#587f2f"
              }}
            >
              Model: {selectedFuzz.name}
            </p>
          </Grid>
          <Grid item xs={2}>
            <p style={{ color: "red" }}>OUTCOMES</p>
          </Grid>
        </Grid>
      </MKBox>
      <Grid container pl={2}>
        <LeftFuzzing
          evasion={evasion}
          inference={inference}
          extraction={extraction}
          dataPoisoning={dataPoisoning}
        />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>
    </div>
  );
}

export default FuzzingModelPage;
