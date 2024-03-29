import * as React from "react";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import Icon from "@mui/material/Icon";
import HomeIcon from '@mui/icons-material/Home';
import ModelOfInterest from "./pages/ModelOfInterest";
import VulnerabilityOfInterest from "./pages/VulnerabilityOfInterest";
import ProjectOfInterest from "./pages/ProjectOfInterest";

const routes = [
  {
    name: "Be-Secure",
    key: "github",
    icon: <HomeIcon fontSize="medium" />,
    href: "https://be-secure.github.io/Be-Secure/"
  },
  {
    name: "Projects Of Interest",
    key: "Project-of-Interest",
    icon: <Icon>library_books</Icon>,
    route: "/BeSLighthouse/Project-Of-Interest",
    component: <ProjectOfInterest />
  },
  {
    name: "Vulnerabilities of Interest",
    key: "Vulnerability-Of-Interest",
    icon: <Icon fontSize="small">gpp_bad</Icon>,
    route: "/BeSLighthouse/Vulnerability-Of-Interest",
    component: <VulnerabilityOfInterest />
  },
  {
    name: "Models of Interest",
    key: "Vulnerability-Of-Interest",
    icon: <Icon fontSize="small">view_in_ar</Icon>,
    route: "/BeSLighthouse/Model-Of-Interest",
    component: <ModelOfInterest />
  },
  {
    name: "github",
    key: "github",
    icon: <GitHubIcon />,
    href: "https://github.com/Be-Secure/BeSLighthouse"
  }
];

export default routes;
