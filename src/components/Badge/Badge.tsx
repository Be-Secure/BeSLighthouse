// @flow

import * as React from "react";
import cn from "classnames";


function Badge({ className, children, color = "primary" }: any): any {
  const classes = cn(
    {
      badge: true,
      [`badge-${color}`]: color,
    },
    className
  );
  return <span className={classes}>{children}</span>;
}

export default Badge;
