// @flow

import * as React from "react";
import cn from "classnames";

import ListItem from "./ListItem";
import ListGroup from "./ListGroup";
import ListGroupItem from "./ListGroupItem";



function List({
  className,
  children,
  unstyled,
  seperated,
  inline,
}: any): any {
  const classes = cn(
    {
      list: !unstyled,
      "list-unstyled": unstyled,
      "list-seperated": seperated,
      "list-inline": inline,
    },
    className
  );
  return <ul className={classes}>{children}</ul>;
}

List.Item = ListItem;
List.Group = ListGroup;
List.GroupItem = ListGroupItem;

export default List;
