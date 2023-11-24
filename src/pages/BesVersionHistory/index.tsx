import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useParams } from "react-router-dom";
import { projectOfInterestData } from "../../utils/poi_data";
import { MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import VulnerabilitiesChat from "./VulnerabilitiesChat";
import AssessmentReport from "./AssessmentReport";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";

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
        padding: "4px"
      },
    "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
      {
        padding: "4px"
      },
    "& .css-qiwgdb.css-qiwgdb.css-qiwgdb": {
      padding: "4px"
    }
  }
}));

function BesVersionHistory() {
  const classes = useStyles();
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
  }, []);

  const [selectedOption, setSelectedOption] = React.useState("");

  try {
    if (!selectedOption && versionSummary[0].version) {
      setSelectedOption(versionSummary[0].version);
    }
  } catch (e: any) {
    //ignore
  }

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const chartLabelsData: any = [];
  const chartContentData: any = {};

  const gridJsx: JSX.Element[] = [];

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        {data.map((item: any) => {
          if (`:${item.name}` === besName) {
            return (
              <>
                <Card>
                  <Grid key={"gridkey1"} container spacing={1} pl={4}>
                    <Grid item xs={4}>
                      <MKBox key="test" display="flex" py={1} pr={2}>
                        <MKTypography
                          variant="h5"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          BeS Tracking ID: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h5"
                          fontWeight="regular"
                          color="text"
                        >
                          {item.id}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                    <Grid key={"gridkey3"} item xs={4}>
                      <MKBox key="test" display="flex" py={1} pr={2}>
                        <MKTypography
                          variant="h5"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          BeS Tech Stack: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h5"
                          fontWeight="regular"
                          color="text"
                        >
                          {item.bes_technology_stack}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                    {versionSummary.map((option: any) => {
                      if (option.version === selectedOption) {
                        if (option["cve_details"] === "Not Available") {
                          return (
                            <>
                              <Grid key={"gridkey4"} item xs={4}>
                                <MKBox key="test" display="flex" py={1} pr={2}>
                                  <MKTypography
                                    variant="h5"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                  >
                                    Release Date: &nbsp;
                                  </MKTypography>
                                  <MKTypography
                                    variant="h5"
                                    fontWeight="regular"
                                    color="text"
                                  >
                                    {option.release_date}
                                  </MKTypography>
                                </MKBox>
                              </Grid>
                              <Grid key={"gridkey5"} item xs={4}>
                                <MKBox key="test" display="flex" py={1} pr={2}>
                                  <MKTypography
                                    variant="h5"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                  >
                                    Known Vulnerability Count: &nbsp;
                                  </MKTypography>
                                  <MKTypography
                                    variant="h5"
                                    fontWeight="regular"
                                    color="text"
                                  >
                                    {option["cve_details"]}
                                  </MKTypography>
                                </MKBox>
                              </Grid>
                            </>
                          );
                        }
                        option["cve_details"].forEach((cve: any) => {
                          if (cve.Year === "Total") {
                            gridJsx.push(
                              <>
                                <Grid key={"gridkey14"} item xs={4}>
                                  <MKBox
                                    key="test"
                                    display="flex"
                                    py={1}
                                    pr={2}
                                  >
                                    <MKTypography
                                      variant="h5"
                                      fontWeight="bold"
                                      textTransform="capitalize"
                                    >
                                      Release Date: &nbsp;
                                    </MKTypography>
                                    <MKTypography
                                      variant="h5"
                                      fontWeight="regular"
                                      color="text"
                                    >
                                      {option.release_date}
                                    </MKTypography>
                                  </MKBox>
                                </Grid>
                                <Grid key={"gridkey15"} item xs={4}>
                                  <MKBox
                                    key="test"
                                    display="flex"
                                    py={1}
                                    pr={2}
                                  >
                                    <MKTypography
                                      variant="h5"
                                      fontWeight="bold"
                                      textTransform="capitalize"
                                    >
                                      Known Vulnerability Count: &nbsp;
                                    </MKTypography>
                                    <MKTypography
                                      variant="h5"
                                      fontWeight="regular"
                                      color="text"
                                    >
                                      {cve.No_of_Vulnerabilities}
                                    </MKTypography>
                                  </MKBox>
                                </Grid>
                              </>
                            );
                          } else {
                            const cveData = Object.keys(cve);
                            cveData.forEach((value) => {
                              if (value === "Year") {
                                chartLabelsData.push(cve.Year);
                              } else if (cve[value]) {
                                if (!chartContentData[value])
                                  chartContentData[value] = {
                                    name: value,
                                    type: "line",
                                    fill: "solid",
                                    data: [cve[value]]
                                  };
                                else
                                  chartContentData[value].data.push(cve[value]);
                              }
                            });
                          }
                        });
                        return gridJsx;
                      }
                    })}
                    <Grid key={"gridkey6"} item xs={4}>
                      <MKBox key="test" display="flex" py={1} pr={2}>
                        <MKTypography
                          variant="h5"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          Version: &nbsp;
                        </MKTypography>

                        <Select
                          key={"test"}
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
                      </MKBox>
                    </Grid>
                  </Grid>
                  <MKBox key="test" display="flex" py={1} pr={2} pl={4}>
                    <MKTypography
                      variant="h5"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Description: &nbsp;
                    </MKTypography>
                    <MKTypography
                      variant="h5"
                      fontWeight="regular"
                      color="text"
                    >
                      {item.description}
                    </MKTypography>
                  </MKBox>
                </Card>
                <MKBox>
                  <Grid container spacing={3} pt={3}>
                    <Grid item xs={12} md={6} lg={8}>
                      <VulnerabilitiesChat
                        chartLabels={chartLabelsData}
                        chartContent={chartContentData}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AssessmentReport
                        title="Assessment Report"
                        name={besName.slice(1)}
                        version={selectedOption}
                      />
                    </Grid>
                  </Grid>
                </MKBox>
              </>
            );
          }
        })}
      </MKBox>
    </>
  );
}

export default BesVersionHistory;
