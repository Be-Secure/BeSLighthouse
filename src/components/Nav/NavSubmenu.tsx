// @flow

import * as React from "react";
import cn from "classnames";

function NavSubmenu({ className, children }: any): any {
  const classes = cn({ nav: true, "nav-submenu": true }, className);
  return <div className={classes}>{children}</div>;
}

NavSubmenu.displayName = "Nav.Submenu";

export default NavSubmenu;
