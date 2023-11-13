import * as React from "react";

import Card from "@mui/material/Card";
import MKTypography from "../../../components/MKTypography";
import CveGraph from "./GraphChart";


function cveNotFound(chartLabels: any[], chartContent: any): any {
  if (chartLabels.length === 0) {
    return (
      <MKTypography
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={595}
        variant="h6"
        gutterBottom
      >
        CVE details are not available at the moment.
      </MKTypography>
    );
  }
  return (
    <CveGraph
      title="Vulnerabilities by type & year"
      chartLabels={chartLabels}
      chartData={Object.values(chartContent)}
    />
  );
}

function VulnerabilitiesChat({ chartLabels, chartContent }: any) {
  return <Card>{cveNotFound(chartLabels, chartContent)}</Card>;
}

export default VulnerabilitiesChat;
