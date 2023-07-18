// @flow

import * as React from "react";

const SiteLogo = (props: any): any => (
  <a className="header-brand" href={props.href}>
    {props.alt}
  </a>
);

SiteLogo.displayName = "Site.Logo";

export default SiteLogo;
