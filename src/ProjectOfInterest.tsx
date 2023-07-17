import * as React from "react";
import { useEffect, useState } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";

import SiteWrapper from "./SiteWrapper";
import AppCurrentVisits from "./sections/PieChart";
import ProjectOfInterestTrack from "./ProjectOfInterestTrack";
import { projectOfInterestData } from "./data/poi_data";
import Page from "./components/Page";

export const fetchOsspoiMaterData = async () => {
  const osspoi: any = JSON.parse(
    await projectOfInterestData.getJsonReportOsspoiMaster()
  );
  projectOfInterestData.updateDataPoi("Project_of_interest", osspoi.items);
  return osspoi;
};

async function countLanguages(
  setData: React.Dispatch<React.SetStateAction<never[]>>,
  setTrackedProject: React.Dispatch<React.SetStateAction<number>>,
  setTecStack: React.Dispatch<React.SetStateAction<never[]>>,
  cache: any
) {
  let supportedLanguages: any = {
    python: true,
    java: true,
    javascript: true,
    c: true,
    "c++": true,
    php: true
  };
  const tecStackForChart: any = [];
  const osspoi = await fetchOsspoiMaterData();
  setTrackedProject(osspoi.items.length);
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
  const [data, setData] = useState([]);
  const [trackedProject, setTrackedProject] = useState(0);
  const [tecStack, setTecStack] = useState([]);

  useEffect(() => {
    countLanguages(setData, setTrackedProject, setTecStack, []);
  }, []);
  const theme = useTheme();

  return (
    <SiteWrapper>
      <Page.Content title={`Projects Of Interest: ${trackedProject}`}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Languages"
              chartData={data}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
              subheader={undefined}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="BeS Tech Stack"
              chartData={tecStack}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
              subheader={undefined}
            />
          </Grid>
        </Grid>
        <ProjectOfInterestTrack />
      </Page.Content>
    </SiteWrapper>
  );
}

export default ProjectOfInterest;
