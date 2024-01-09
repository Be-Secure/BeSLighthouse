import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import MKBox from "../../components/MKBox";
import routes from "../../routes";
import ModelDisplay from "./ModelDisplay";
import MKTypography from "../../components/MKTypography";
import { useState } from "react";
import { verifyLink } from "../ShowModelDetails/AssessmentSummary";
import { modelOfInterestData } from "../../dataStore";
import networkIcon from "../../assets/images/network.png"

function statsTable(data: any) {

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>; // Return a message if data is empty or not an array
  }

  const modelCount = data.length;
  const classicCount = data.filter((item: { type: string }) => item.type === "Classic").length;
  const llmCount = data.filter((item: { type: string }) => item.type === "LLM").length;

  const sastCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.includes("SAST")).length;
  const fuzzCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.includes("Fuzz Test")).length;
  const emptyAnalysisCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.length === 0).length;
  return (
    <MKBox >
      <Grid container spacing={2} style={{ textAlign: "center", fontSize: "18px"}}>
        <Grid item style={{ width: "20%" }}>
          <Card style={{ height: "40px", display: "grid", placeItems: "center" }}>

            Models: {modelCount}
          </Card>
        </Grid>

        <Grid item style={{ width: "32%" }}>
        <Card style={{ height: "40px", display: "grid", placeItems: "center" }}>
            Classic Models: {classicCount} | LLMs: {llmCount}
          </Card>
        </Grid>
        <Grid item style={{ width: "48%" }}>
        <Card style={{ height: "40px", display: "grid", placeItems: "center" }}>
            Risk Analysis: SAST = {sastCount} | Fuzz Test = {fuzzCount} | Unanalyzed = {emptyAnalysisCount}
          </Card>
        </Grid>
      </Grid>
    </MKBox>
  );
}



function ModelOfInterest() {
  const [report, setReport]: any = useState();
  const [modelType, setModelType]: any = useState();
  const [riskAnalysis, setRiskAnalysis]: any = useState();
  React.useEffect(() => {
    verifyLink(modelOfInterestData, setReport);

  }, []);

  return (
    <>
      <DefaultNavbar routes={routes} sticky />

      <MKBox pt={11} sx={{ mx: { xs: 2, lg: 3 } }}>
        <MKTypography
          display="flex"
          alignItems="left"
          variant="h1"
          color="black"
          width="fit-content"
        >
          Models of Interest
        </MKTypography>
        <MKTypography
          display="flex"
          alignItems="left"
          color="black"
          paddingTop="2px"
          fontSize="20px"
          width="75%"
          style={{ fontWeight: "lighter" }}
          // fontWeight="lighter"
        >
          Gain visibility into vulnerabilities and security gaps within popular open source machine learning models. Empower your strategies for safer, more robust AI implementations. Navigate the Landscape of Open Source AI Risks. Delve into the strengths, weaknesses, and steps to fortify your models against potential threats in the ever-evolving realm of open source machine learning.
        </MKTypography>
      <img style={{ width: "150px", position: "absolute", right: "92px", top: "95px"}} src={networkIcon} />


        <MKBox pt={6}>

          {statsTable(report)}

        </MKBox>

      </MKBox>
      <MKBox pt={2} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MKBox>
                <ModelDisplay />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ModelOfInterest;
