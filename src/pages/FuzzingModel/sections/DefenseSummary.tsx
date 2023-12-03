import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";
import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";

function DefenseSummary() {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/DefenceReport.json`;
    verifyLink(link, setreport);
  }, []);
  const reportLength = Object.values(report).length;
  return (
    <Grid container pr={2} pt={4.5} spacing={4} width="30%">
      <Grid item width={"100%"}>
        <Card>
          <MKBox p={1.3} mt={-1} textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="regular"
            >
              {selectedFuzz.name}
            </MKTypography>
            <MKBox mt={1} mb={3}>
              <Card
                style={{
                  backgroundColor: "#f0f2f5",
                  padding: "0.4rem",
                  width: "100%"
                }}
              >
                <MKTypography variant="body2" component="p" color="text">
                  {selectedFuzz.description}
                </MKTypography>
              </Card>
            </MKBox>
          </MKBox>
        </Card>
      </Grid>
      <Grid item width={"100%"}>
        <Card>
          <MKBox p={3} mt={-1} textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="regular"
            >
              Defense Summary
            </MKTypography>
            <MKBox mt={1} mb={3}>
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
                      <p>
                        Defense Model Validation Accuracy:{" "}
                        {
                          report["report_synopsis"][
                            "Defense Model Validation Accuracy"
                          ]
                        }
                      </p>
                      <p>
                        Defense Model Training Accuracy:{" "}
                        {
                          report["report_synopsis"][
                            "Defense Model Training Accuracy"
                          ]
                        }
                      </p>
                      <p>Efficacy: {report["report_synopsis"]["Efficacy"]}</p>
                      <p>
                        Defence Model Inference Time in ms:{" "}
                        {
                          report["performance"][
                            "Defence Model Inference Time in ms"
                          ]
                        }
                      </p>
                      <p>
                        Threat Detected by Defense Model on Original Data:{" "}
                        {
                          report["performance"][
                            "Threat Detected by Defense Model on Original Data"
                          ]
                        }
                      </p>
                      <p>
                        Threat Detected by Defense Model on Attack Data:{" "}
                        {
                          report["performance"][
                            "Threat Detected by Defense Model on Attack Data"
                          ]
                        }
                      </p>
                      <p>
                        Accuracy of the Defense Model:{" "}
                        {
                          report["model_Efficacy"][
                            "Accuracy of the Defense Model"
                          ]
                        }
                      </p>
                      <p>
                        F1 score of the Defense Model:{" "}
                        {
                          report["model_Efficacy"][
                            "F1 score of the Defense Model"
                          ]
                        }
                      </p>
                      <p>
                        Number of test samples:{" "}
                        {report["model_Efficacy"]["Number of test samples"]}
                      </p>
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
            </MKBox>
          </MKBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DefenseSummary;
