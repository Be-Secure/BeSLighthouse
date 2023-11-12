import * as React from "react";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import Icon from "@mui/material/Icon";
import ProjectOfInterest from "./layouts/pages/projectOfInterest";
import VulnerabilityOfInterest from "./pages/VulnerabilityOfInterest";

const routes = [
  {
    name: "Projects",
    key: "Project-of-Interest",
    icon: <Icon>library_books</Icon>,
    route: "/Project-Of-Interest",
    component: <ProjectOfInterest />,
  },
  {
    name: "vulnerabilities",
    key: "Vulnerability-Of-Interest",
    icon: <Icon fontSize="small">gpp_bad</Icon>,
    route: "/Vulnerability-Of-Interest",
    component: <VulnerabilityOfInterest />,
  },
  {
    name: "github",
    icon: <GitHubIcon />,
    href: "https://github.com/Be-Secure/BeSLighthouse",
  },
];

export default routes;
