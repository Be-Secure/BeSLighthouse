import * as React from "react";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import Icon from "@mui/material/Icon";
import ModelOfInterestPage from "./layouts/pages/modelOfInterest";
import VulnerabilityOfInterestPage from "./layouts/pages/vulnerabilityOfInterest";
import ProjectOfInterestPage from "./layouts/pages/projectOfInterest";

const routes = [
  {
    name: "Projects Of Interest",
    key: "Project-of-Interest",
    icon: <Icon>library_books</Icon>,
    route: "/BeSLighthouse/Project-Of-Interest",
    component: <ProjectOfInterestPage />
  },
  {
    name: "Vulnerabilities of Interest",
    key: "Vulnerability-Of-Interest",
    icon: <Icon fontSize="small">gpp_bad</Icon>,
    route: "/BeSLighthouse/Vulnerability-Of-Interest",
    component: <VulnerabilityOfInterestPage />
  },
  {
    name: "Models of Interest",
    key: "Vulnerability-Of-Interest",
    icon: <Icon fontSize="small">view_in_ar</Icon>,
    route: "/BeSLighthouse/Model-Of-Interest",
    component: <ModelOfInterestPage />
  },
  {
    name: "github",
    key: "github",
    icon: <GitHubIcon />,
    href: "https://github.com/Be-Secure/BeSLighthouse"
  }
];

export default routes;
