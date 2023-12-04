import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";
import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";


import bgImage from "../../../assets/images/neuralimage.png";

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
    <Grid container pr={2} pt={2} spacing={1} width="30%">
      <Grid item width={"100%"}>
        <Card style={{minHeight:'131px'}}>
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
                <MKTypography
                  color="black"
                  sx={{ fontSize: "12px" }}
                >
                  {selectedFuzz.description}
                </MKTypography>
              </Card>
            </MKBox>
          </MKBox>
        </Card>
      </Grid>
      <Grid item width={"100%"}>
        <img style={{display: 'block', width: '50%', margin: 'auto'}} src={bgImage}/>
      </Grid>
      <Grid item width={"100%"}>
        <Card>
          <MKBox p={2} mt={-1} textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="regular"
            >
              Defense Summary
            </MKTypography>
            <MKBox mt={1} mb={1}>
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
                        sx={{ fontSize: "12px" }}
                      >
                        Defense Model Validation Accuracy:{" "}
                        {
                          report["report_synopsis"][
                            "Defense Model Validation Accuracy"
                          ]
                        }
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
                      >
                        Defense Model Training Accuracy:{" "}
                        {
                          report["report_synopsis"][
                            "Defense Model Training Accuracy"
                          ]
                        }
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
                      >
                        Efficacy: {report["report_synopsis"]["Efficacy"]}
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
                      >
                        Defence Model Inference Time in ms:{" "}
                        {
                          report["performance"][
                            "Defence Model Inference Time in ms"
                          ]
                        }
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
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
                        sx={{ fontSize: "12px" }}
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
                        sx={{ fontSize: "12px" }}
                      >
                        Accuracy of the Defense Model:{" "}
                        {
                          report["model_Efficacy"][
                            "Accuracy of the Defense Model"
                          ]
                        }
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
                      >
                        F1 score of the Defense Model:{" "}
                        {
                          report["model_Efficacy"][
                            "F1 score of the Defense Model"
                          ]
                        }
                      </MKTypography>
                      <MKTypography
                        color="black"
                        textAlign="left"
                        sx={{ fontSize: "12px" }}
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
            </MKBox>
          </MKBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DefenseSummary;
