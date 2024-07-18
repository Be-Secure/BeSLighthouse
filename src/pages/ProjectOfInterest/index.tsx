import * as React from "react";

import MKBox from "../../components/MKBox";

// Routes
import routes from "../../routes";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import ProjectDisplay from "./ProjectDisplay";
import MKTypography from "../../components/MKTypography";
import ProjectCount from "./ProjectCount";

import ProjectLogo from "../../assets/images/bug.png";
import ScrollableTabsButtonVisible from "./FilterPoi";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import { countLanguages } from "./countLanguages";
import PieChart from "../../components/Charts/PieChart";

function ProjectOfInterest() {
  const [data, setData]: any = React.useState([]);
  const [tecStack, setTecStack]: any = React.useState([]);
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
      <DefaultNavbar routes={ routes } sticky />
      <MKBox pt={ 10 } sx={ { mx: { xs: 2, lg: 3 } } }>
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
          style={ { fontWeight: "lighter" } }
        >
          Empower your development teams with unparalleled insights into your
          open source software supply chain. BeSecure assesses their risk
          posture, ensuring your codebase remains secure and compliant. Stay
          ahead in the fast-paced world of software development with our
          comprehensive solution, safeguarding your projects from potential
          vulnerabilities.
        </MKTypography>
      </MKBox>
      <MKBox pt={ 1 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 4 }>
            <ProjectCount
              title="projects tracked"
              total={ project?.items?.length }
              color="success"
              icon={
                <img
                  style={ { width: "140px", top: "58px", position: "absolute" } }
                  alt="icon"
                  src={ ProjectLogo }
                />
              }
              sx={ { width: "100%", height: "244px" } }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 4 }>
            <PieChart
              title="Languages"
              chartData={ data }
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
              title="Be-Secure Technology Stacks"
              chartColors={ [
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
                theme.palette.secondary.main
              ] }
              chartData={ tecStack }
            />
          </Grid>
        </Grid>
      </MKBox>
      <ScrollableTabsButtonVisible
        filter={ filterData }
        setFilter={ setFilterData }
      />
      <MKBox pt={ 1 } pb={ 3 }>
        <Card sx={ { mx: { xs: 2, lg: 3 } } }>
          <MKBox>
            <ProjectDisplay selectedFilter={ filterData } />
          </MKBox>
        </Card>
      </MKBox>
    </>
  );
}

export default ProjectOfInterest;
