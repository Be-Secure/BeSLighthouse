// @flow

import * as React from "react";
import Site from "./Site";
import Page from "../Page";

// import { Page, Site } from "../";


class SiteWrapper extends React.PureComponent<any, any> {
  static displayName = "Site.Wrapper";

  state = {
    collapseMobileMenu: true,
  };

  handleCollapseMobileMenu = (): void => {
    this.setState((s: { collapseMobileMenu: any; }) => ({ collapseMobileMenu: !s.collapseMobileMenu }));
  };

  render(): any {
    const {
      headerProps,
      navProps,
      footerProps,
      children,
      routerContextComponentType,
    }: any = this.props;

    const headerPropsWithToggleClick = {
      ...headerProps,
      onMenuToggleClick: this.handleCollapseMobileMenu,
    };
    const header = React.createElement(Site.Header, headerPropsWithToggleClick);
    const navPropsWithCollapse = {
      ...navProps,
      collapse: this.state.collapseMobileMenu,
      routerContextComponentType: routerContextComponentType,
    };
    const nav = React.createElement(Site.Nav, navPropsWithCollapse);
    const footer = React.createElement(Site.Footer, footerProps);

    return (
      <Page>
        <Page.Main>
          {header}
          {nav}
          {children}
        </Page.Main>
        {footer}
      </Page>
    );
  }
}

export default SiteWrapper;
