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
        if (!riskAnalysisCount["No Quality Control"]) {
          riskAnalysisCount["No Quality Control"] = 0;
        }
        riskAnalysisCount["No Quality Control"]++;
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



function ModelOfInterest() {
  const [report, setreport]: any = useState([]);
  const [modelType, setModelType]: any = useState([]);
  const [riskAnalysis, setRiskAnalysis]: any = useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedReport = await verifyLink(modelOfInterestData, setreport);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (report.length > 0) {
      prepPieChartData(setModelType, setRiskAnalysis, [], report);
    }
  }, [report, setModelType, setRiskAnalysis]);

  const count = report.length;

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={3}>
          <Grid item style={{ width: "33.3%"}}>
            <MKBox mb={3} style={{height: "20%"}}>
              <Card >
                {/* <MKBox> */}
                  {/* <MKBox pt={1} pb={1} px={1}> */}
                    <MKTypography
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      variant="h5"
                      textTransform="capitalize"
                    // style={{fontSize: "30px"}}

                    >
                      Model Count
                    </MKTypography>
                    <MKTypography
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      variant="h5"
                      textTransform="capitalize"
                      style={{ fontSize: "70px" }}

                    >
                      {count}
                    </MKTypography>
                  {/* </MKBox> */}
                {/* </MKBox> */}
              </Card>
            </MKBox>
          </Grid>
          <Grid item style={{ width: "33.3%"}}>
            <MKBox mb={3}>
              {/* Calling Language component for showing model type */}
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
          <Grid item style={{ width: "33.3%"}}>
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
        </Grid>
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
