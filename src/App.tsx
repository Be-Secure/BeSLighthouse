import * as React from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./assets/theme";
import Presentation from "./layouts/pages/presentation";
import routes from "./routes";
import BesVersionHistory from "./layouts/pages/besVersionHistory";
import BesAssessmentReport from "./layouts/pages/besAssessmentReport";
import ShowVulnerabilityDetailsPage from "./layouts/pages/vulnerabilityDetails";

function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes: any) =>
    allRoutes.map((route: any) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/BeSLighthouse" />} />
        <Route path="/BeSLighthouse" element={<Presentation />} />
        <Route path="/Project-Of-Interest/bes_version_history/:besId/:besName" element={<BesVersionHistory />} />
        <Route path="/BeSLighthouse/bes_assessment_report/:besName/:besVersion/:besReport" element={<BesAssessmentReport />} />
        <Route path="/BeSLighthouse/vulnerability_report/:cveId" element={<ShowVulnerabilityDetailsPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
