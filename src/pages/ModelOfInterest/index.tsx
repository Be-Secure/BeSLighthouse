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
import Language from "../../examples/Charts/PieChart/Languages";
import theme from "../../assets/theme";
import { debug } from "console";
import ThreeWayToggle from "../../examples/Button/ThreeWayToggle"
function prepPieChartData(
  setModelType: React.Dispatch<React.SetStateAction<never[]>>,
  setRiskAnalysis: React.Dispatch<React.SetStateAction<never[]>>,
  cache: any,
  data: any
) {
  const modelTypePieData: any = [];
  const modelTypeCount: any = {};
  const riskAnalysisPieData: any = [];
  const riskAnalysisCount: any = {};

  data.forEach((item: any) => {
    if (!modelTypeCount[item["type"]]) {
      modelTypeCount[item["type"]] = 0;
    }
    modelTypeCount[item["type"]]++;

    // Check for the existence of quality_control
    if (item["quality_control"]) {
      if (item["quality_control"].length === 0) {
        // Handling for empty quality_control
        if (!riskAnalysisCount["Unanalyzed"]) {
          riskAnalysisCount["Unanalyzed"] = 0;
        }
        riskAnalysisCount["Unanalyzed"]++;
      } else {
        item["quality_control"].forEach((qc: string) => {
          if (!riskAnalysisCount[qc]) {
            riskAnalysisCount[qc] = 0;
          }
          riskAnalysisCount[qc]++;
        });
      }
    }
  });

  for (let model of Object.keys(modelTypeCount)) {
    modelTypePieData.push({ label: model, value: modelTypeCount[model] });
  }

  for (let risk of Object.keys(riskAnalysisCount)) {
    riskAnalysisPieData.push({ label: risk, value: riskAnalysisCount[risk] });
  }

  setModelType(modelTypePieData);
  setRiskAnalysis(riskAnalysisPieData);
}

function statsTable(data: any) {

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>; // Return a message if data is empty or not an array
  }

  const modelCount = data.length;
  const classicCount = data.filter((item: { type: string }) => item.type === "Classic").length;
  const llmCount = data.filter((item: { type: string }) => item.type === "LLM").length;
  
  // const classicPercentage = ((classicCount / modelCount) * 100 || 0).toFixed(2);
  // const llmPercentage = ((llmCount / modelCount) * 100 || 0).toFixed(2);

  const sastCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.includes("SAST")).length;
  const fuzzCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.includes("Fuzz Test")).length;
  const emptyAnalysisCount = data.filter((item: any) => Array.isArray(item.quality_control) && item.quality_control.length === 0).length;
  return (
    <MKBox pt={2}>

    <table>
      <tbody>
        <tr>
          <Card style={{ float: "left", display: "inline-block", width:"78%", alignItems: "center" }}>
          <td>Model Count: {modelCount}</td>
          </Card>
          <Card style={{ display: "inline-block", paddingLeft: "3%" }}>
          <td>Type: </td>
          <td>Classic={classicCount}</td>
          <td>LLM={llmCount}</td>
          </Card>
          <td>Analysis: </td>
          <td>SAST={sastCount}</td>
          <td>Fuzz Test={fuzzCount}</td>
          <td>Unanalyzed={emptyAnalysisCount}</td>
          {/* <td>30</td>
          <td>john@example.com</td> */}
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
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

  // React.useEffect(() => {
  //   if (report.length > 0) {

  //   }
  // }, [report, setModelType, setRiskAnalysis]);
  // console.log("report:"+report);
  // // debugger
  // const dataCount = report !== null ? Object.keys(report).length : 0;
  // console.log("Count:"+dataCount)
  // debugger


  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={9} sx={{ mx: { xs: 2, lg: 3 } }}>
        <MKTypography
          display="flex"
          // justifyContent="center"
          alignItems="left"
          variant="h5"
        // textTransform="capitalize"
        >
          Models of Interest
        </MKTypography>
        <MKTypography
          style={{ paddingTop: "2px" }}
          display="flex"
          // justifyContent="center"
          alignItems="left"
          variant="h8"
        // textTransform="capitalize"
        >
          Uncovering vulnerabilities and strengthening defenses in AI models
        </MKTypography>
        <MKBox>

          {statsTable(report)}

        </MKBox>

        {/* <Grid container spacing={3}>
          <Grid item style={{ width: "33.3%" }}>
            <MKBox mb={3} style={{ height: "20%" }}>
              <Card sx={{ height: "470%" }}>
                <MKBox pt={1} pb={1} px={1}>
                <MKTypography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  variant="h5"
                  textTransform="capitalize"

                >
                  Model Count
                </MKTypography>
                <MKTypography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  variant="h5"
                  textTransform="capitalize"
                  style={{ fontSize: "120px", paddingTop: "12%" }}

                >
                  {count}
                </MKTypography>
                </MKBox>
              </Card>
            </MKBox>
          </Grid>
          <Grid item style={{ width: "33.3%" }}>
            <MKBox mb={3}>
              
              <Language
                title="Model Type"
                chartData={modelType}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ]}
              />
            </MKBox>
          </Grid>
          <Grid item style={{ width: "33.3%" }}>
            <MKBox mb={3}>
              <Language
                title="Risk Analysis"
                chartData={riskAnalysis}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ]}
              />
            </MKBox>
          </Grid>
        </Grid> */}
      </MKBox>
      <MKBox pt={5} sx={{ mx: { xs: 2, lg: 3 } }}>
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
