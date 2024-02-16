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
import MKTypography from "../../components/MKTypography";
import ProjectCount from "./ProjectCount";

import ProjectLogo from "../../assets/images/bug.png";
import ScrollableTabsButtonVisible from "./FilterPoi";

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
  setProject: React.Dispatch<React.SetStateAction<never[]>>,
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
  setProject(osspoi);
  setTecStack(tecStackForChart);
  setData(cache);
}

function ProjectOfInterest() {
  const [data, setData] = React.useState([]);
  const [tecStack, setTecStack] = React.useState([]);
  const [project, setProject]: any = React.useState([]);
  React.useEffect(() => {
    countLanguages(setData, setTecStack, setProject, []);
  }, []);
  const theme = useTheme();
  const [filterData, setFilterData]: any = React.useState({
    BeSTecStack: "",
    SD: "",
    TDU: "",
    IND: "",
    TDC: "",
    COM: "",
    Languages: ""
  });
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={8} sx={{ mx: { xs: 2, lg: 3 } }}>
        <MKTypography variant="h3" color="black">
          Projects of Interest
        </MKTypography>
        <MKTypography
          display="flex"
          alignItems="left"
          color="black"
          paddingTop="2px"
          fontSize="18px"
          width="100%"
          style={{ fontWeight: "lighter" }}
          // fontWeight="lighter"
        >
          Empower your development teams with unparalleled insights into your
          open source software supply chain. BeSecure assesses their risk
          posture, ensuring your codebase remains secure and compliant. Stay
          ahead in the fast-paced world of software development with our
          comprehensive solution, safeguarding your projects from potential
          vulnerabilities.
        </MKTypography>
      </MKBox>
      <MKBox pt={1} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
            <ProjectCount
              title="projects tracked"
              total={project?.items?.length}
              color="success"
              icon={
                <img
                  style={{ width: "140px", top: "58px", position: "absolute" }}
                  alt="icon"
                  src={ProjectLogo}
                />
              }
              sx={{ width: "100%", height: "244px" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
            <Language
              title="Languages"
              chartData={data}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
                theme.palette.secondary.main
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
            <TecStack
              title="Be-Secure Technology Stacks"
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
                theme.palette.secondary.main
              ]}
              chartData={tecStack}
            />
          </Grid>
        </Grid>
      </MKBox>
      <ScrollableTabsButtonVisible
        filter={filterData}
        setFilter={setFilterData}
      />
      <MKBox pt={1} pb={3}>
        <Card sx={{ mx: { xs: 2, lg: 3 } }}>
          <MKBox>
            <ProjectDisplay selectedFilter={filterData} />
          </MKBox>
        </Card>
      </MKBox>
    </>
  );
}

export default ProjectOfInterest;
