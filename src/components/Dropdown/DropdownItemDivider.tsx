
import * as React from "react";

function DropdownItemDivider(props: any): any {
  return <div className="dropdown-divider">{props.children}</div>;
}

DropdownItemDivider.displayName = "Dropdown.ItemDivider";

export default DropdownItemDivider;
