// @flow

import * as React from "react";
import cn from "classnames";

import { Reference } from "react-popper";
import type { ReferenceChildrenProps } from "react-popper";
import Icon from "../Icon";
import Button from "../Button";

function DropdownTrigger({
  className,
  toggle = true,
  value,
  children,
  type = "link",
  icon,
  color,
  isNavLink,
  isOption,
  onClick,
}: any): any {
  const classes = cn(
    { "dropdown-toggle": toggle, "nav-link": isNavLink },
    className
  );

  const childrenFragment = (
    <React.Fragment>
      {icon && (
        <React.Fragment>
          <Icon name={icon} />{" "}
        </React.Fragment>
      )}
      {value}
      {children}
    </React.Fragment>
  );

  return type === "link" ? (
    <Reference>
      {({ ref }: ReferenceChildrenProps) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className={classes} onClick={onClick} ref={ref}>
          {childrenFragment}
        </a>
      )}
    </Reference>
  ) : (
    <Reference>
      {({ ref }: ReferenceChildrenProps) => (
        <Button
          className={classes}
          color={color}
          isDropdownToggle
          isOption={isOption}
          onClick={onClick}
          rootRef={ref}
        >
          {childrenFragment}
        </Button>
      )}
    </Reference>
  );
}

DropdownTrigger.displayName = "Dropdown.Trigger";

/** @component */
export default DropdownTrigger;
