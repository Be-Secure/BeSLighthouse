import * as React from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./assets/theme";
import Presentation from "./layouts/pages/presentation";


function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* {getRoutes(routes)} */}
        <Route path="/presentation" element={<Presentation />} />
        <Route path="*" element={<Navigate to="/presentation" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
