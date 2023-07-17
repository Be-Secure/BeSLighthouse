// @flow

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import SiteLogo from "./SiteLogo";
import SiteWrapper from "./SiteWrapper";


/**
 * Components for building the base of your website, such as a header, footer and nav bar
 */
function Site(props: any): any {
  return props.children;
}

Site.Header = SiteHeader;
Site.Footer = SiteFooter;
Site.Nav = SiteNav;
Site.Logo = SiteLogo;
Site.Wrapper = SiteWrapper;

Site.displayName = "Site";

/** @component */
export default Site;
