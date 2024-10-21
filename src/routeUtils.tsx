import * as React from "react";

import { Route } from "react-router-dom";

// Utility function to recursively generate routes
export const renderRoutes = (allRoutes: any) =>
  allRoutes.map((route: any) => {
    if (route.collapse) {
      return renderRoutes(route.collapse);
    }

    if (route.route) {
      return <Route path={ route.route } element={ route.component } key={ route.key } />;
    }

    return null;
  });

