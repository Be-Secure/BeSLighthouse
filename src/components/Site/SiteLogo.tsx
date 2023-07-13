// @flow

import * as React from "react";

const SiteLogo = (props: any): any => (
  <a className="header-brand" href={props.href}>
    <img src={props.src} className="header-brand-img" alt={props.alt} />
  </a>
);

SiteLogo.displayName = "Site.Logo";

export default SiteLogo;
