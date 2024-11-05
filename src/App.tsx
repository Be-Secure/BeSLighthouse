import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./assets/theme";
import routes from "./routes";
import { renderRoutes } from "./routeUtils";
import LandingPages from "./pages/LandingPages";
import BesVersionHistory from "./pages/BesVersionHistory";
import BesAssessmentReport from "./pages/BesAssessmentReport";
import ShowVulnerabilityDetails from "./pages/ShowVulnerabilityDetails";
import ShowModelDetails from "./pages/ShowModelDetails";
import ModelVulnerabilitiesDetailed from "./pages/ModelVulnerabilitiesDetailed";
import FuzzingModel from "./pages/FuzzingModel";
import InsecureCodeDetection from "./pages/InsecureCodeDetection";
import LlmBenchmarReport from "./pages/LlmBenchmarkReport";
import ModelIntegritySuite from "./pages/ModelIntegritySuite";

const App = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Routes>
        { renderRoutes(routes) } { /* Utilized renderRoutes from utils */ }
        <Route path="*" element={ <Navigate to="/BeSLighthouse" /> } />
        <Route path="/BeSLighthouse" element={ <LandingPages /> } />
        <Route path="/BeSLighthouse/Project-Of-Interest/bes_version_history/:besId/:besName" element={ <BesVersionHistory /> } />
        <Route path="/BeSLighthouse/bes_assessment_report/:besName/:besVersion/:besReport" element={ <BesAssessmentReport /> } />
        <Route path="/BeSLighthouse/vulnerability_report/:cveId" element={ <ShowVulnerabilityDetails /> } />
        <Route path="/BeSLighthouse/model_report/:modelName" element={ <ShowModelDetails /> } />
        <Route path="/BeSLighthouse/model_vulnerabilities_detailed/:modelName" element={ <ModelVulnerabilitiesDetailed /> } />
        <Route path="/BeSLighthouse/insecure_code_detection/:modelName" element={ <InsecureCodeDetection /> } />
        <Route path="/BeSLighthouse/llm_benchmark_report/:llm_type/:modelName" element={ <LlmBenchmarReport /> } />
        <Route path="/BeSLighthouse/model_integrity_suite/:modelIntegrityType/:modelName" element={ <ModelIntegritySuite /> } />
        <Route path="/BeSLighthouse/model_fuzzing/:modelName" element={ <FuzzingModel /> } />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
