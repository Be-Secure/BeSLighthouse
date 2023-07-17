// @flow

import * as React from "react";
import cn from "classnames";
import DropdownTrigger from "./DropdownTrigger";
import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";
import DropdownItemDivider from "./DropdownItemDivider";


import { Manager } from "react-popper";
import ClickOutside from "../helpers/ClickOutside";


class Dropdown extends React.Component<any, any> {
  state = { isOpen: false };

  static Trigger = DropdownTrigger;
  static Menu = DropdownMenu;
  static Item = DropdownItem;
  static ItemDivider = DropdownItemDivider;

  _handleTriggerOnClick = (e: any, o?: any) => {
    e.preventDefault();
    this.setState((s: { isOpen: any; }) => ({ isOpen: !s.isOpen }));
    if (o && o.onClick) {
      o.onClick(e);
    }
  };

  _handleItemClick = (
    e: any,
    callback?: any
  ) => {
    this.setState({ isOpen: false });
    if (callback) {
      callback(e);
    }
  };

  render(): any {
    const {
      className,
      children,
      desktopOnly,
      isOption,
      flex = false,
      ...props
    } = this.props;

    const classes = cn(
      {
        dropdown: true,
        "d-none": desktopOnly,
        "d-md-flex": desktopOnly || flex === "md",
        [`d-{flex}-flex`]: ["xs", "sm", "lg", "xl"].includes(flex),
        "d-flex": flex === true,
        "card-options-dropdown": isOption,
        show: this.state.isOpen,
      },
      className
    );

    const trigger = (() => {
      if (props.trigger) {
        return React.cloneElement(props.trigger, {
          onClick: e => this._handleTriggerOnClick(e, props.trigger),
        });
        // return props.trigger;
      }
      if (props.icon || props.triggerContent || props.toggle) {
        const {
          icon,
          triggerContent,
          isNavLink,
          type,
          triggerClassName,
          color,
          toggle,
        } = props;

        return (
          <DropdownTrigger
            isNavLink={isNavLink}
            icon={icon}
            type={type}
            className={triggerClassName}
            isOption={isOption}
            color={color}
            toggle={toggle}
            onClick={this._handleTriggerOnClick}
          >
            {triggerContent}
          </DropdownTrigger>
        );
      }
      return null;
    })();

    const items = (() => {
      if (props.items) return props.items;
      if (props.itemsObject) {
        const { itemsObject, itemsRootComponent } = props;
        return itemsObject.map(
          (item: { isDivider: any; icon: any; badge: any; badgeType: any; value: any; to: any; RootComponent: any; onClick: any; }, i: any) =>
            item.isDivider ? (
              <Dropdown.ItemDivider key={i} />
            ) : (
              <Dropdown.Item
                icon={item.icon}
                badge={item.badge}
                badgeType={item.badgeType}
                value={item.value}
                key={i}
                to={item.to}
                RootComponent={item.RootComponent || itemsRootComponent}
                onClick={(e: any) => this._handleItemClick(e, item.onClick)}
              />
            )
        );
      }
      return null;
    })();

    const menu = (() => {
      if (props.items || props.itemsObject) {
        const { position, arrow, arrowPosition, dropdownMenuClassName } = props;
        return (
          <DropdownMenu
            position={position}
            arrow={arrow}
            arrowPosition={arrowPosition}
            className={dropdownMenuClassName}
            show={this.state.isOpen}
          >
            {items}
          </DropdownMenu>
        );
      }
      return null;
    })();

    return (
      <Manager>
        <ClickOutside onOutsideClick={() => this.setState({ isOpen: false })}>
          {({ setElementRef }: any) => (
            <div className={classes} ref={setElementRef}>
              {trigger}
              {menu || children}
            </div>
          )}
        </ClickOutside>
      </Manager>
    );
  }
}

export default Dropdown;
