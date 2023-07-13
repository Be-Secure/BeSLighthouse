// @flow

import * as React from "react";
import { Manager, Reference } from "react-popper";

import type { ReferenceChildrenProps } from "react-popper";
import Dropdown from "../Dropdown";
import Button from "./Button";

class ButtonDropdown extends React.Component<any, any> {
  state = { isOpen: false };

  _handleButtonOnClick = (e: any) => {
    e.preventDefault();
    this.setState((s: { isOpen: any; }) => ({ isOpen: !s.isOpen }));
  };
  static displayName: string;

  render(): any {
    const { children, value, dropdownProps, ...buttonProps } = this.props;

    const propsForDropdownMenu: any = dropdownProps
      ? Object.assign(dropdownProps, { show: this.state.isOpen })
      : {
          show: this.state.isOpen,
        };

    const dropdownMenu = React.createElement(
      Dropdown.Menu,
      propsForDropdownMenu,
      children
    );

    return (
      <Manager>
        <Reference>
          {({ ref }: ReferenceChildrenProps) => {
            const propsForButton = Object.assign(
              {
                onClick: this._handleButtonOnClick,
                rootRef: ref,
                isDropdownToggle: true,
              },
              buttonProps
            );
            const button = React.createElement(Button, propsForButton, value);
            return button;
          }}
        </Reference>
        {dropdownMenu}
      </Manager>
    );
  }
}

ButtonDropdown.displayName = "Button.Dropdown";

export default ButtonDropdown;
