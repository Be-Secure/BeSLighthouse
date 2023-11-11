import * as React from "react";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import Icon from "@mui/material/Icon";

const routes = [
  {
    name: "Project",
    icon: <Icon>dashboard</Icon>,
  },
  {
    name: "vulnerability",
    icon: <Icon>dashboard</Icon>,
  },
  {
    name: "github",
    icon: <GitHubIcon />,
    href: "https://www.github.com/creativetimofficial/material-kit-react",
  },
];

export default routes;
