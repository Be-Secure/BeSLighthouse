// @flow
import * as React from "react";
import Dropdown from "../Dropdown";

function NavSubItem({
  children,
  LinkComponent,
  className,
  to,
  icon,
  hasSubNav,
  value,
  useExact,
}: any): any {
  return (
    <Dropdown.Item to={to} icon={icon} RootComponent={LinkComponent} useExact={useExact || false}>
      {value || children}
    </Dropdown.Item>
  );
}

NavSubItem.displayName = "Nav.SubItem";

export default NavSubItem;
