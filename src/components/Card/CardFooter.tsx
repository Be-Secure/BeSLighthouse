// @flow

import * as React from "react";
import cn from "classnames";

function CardFooter({ className, children }: any): any {
  const classes = cn("card-footer", className);
  return <div className={classes}>{children}</div>;
}

CardFooter.displayName = "Card.Footer";

export default CardFooter;
