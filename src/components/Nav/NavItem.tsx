// @flow
import * as React from "react";
import cn from "classnames";
import Nav from ".";
import Dropdown from "../Dropdown";

import { Manager, Reference } from "react-popper";
import ClickOutside from "../helpers/ClickOutside";
class NavItem extends React.Component<any, any> {
  displayName = "Nav.Item";

  state = {
    isOpen: false,
  };

  _handleOnClick = (): void => {
    if (this.props.hasSubNav) {
      this.setState((s: { isOpen: any; }) => ({ isOpen: !s.isOpen }));
    }
    if (this.props.onClick) this.props.onClick();
  };

  render(): any {
    const {
      children,
      LinkComponent,
      value,
      className,
      to,
      type = "li",
      icon,
      hasSubNav: forcedHasSubNav,
      active,
      subItems,
      subItemsObjects,
      useExact,
      position = "bottom-start",
    }: any = this.props;

    const hasSubNav: any = forcedHasSubNav || !!subItems || !!subItemsObjects;

    const navLink: any =
      (typeof children === "string" || value) && hasSubNav ? (
        <Reference>
          {({ ref }: any) => (
            <Nav.Link
              className={className}
              to={to}
              icon={icon}
              RootComponent={LinkComponent}
              hasSubNav={hasSubNav}
              active={active}
              rootRef={ref}
              useExact={useExact}
            >
              {!hasSubNav && typeof children === "string" ? children : value}
            </Nav.Link>
          )}
        </Reference>
      ) : (
        <Nav.Link
          className={className}
          to={to}
          icon={icon}
          RootComponent={LinkComponent}
          hasSubNav={hasSubNav}
          active={active}
          useExact={useExact}
        >
          {!hasSubNav && typeof children === "string" ? children : value}
        </Nav.Link>
      );

    const childrenForAll: any = (
      <React.Fragment>
        {navLink}
        {typeof children !== "string" && !hasSubNav && children}
        {hasSubNav && (
          <Dropdown.Menu arrow show={this.state.isOpen} position={position}>
            {subItems ||
              (subItemsObjects &&
                subItemsObjects.map((a: { value: any; to: any; icon: any; LinkComponent: any; useExact: any; }, i: any) => (
                  <Nav.SubItem
                    key={i}
                    value={a.value}
                    to={a.to}
                    icon={a.icon}
                    LinkComponent={a.LinkComponent}
                    useExact={a.useExact}
                  />
                ))) ||
              children}
          </Dropdown.Menu>
        )}
      </React.Fragment>
    );

    const wrapperClasses: any = cn({
      "nav-item": true,
      show: this.state.isOpen,
    });

    const wrappedChildren: any =
      type === "div" ? (
        <ClickOutside onOutsideClick={() => this.setState({ isOpen: false })}>
          {({ setElementRef }: any) => (
            <div
              className={wrapperClasses}
              onClick={this._handleOnClick}
              ref={setElementRef}
            >
              {childrenForAll}
            </div>
          )}
        </ClickOutside>
      ) : (
        <ClickOutside onOutsideClick={() => this.setState({ isOpen: false })}>
          {({ setElementRef }: any) => (
            <li
              className={wrapperClasses}
              onClick={this._handleOnClick}
              ref={setElementRef}
            >
              {childrenForAll}
            </li>
          )}
        </ClickOutside>
      );

    return hasSubNav ? <Manager>{wrappedChildren}</Manager> : wrappedChildren;
  }
}

/** @component */
export default NavItem;
