//@flow

import * as React from "react";
import cn from "classnames";
import NavItem from "./NavItem";
import NavLink from "./NavLink";
import NavSubItem from "./NavSubItem";
import NavSubmenu from "./NavSubmenu";
import NavSubmenuItem from "./NavSubmenuItem";


class Nav extends React.Component<any, any> {
  state = {
    pathName: null,
  };

  static Item = NavItem;
  static SubItem = NavSubItem;
  static Link = NavLink;
  static Submenu = NavSubmenu;
  static SubmenuItem = NavSubmenuItem;

  routerCallback: any = (location: { pathname: string }): void => {
    this.setState({ pathName: location.pathname });
  };

  computeActive(
    initialValue?: boolean,
    to?: string,
    subItems?: Array<any>
  ): boolean {
    const { pathName } = this.state;

    if (
      initialValue !== null &&
      initialValue !== undefined &&
      initialValue === true
    ) {
      return true;
    }

    if (to !== null && to !== undefined && to === pathName) {
      return true;
    }

    if (subItems !== null && subItems !== undefined) {
      if (
        subItems.find(
          item =>
            item.to !== null && item.to !== undefined && item.to === pathName
        )
      ) {
        return true;
      }
    }

    return false;
  }

  render(): any {
    const {
      className,
      children,
      tabbed = true,
      items,
      itemsObjects,
      routerContextComponentType,
    } = this.props;
    const classes = cn({ nav: true, "nav-tabs": tabbed }, className);

    let element: any = null;
    if (routerContextComponentType) {
      
      let createFactory = (type: any) => React.createElement.bind(null, type);

      const routerContextComponentFactory: any = createFactory(
        routerContextComponentType
      );

      element = routerContextComponentFactory({
        callback: this.routerCallback,
      });
    }

    return (
      <React.Fragment>
        {element}
        <ul className={classes}>
          {items ||
            (itemsObjects &&
              itemsObjects.map((a: { icon: any; value: any; to: string | undefined; subItems: any[] | undefined; LinkComponent: any; active: boolean | undefined; useExact: any; }, i: React.Key | null | undefined) => (
                <Nav.Item
                  key={i}
                  icon={a.icon}
                  value={a.value}
                  to={a.to}
                  hasSubNav={!!a.subItems}
                  LinkComponent={a.LinkComponent}
                  subItemsObjects={a.subItems}
                  active={this.computeActive(a.active, a.to, a.subItems)}
                  useExact={a.useExact}
                />
              ))) ||
            children}
        </ul>
      </React.Fragment>
    );
  }
}

//Nav.Item = NavItem;

export default Nav;
