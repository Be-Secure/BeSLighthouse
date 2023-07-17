// @flow

import * as React from "react";
import cn from "classnames";
import Icon from "../Icon";

function CardOptionsItem({
  className,
  children,
  icon,
  type,
  onClick,
}: any): any {
  const classes = cn(
    {
      "card-options-collapse": type === "collapse",
      "card-options-remove": type === "close",
      "card-options-fullscreen": type === "fullscreen",
    },
    className
  );

  const dataToggle = ((): string => {
    switch (type) {
      case "collapse":
        return "card-collapse";
      case "close":
        return "card-remove";
      case "fullscreen":
        return "card-remove";
      default:
        return "";
    }
  })();

  const iconName = ((): string => {
    if (icon) {
      return icon;
    }
    switch (type) {
      case "collapse":
        return "chevron-up";
      case "close":
        return "x";
      case "fullscreen":
        return "maximize";
      default:
        return "";
    }
  })();

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className={classes} data-toggle={dataToggle} onClick={onClick}>
      <Icon name={iconName} />
    </a>
  );
}

CardOptionsItem.displayName = "Card.OptionsItem";

export default CardOptionsItem;
