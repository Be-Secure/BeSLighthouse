import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MKBox from "../../components/MKBox";
import routes from "../../routes";
import ModelDisplay from "./ModelDisplay";
import MKTypography from "../../components/MKTypography";
import { useState } from "react";
import { modelOfInterestData } from "../../dataStore";
import networkIcon from "../../assets/images/network.png";
import ProjectCount from "../ProjectOfInterest/ProjectCount";
import theme from "../../assets/theme";
import { fetchJsonReport } from "../../utils/fatchJsonReport";
import ScrollableTabsButtonVisibleML from "./FilterMoi";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import PieChart from "../../components/Charts/PieChart";

const fetchModelData = async () => {
  const moidata: any = JSON.parse(await fetchJsonReport(modelOfInterestData));
  return moidata;
};

async function prepPieChartData(
  setModelType: React.Dispatch<React.SetStateAction<never[]>>,
  setRiskAnalysis: React.Dispatch<React.SetStateAction<never[]>>,
  setReport: React.Dispatch<React.SetStateAction<never[]>>
) {
  const modelTypePieData: any = [];
  const modelTypeCount: any = {};
  const riskAnalysisPieData: any = [];
  const riskAnalysisCount: any = {};

  const data: any = await fetchModelData();
  data.forEach((item: any) => {
    if (!modelTypeCount[item.type]) {
      modelTypeCount[item.type] = 0;
    }
    modelTypeCount[item.type]++;
    // Check for the existence of quality_control
    if (item.quality_control) {
      if (item.quality_control?.length === 0) {
        // Handling for empty quality_control
        if (!riskAnalysisCount.Unanalyzed) {
          riskAnalysisCount.Unanalyzed = 0;
        }
        riskAnalysisCount.Unanalyzed++;
      } else {
        item.quality_control.forEach((qc: string) => {
          if (!riskAnalysisCount[qc]) {
            riskAnalysisCount[qc] = 0;
          }

          riskAnalysisCount[qc]++;
        });
      }
    }
  });

  for (const model of Object.keys(modelTypeCount)) {
    modelTypePieData.push({ label: model, value: modelTypeCount[model] });
  }

  for (const risk of Object.keys(riskAnalysisCount)) {
    riskAnalysisPieData.push({ label: risk, value: riskAnalysisCount[risk] });
  }

  setModelType(modelTypePieData);
  setReport(data);
  setRiskAnalysis(riskAnalysisPieData);
}

function ModelOfInterest() {
  const [report, setReport]: any = useState([]);
  const [modelType, setModelType]: any = useState([]);
  const [riskAnalysis, setRiskAnalysis]: any = useState([]);

  const [filterData, setFilterData]: any = React.useState({
    ModelType: "",
    RiskAnalysis: ""
  });

  React.useEffect(() => {
    prepPieChartData(setModelType, setRiskAnalysis, setReport);
  }, []);
  return (
    <>
      <DefaultNavbar routes={ routes } sticky />

      <MKBox pt={ 10 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <MKTypography variant="h3" color="black">
          Models of Interest
        </MKTypography>
        <MKTypography
          display="flex"
          alignItems="left"
          color="black"
          paddingTop="2px"
          fontSize="18px"
          width="100%"
          style={ { fontWeight: "lighter" } }
        // fontWeight="lighter"
        >
          Gain visibility into vulnerabilities and security gaps within popular
          open source machine learning models. Empower your strategies for
          safer, more robust AI implementations. Navigate the Landscape of Open
          Source AI Risks. Delve into the strengths and weaknesses to fortify
          your models against potential threats in the ever-evolving realm of
          open source machine learning.
        </MKTypography>
      </MKBox>
      <MKBox pt={ 1 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 4 }>
            <ProjectCount
              title="models tracked"
              total={ report.length }
              color="success"
              icon={
                <img
                  style={ { width: "140px", top: "58px", position: "absolute" } }
                  alt="icon"
                  src={ networkIcon }
                />
              }
              sx={ { width: "100%", height: "244px" } }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 4 }>
            <PieChart
              title="Model Type"
              chartData={ modelType }
              chartColors={ [
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
                theme.palette.secondary.main
              ] }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 4 }>
            <PieChart
              title="Risk Analysis"
              chartData={ riskAnalysis }
              chartColors={ [
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
                theme.palette.secondary.main
              ] }
            />
          </Grid>
        </Grid>
      </MKBox>
      <ScrollableTabsButtonVisibleML
        filter={ filterData }
        setFilter={ setFilterData }
      />
      <MKBox pt={ 2 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <Card>
          <MKBox>
            <ModelDisplay selectedFilter={ filterData } />
          </MKBox>
        </Card>
      </MKBox>
    </>
  );
}

export default ModelOfInterest;
