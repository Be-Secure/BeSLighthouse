import React from "react";

import { Card } from "@mui/material";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";

export default function DefenceData({ report }: any) {
  const reportLength = Object.values(report).length;
  return (<MKBox m={1}>
    <Card
      style={{
        backgroundColor: "#f0f2f5",
        padding: "0.4rem",
        width: "100%"
      }}
    >
      <MKTypography
        variant="body2"
        component="p"
        color="text"
        textAlign="left"
      >
        {reportLength > 0 ? (
          <>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Defense Model Validation Accuracy:{" "}
              {report["report_synopsis"]["Defense Model Validation Accuracy"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Defense Model Training Accuracy:{" "}
              {report["report_synopsis"]["Defense Model Training Accuracy"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Efficacy: {report["report_synopsis"]["Efficacy"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Defence Model Inference Time in ms:{" "}
              {report["performance"]["Defence Model Inference Time in ms"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Threat Detected by Defense Model on Original Data:{" "}
              {
                report["performance"][
                  "Threat Detected by Defense Model on Original Data"
                ]
              }
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Threat Detected by Defense Model on Attack Data:{" "}
              {
                report["performance"][
                  "Threat Detected by Defense Model on Attack Data"
                ]
              }
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Accuracy of the Defense Model:{" "}
              {report["model_Efficacy"]["Accuracy of the Defense Model"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              F1 score of the Defense Model:{" "}
              {report["model_Efficacy"]["F1 score of the Defense Model"]}
            </MKTypography>
            <MKTypography
              color="black"
              textAlign="left"
              sx={{ fontSize: "11px" }}
            >
              Number of test samples:{" "}
              {report["model_Efficacy"]["Number of test samples"]}
            </MKTypography>
          </>
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
  </MKBox>)
}
