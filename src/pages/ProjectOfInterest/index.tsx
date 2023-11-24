import * as React from "react";

import MKBox from "../../components/MKBox";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";

// Routes
import routes from "../../routes";
import Grid from "@mui/material/Grid";
import Language from "../../examples/Charts/PieChart/Languages";
import { useTheme } from "@mui/material/styles";
import { projectOfInterestData } from "../../utils/poi_data";
import TecStack from "../../examples/Charts/PieChart/TecStacks";
import Card from "@mui/material/Card";
import ProjectDisplay from "../../layouts/pages/projectOfInterest/ProjectDisplay";

export const fetchOsspoiMaterData = async () => {
  const osspoi: any = JSON.parse(
    await projectOfInterestData.getJsonReportOsspoiMaster()
  );
  projectOfInterestData.updateDataPoi("Project_of_interest", osspoi.items);
  return osspoi;
};

async function countLanguages(
  setData: React.Dispatch<React.SetStateAction<never[]>>,
  setTecStack: React.Dispatch<React.SetStateAction<never[]>>,
  cache: any
) {
  let supportedLanguages: any = {
    python: true,
    java: true,
    javascript: true,
    c: true,
    "c++": true,
    php: true,
  };
  const tecStackForChart: any = [];
  const osspoi = await fetchOsspoiMaterData();
  let languageCount: any = {};
  let besTecStack: any = {};
  for (let i = 0; i < osspoi.items.length; i++) {
    if (!besTecStack[osspoi.items[i]["bes_technology_stack"]]) {
      besTecStack[osspoi.items[i]["bes_technology_stack"]] = 0;
    }
    besTecStack[osspoi.items[i]["bes_technology_stack"]]++;
    for (let language of Object.keys(osspoi.items[i].language)) {
      const lan: string = language.toLocaleLowerCase().trim();
      if (supportedLanguages[lan]) {
        if (!languageCount[lan]) {
          languageCount[lan] = 1;
          continue;
        }
        languageCount[lan]++;
      }
    }
  }
  for (let tecStack of Object.keys(besTecStack)) {
    tecStackForChart.push({ label: tecStack, value: besTecStack[tecStack] });
  }
  for (let language of Object.keys(languageCount)) {
    cache.push({ label: language, value: languageCount[language] });
  }
  setTecStack(tecStackForChart);
  setData(cache);
}


function ProjectOfInterest() {
  
  const [data, setData] = React.useState([]);
  const [tecStack, setTecStack] = React.useState([]);
  React.useEffect(() => {
    countLanguages(setData, setTecStack, []);
  }, []);
  const theme = useTheme();

  return (
    <>
      <DefaultNavbar
        routes={routes}
        sticky
      />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 }}}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MKBox mb={3}>
              <Language
                title="Languages"
                chartData={data}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ]}
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MKBox mb={3}>
              <TecStack
                title="Be-Secure Technology Stacks"
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ]}
                chartData={tecStack}
              />
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
      <MKBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{mx: { xs: 2, lg: 3 }}}>
              <MKBox>
                <ProjectDisplay />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ProjectOfInterest;
