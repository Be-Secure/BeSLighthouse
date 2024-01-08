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
import { usePrintReport } from "./sample";

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
    <MKBox pt={2}>
      <Grid container spacing={2} style={{ textAlign: "center", fontSize: "18px"}}>
        {/* <tr> */}
        <Grid item style={{ width: "20%" }}>
          Model Count: {modelCount}
        </Grid>

        <Grid item style={{ width: "32%" }}>
          <Card>
            Types: Classic = {classicCount} | LLM = {llmCount}
          </Card>
        </Grid>
        {/* </Card> */}
        <Grid item style={{ width: "48%" }}>
          <Card>
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
  const data = usePrintReport();
  React.useEffect(() => {
    // console.log("length:"+dataLength);
    verifyLink(modelOfInterestData, setReport);

  }, []);

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} sx={{ mx: { xs: 2, lg: 3 } }}>
        <MKTypography
          display="flex"
          alignItems="left"
          variant="h5"
        >
          Models of Interest
        </MKTypography>
        <MKTypography
          style={{ paddingTop: "2px" }}
          display="flex"
          alignItems="left"
          variant="h8"
        >
          Uncovering vulnerabilities and strengthening defenses in AI models
        </MKTypography>
        <MKBox>

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
