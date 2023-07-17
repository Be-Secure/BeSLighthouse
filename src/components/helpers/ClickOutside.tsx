// @flow

import * as React from "react";

class ClickOutside extends React.PureComponent<any, any> {
  elementRef: any;

  componentDidMount = (): void => {
    document.addEventListener("mousedown", this.handleOutsideOnClick, false);
  };

  componentWillUnmount = (): void => {
    document.removeEventListener("mousedown", this.handleOutsideOnClick, false);
  };

  setElementRef = (el: any): any => {
    if (el) this.elementRef = el;
  };

  isOutsideClick = (target: any) =>
    this.elementRef &&
    target instanceof Node &&
    !this.elementRef.contains(target);

  handleOutsideOnClick: any = ({ target }: any) => {
    if (this.isOutsideClick(target)) this.props.onOutsideClick();
  };

  render() {
    const { children }: any = this.props;
    return children({ setElementRef: this.setElementRef });
  }
}

export default ClickOutside;
