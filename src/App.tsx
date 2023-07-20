import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage";

import "./Tabler.css"
import ProjectOfInterest from "./ProjectOfInterest";
import BesAssessmentReport from "./BesAssessmentReport";
import VulnerabilityOfInterest from "./VulnerabilityOfInterest";
import ShowVulnerabilityDetails from "./report/vulnerability/ShowVulnerabilityDetails";
import BeSVersionHistory from "./BesVersionHistory";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/BeSLighthouse" component={HomePage} />
          <Route exact path="/BeSLighthouse/POI" component={ProjectOfInterest} />
          <Route exact path="/BeSLighthouse/VOI" component={VulnerabilityOfInterest} />
          <Route
            exact
            path="/BeSLighthouse/bes_version_history/:besId/:besName"
            component={BeSVersionHistory}
          />
          <Route
            exact
            path="/BeSLighthouse/vulnerability_report/:cveId"
            component={ShowVulnerabilityDetails}
          />
          <Route
            exact
            path="/BeSLighthouse/bes_assessment_report/:besName/:besVersion/:besReport"
            component={BesAssessmentReport}
          />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
