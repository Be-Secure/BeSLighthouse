// @flow

import * as React from "react";
import cn from "classnames";

function ListItem({ className, children, inline }: any): any {
  const classes = cn({ "list-inline-item": inline }, className);
  return <li className={classes}>{children}</li>;
}

ListItem.displayName = "List.Item";

export default ListItem;
