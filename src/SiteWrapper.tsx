// @flow

import * as React from "react";
import { withRouter } from "react-router-dom";

import Nav from "./components/Nav";
import Button from "./components/Button/Button";
import Site from "./components/Site";
import RouterContextProvider from "./components/helpers/RouterContextProvider";

type Props = {
  children: any;
};

type State = {
  notificationsObjects: any;
};

type subNavItem = {
  value: string;
  to?: string;
  icon?: string;
  LinkComponent?: React.ElementType;
  useExact?: boolean;
};

type navItem = {
  value: string;
  to?: string;
  icon?: string;
  active?: boolean;
  LinkComponent?: React.ElementType;
  subItems?: Array<subNavItem>;
  useExact?: boolean;
};

const navBarItems: Array<navItem> = [
  {
    value: "Home",
    to: "/",
    icon: "home",
    useExact: true,
  },
  {
    value: "Project Of Interest",
    icon: "box",
    to: "/POI",
    useExact: true,
  },
  {
    value: "Vulnerability Of Interest",
    icon: "box",
    to: "/VOI",
    useExact: true,
  },
];

class SiteWrapper extends React.Component<Props, State> {
  render(): any {
    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "BeSLighthouse",
          // imageURL: "./demo/brand/tabler.svg",
          navItems: (
            <Nav.Item type="div" className="d-none d-md-flex">
              <Button
                href="https://github.com/Be-Secure/BeSLighthouse"
                target="_blank"
                outline
                size="sm"
                RootComponent="a"
                color="primary"
              >
                Source code
              </Button>
            </Nav.Item>
          ),
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default SiteWrapper;
