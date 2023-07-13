// @flow

import * as React from "react";
import cn from "classnames";


function CardTitle({ className, children, RootComponent }: any): any {
  const classes = cn("card-title", className);
  const Component = RootComponent || "h3";
  return <Component className={classes}>{children}</Component>;
}

CardTitle.displayName = "Card.Title";

export default CardTitle;
