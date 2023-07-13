// @flow

import * as React from "react";

class RouterContextProvider extends React.Component<any, any> {
  componentDidMount(): void {
    const { callback, location } = this.props;
    callback(location);
  }

  render(): any {
    return null;
  }
}

export default RouterContextProvider;
