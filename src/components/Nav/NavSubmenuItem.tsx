// @flow
import * as React from "react";
import cn from "classnames";
import Icon from "../Icon";

function NavSubmenuItem({
  className,
  RootComponent,
  icon,
  children,
  active = false,
  to,
}: any): any {
  const classes = cn({ "nav-item": true, active: active }, className);
  const Component = RootComponent || "a";
  return (
    <Component className={classes} to={to}>
      {icon && (
        <React.Fragment>
          <Icon name={icon} />{" "}
        </React.Fragment>
      )}
      {children}
    </Component>
  );
}

NavSubmenuItem.displayName = "Nav.SubmenuItem";

export default NavSubmenuItem;
