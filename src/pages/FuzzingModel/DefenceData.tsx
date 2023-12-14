import React, { useState } from "react";

import { Card, CircularProgress } from "@mui/material";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import DefenceReport from "./DefenceReport";

function reportDisplay(loading: any, report: any) {
  if (loading) {
    return (
      <CircularProgress
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        color="secondary"
        size={60}
        thickness={4}
      />
    );
  } else {
    return <DefenceReport report={report} />;
  }
}

export default function DefenceData({ report }: any) {
  let [loading, setLoading] = useState(true);
  React.useEffect(() => {
    try {
      setTimeout(setLoading, 6000);
    } catch(e) {
      // ignore
    }
  }, []);
  const reportLength = Object.values(report).length;
  return (
    <MKBox m={1}>
      <Card
        style={
          loading
            ? {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f2f5",
              padding: "0.4rem",
              width: "100%"
            }
            : {
                backgroundColor: "#f0f2f5",
                padding: "0.4rem",
                width: "100%"
              }
        }
      >
        <MKTypography
          variant="body2"
          component="p"
          color="text"
          textAlign="left"
        >
          {reportLength > 0 ? (
            reportDisplay(loading, report)
          ) : (
            <MKTypography
              color="black"
              textAlign="center"
              variant="h6"
              sx={{ margin: "auto" }}
              pt={8}
              pb={8}
            >
              Not Available
            </MKTypography>
          )}
        </MKTypography>
      </Card>
    </MKBox>
  );
}
