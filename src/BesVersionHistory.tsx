/* eslint-disable array-callback-return */
import * as React from "react";

import SiteWrapper from "./SiteWrapper";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useParams } from "react-router-dom";
import { projectOfInterestData } from "./data/poi_data";
import CveGraph from "./sections/CveGraph";
import Page from "./components/Page";
import AssessmentReport from "./sections/AssessmentReport";

export const osspoiMasterAndSummary = async (
  setData: any,
  besId: string,
  besName: string,
  setVersionSummary: any
) => {
  const osspoi: any = JSON.parse(
    await projectOfInterestData.getJsonReportOsspoiMaster()
  );
  const summary: any = JSON.parse(
    await projectOfInterestData.getJsonReportVersionSummary(besId, besName)
  );
  projectOfInterestData.updateDataPoi("Project_of_interest", osspoi.items);
  setData(osspoi.items);
  setVersionSummary(summary);
};

const useStyles: any = makeStyles(() => ({
  select: {
    minWidth: "155px",
    "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
      {
        padding: "4px",
      },
  },
}));

function cveNotFound(chartLabelsData: any[], chartContentData: any): any {
  if (chartLabelsData.length === 0) {
    return (
      <Card>
        <Box
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={495}
        >
          <Typography variant="h5">
            CVE details are not available at the moment.
          </Typography>
        </Box>
      </Card>
    );
  }
  return (
    <CveGraph
      title="Vulnerabilities by type & year"
      chartLabels={chartLabelsData}
      chartData={Object.values(chartContentData)}
    />
  );
}

function BeSVersionHistory() {
  const classes = useStyles();
  const myStyle: any = {
    fontSize: "1rem",
    fontWeight: 700,
    paddingRight: "13px",
  };
  const { besId, besName }: any = useParams();
  const [data, setData] = React.useState([]);
  const [versionSummary, setVersionSummary]: any = React.useState([]);
  React.useEffect(() => {
    osspoiMasterAndSummary(
      setData,
      besId.slice(1),
      besName.slice(1),
      setVersionSummary
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedOption, setSelectedOption] = React.useState("");
  if (!selectedOption && versionSummary[0]?.version) {
    setSelectedOption(versionSummary[0]?.version);
  }
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  debugger;
  const chartLabelsData: any = [];
  const chartContentData: any = {};

  const gridJsx: JSX.Element[] = [];

  return (
    <SiteWrapper>
      {data.map((item: any) => {
        if (`:${item.name}` === besName) {
          return (
            <>
              <Page.Content key={"pagekey"} title={`Project: ${item.name}`}>
                <Card key={"cardkey"}>
                  <CardContent key={"CardContentkey"}>
                    <Grid key={"gridkey1"} container spacing={2}>
                      <Grid key={"gridkey2"} item xs={4}>
                        <span style={myStyle}>BeS Tracking ID:</span> {item.id}
                      </Grid>
                      <Grid key={"gridkey3"} item xs={4}>
                        <span style={myStyle}>BeS Tech Stack:</span>{" "}
                        {item.bes_technology_stack}
                      </Grid>
                      {versionSummary.map((option: any) => {
                        if (option.version === selectedOption) {
                          if (option["cve_details"] === "Not Available") {
                            return (
                              <>
                                <Grid key={"gridkey4"} item xs={4}>
                                  <span style={myStyle}>Release Date:</span>{" "}
                                  {option.release_date}
                                </Grid>
                                <Grid key={"gridkey5"} item xs={4}>
                                  <span style={myStyle}>
                                    Known Vulnerability Count:
                                  </span>{" "}
                                  {option["cve_details"]}
                                </Grid>
                              </>
                            );
                          }
                          option["cve_details"].forEach((cve: any) => {
                            if (cve.Year === "Total") {
                              gridJsx.push(
                                <>
                                  <Grid key={"gridkey14"} item xs={4}>
                                    <span style={myStyle}>Release Date:</span>{" "}
                                    {option.release_date}
                                  </Grid>
                                  <Grid key={"gridkey15"} item xs={4}>
                                    <span style={myStyle}>
                                      Known Vulnerability Count:
                                    </span>{" "}
                                    {cve.No_of_Vulnerabilities}
                                  </Grid>
                                </>
                              );
                            } else {
                              const cveData = Object.keys(cve);
                              cveData.forEach((value) => {
                                if (value === "Year") {
                                  chartLabelsData.push(cve.Year);
                                } else if (cve?.[value]) {
                                  if (!chartContentData[value])
                                    chartContentData[value] = {
                                      name: value,
                                      type: "line",
                                      fill: "solid",
                                      data: [cve[value]],
                                    };
                                  else
                                    chartContentData[value].data.push(
                                      cve[value]
                                    );
                                }
                              });
                            }
                          });
                          return gridJsx;
                        }
                      })}
                      <Grid key={"gridkey6"} item xs={4}>
                        <span style={myStyle}>Version:</span>
                        <Select
                          key={"test"}
                          style={{ padding: "0px" }}
                          className={classes.select}
                          value={selectedOption}
                          onChange={handleOptionChange}
                        >
                          {versionSummary.map((option: any, index: any) => (
                            <MenuItem key={index} value={option.version}>
                              {option.version}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <div style={{ padding: "0px 0px 16px 16px" }}>
                    <span style={myStyle}>Description:</span> {item.description}
                  </div>
                </Card>
                <Container
                  style={{
                    paddingTop: "20px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                  maxWidth="lg"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                      {cveNotFound(chartLabelsData, chartContentData)}
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AssessmentReport
                        title="Assessment Report"
                        name={besName.slice(1)}
                        version={selectedOption}
                      />
                    </Grid>
                  </Grid>
                </Container>
              </Page.Content>
            </>
          );
        }
      })}
    </SiteWrapper>
  );
}

export default BeSVersionHistory;
