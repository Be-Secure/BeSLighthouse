 
import * as React from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";

import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";

function DefaultNavbarDropdown({
  name,
  icon,
  children,
  collapseStatus,
  light,
  href,
  route,
  collapse,
  ...rest
}: any) {
  const linkComponent = {
    component: "a",
    href,
    target: "_blank",
    rel: "noreferrer",
  };

  const routeComponent = {
    component: Link,
    to: route,
  };

  return (
    <>
      <MKBox
        { ...rest }
        mx={ 1 }
        p={ 1 }
        display="flex"
        alignItems="baseline"
        color={ light ? "white" : "dark" }
        opacity={ light ? 1 : 0.6 }
        sx={ { cursor: "pointer", userSelect: "none" } }
        { ...(route && routeComponent) }
        { ...(href && linkComponent) }
      >
        <MKTypography
          variant="body2"
          lineHeight={ 1 }
          color="inherit"
          sx={ { alignSelf: "center", "& *": { verticalAlign: "middle" } } }
        >
          { icon }
        </MKTypography>
        <MKTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={ light ? "white" : "dark" }
          sx={ { fontWeight: "100%", ml: 1, mr: 0.25 } }
          style={ { fontSize: "0.975rem" } }
        >
          { name }
        </MKTypography>
        <MKTypography
          variant="body2"
          color={ light ? "white" : "dark" }
          ml="auto"
        >
          <Icon sx={ { fontWeight: "normal", verticalAlign: "middle" } }>
            { collapse && "keyboard_arrow_down" }
          </Icon>
        </MKTypography>
      </MKBox>
      { children && (
        <Collapse in={ Boolean(collapseStatus) } timeout={ 400 } unmountOnExit>
          { children }
        </Collapse>
      ) }
    </>
  );
}

// Setting default values for the props of DefaultNavbarDropdown
DefaultNavbarDropdown.defaultProps = {
  children: false,
  collapseStatus: false,
  light: false,
  href: "",
  route: "",
};

export default DefaultNavbarDropdown;
