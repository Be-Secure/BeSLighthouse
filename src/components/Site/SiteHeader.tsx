/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import * as React from "react";
import Container from "../Container";
import Site from "./Site";

const SiteHeader = ({
  children,
  href,
  align,
  imageURL,
  alt,
  navItems,
  onMenuToggleClick,
}: any): any => {

  return (
    <div className="header py-4">
      <Container className={align}>
        <div className="d-flex">
          {children || (
            <React.Fragment>
              <Site.Logo href={href} alt={alt} src={imageURL} />
              <div className="d-flex order-lg-2 ml-auto">
                {navItems}
              </div>
              <a
                className="header-toggler d-lg-none ml-3 ml-lg-0"
                onClick={onMenuToggleClick}
              >
                <span className="header-toggler-icon" />
              </a>
            </React.Fragment>
          )}
        </div>
      </Container>
    </div>
  );
};

SiteHeader.displayName = "Site.Header";

export default SiteHeader;
