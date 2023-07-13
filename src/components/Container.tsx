// @flow

import * as React from "react";
import cn from "classnames";

import "./Container.css";


function Container({ className, children }: any): any {
  const classes = cn("container", className);
  return <div className={classes}>{children}</div>;
}

export default Container;
