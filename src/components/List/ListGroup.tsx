// @flow

import * as React from "react";
import cn from "classnames";

function ListGroup({
  className,
  children,
  transparent,
  isCardBody,
}: any): any {
  const classes = cn(
    "list-group",
    "mb-0",
    {
      "list-group-transparent": transparent,
      "card-list-group": isCardBody,
    },
    className
  );
  return <div className={classes}>{children}</div>;
}

ListGroup.displayName = "List.Group";

export default ListGroup;
