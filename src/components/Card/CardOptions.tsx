// @flow

import * as React from "react";
import cn from "classnames";


function CardOptions({ className, children }: any): any {
  const classes = cn("card-options", className);
  return <div className={classes}>{children}</div>;
}

CardOptions.displayName = "Card.Options";

export default CardOptions;
