
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import routes from "../../routes";
import LeaderLine from "react-leader-line";

import LeftFuzzing from "./sections/LeftFuzzing";
import DefenseSummary from "./sections/DefenseSummary";
import { Grid } from "@mui/material";
import RightFuzzing from "./sections/RightFuzzing";
import MKBox from "../../components/MKBox";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { fetchJsonData } from "../BesVersionHistory/AssessmentReport";
import MKTypography from "../../components/MKTypography";
import aishieldLogo from "../../assets/images/aishield_logo.png";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";

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
    // left
    lineRefStartEvasion.current = new LeaderLine(
      document.getElementById("startEvasion"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    // Right
    setTimeout(() => {
      if (document.getElementById("RightEvasion")) {
        lineRefRightEvasion.current = new LeaderLine(
          document.getElementById("arrowpass"),
          document.getElementById("RightEvasion"),
          arrow
        );
      }
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
    // left
    lineRefStartInference.current = new LeaderLine(
      document.getElementById("startInference"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    // Right
    setTimeout(() => {
      if (document.getElementById("RightInference")) {
        lineRefRightInference.current = new LeaderLine(
          document.getElementById("arrowpass"),
          document.getElementById("RightInference"),
          arrow
        );
      }
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
    // left
    lineRefStartExtraction.current = new LeaderLine(
      document.getElementById("startExtraction"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    // Right
    setTimeout(() => {
      if (document.getElementById("RightExtraction")) {
        lineRefRightExtraction.current = new LeaderLine(
          document.getElementById("arrowpass"),
          document.getElementById("RightExtraction"),
          arrow
        );
      }
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
    // left
    lineRefStartDataPoisoning.current = new LeaderLine(
      document.getElementById("startDataPoisoning"),
      document.getElementById("arrowpass"),
      lineOptions
    );
    // Right
    setTimeout(() => {
      if (document.getElementById("RightDataPoisoning")) {
        lineRefRightDataPoisoning.current = new LeaderLine(
          document.getElementById("arrowpass"),
          document.getElementById("RightDataPoisoning"),
          arrow
        );
      }
    }, 5000);
  } catch (e) {
    // ignore
  }
}

function FuzzingModel() {
  const lineRefStartEvasion: any = React.useRef(null);
  const lineRefStartInference: any = React.useRef(null);
  const lineRefStartExtraction: any = React.useRef(null);
  const lineRefStartDataPoisoning: any = React.useRef(null);
  const lineRefRightEvasion: any = React.useRef(null);
  const lineRefRightInference: any = React.useRef(null);
  const lineRefRightExtraction: any = React.useRef(null);
  const lineRefRightDataPoisoning: any = React.useRef(null);
  const location = useLocation();
  const name: string = location.state.selectedFuzz;
  const [evasion, evasionSetreport]: any = React.useState({});
  const [inference, inferenceSetreport]: any = React.useState({});
  const [extraction, extractionSetreport]: any = React.useState({});
  const [dataPoisoning, dataPoisoningSetreport]: any = React.useState({});
  React.useEffect(() => {
    const evasionLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/evasion/JobMetadata.json`;
    const inferenceLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/inference/JobMetadata.json`;
    const extractionLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/extraction/JobMetadata.json`;
    const dataPoisoningLink = `${besecureMlAssessmentDataStore}/${name}/fuzz-test/dataPoisoning/JobMetadata.json`;
    fetchJsonData(evasionLink, evasionSetreport).then((data) => {
      if (data)
        setTimeout(
          () => { evasionLineGraph(lineRefStartEvasion, lineRefRightEvasion); },
          200
        );
    });
    fetchJsonData(inferenceLink, inferenceSetreport).then((data) => {
      if (data)
        setTimeout(
          () => { inferenceLineGraph(lineRefStartInference, lineRefRightInference); },
          200
        );
    });

    fetchJsonData(extractionLink, extractionSetreport).then((data) => {
      if (data)
        setTimeout(
          () => { extractionLineGraph(lineRefStartExtraction, lineRefRightExtraction); },
          200
        );
    });
    fetchJsonData(dataPoisoningLink, dataPoisoningSetreport).then((data) => {
      if (data)
        setTimeout(
          () => {
            dataPoisoningLineGraph(
              lineRefStartDataPoisoning,
              lineRefRightDataPoisoning
            );
          },
          200
        );
    });
    return () => {
      try {
        lineRefStartEvasion?.current?.remove();
        lineRefStartInference?.current?.remove();
        lineRefStartExtraction?.current?.remove();
        lineRefStartDataPoisoning?.current?.remove();
        lineRefRightEvasion?.current?.remove();
        lineRefRightInference?.current?.remove();
        lineRefRightExtraction?.current?.remove();
        lineRefRightDataPoisoning?.current?.remove();
      } catch (e) {
        // ignore
        console.log(e);
      }
    };
  }, []);
  return (
    <div>
      <DefaultNavbar routes={ routes } sticky />
      <MKBox pt={ 9 } pr={ 2 } pl={ 2 }>
        <Grid container spacing={ 2 }>
          <Grid item xs={ 4 }>
            <p style={ { paddingLeft: "15%", color: "red" } }>ATTACKS</p>
          </Grid>
          <Grid item xs={ 6 }>
            <p
              style={ {
                paddingLeft: "12%",
                paddingRight: "41%",
                color: "#587f2f",
                textAlign: "center"
              } }
            >
              Model: { name }
            </p>
          </Grid>
          <Grid item xs={ 2 }>
            <p style={ { color: "red", textAlign: "center", paddingRight: "12%" } }>OUTCOMES</p>
          </Grid>
        </Grid>
      </MKBox>

      <Grid container pl={ 2 } style={ { placeContent: "space-between" } }>
        <LeftFuzzing
          evasion={ evasion }
          inference={ inference }
          extraction={ extraction }
          dataPoisoning={ dataPoisoning }
        />
        <DefenseSummary />
        <RightFuzzing />
      </Grid>

      <Grid container style={ { width: "100%", placeContent: "center", alignItems: "center", height: "22px", position: "absolute" } }>
        <Grid item>

          <MKTypography style={ { fontSize: "12px" } }>
            Powered by
          </MKTypography>
        </Grid>
        <Grid item style={ { paddingLeft: "8px" } }>
          <a
            style={ {
              color: "grey",
              cursor: "pointer"
            } }
            href={ `https://www.boschaishield.com/` }
            title={ "Click to view boschaishield webpage" }
            target="_blank"
          >
            <img style={ { width: "60px", height: "75px", paddingTop: "6px" } } src={ aishieldLogo } />
          </a>
        </Grid>
      </Grid>

    </div>
  );
}

export default FuzzingModel;
