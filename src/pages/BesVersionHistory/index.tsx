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
import AssessmentAnalytics from "./AssessmentAnalytics";
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
                  <Grid key={"gridkey1"} container spacing={1} pl={4} >
                    <Grid item xs={6} justifyContent="flex-start">
                      <MKBox key="test" display="flex"  py={1} pr={2}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                          
                        >
                          Project Name: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          color="text"
                        >
                          {item.name}
                        </MKTypography>
                      </MKBox>
                      
                      <MKBox key="test" display="flex" py={1} pr={2}>
                        <MKTypography
                          variant="h6"
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
                    <Grid item xs={6} >
                      <MKBox key="test" display="flex"  justifyContent="center" py={1} pr={2}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                          
                        >
                          BeS Tracking Id: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          color="text"
                        >
                          {item.id}
                        </MKTypography>
                      </MKBox>
                      
                      <MKBox key="test" display="flex" justifyContent="center" py={1} pr={2}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          BeS Tech Stack: &nbsp;
                        </MKTypography>

                        <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          color="text"
                        >
                          {item.bes_technology_stack}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                  </Grid>
                  <MKBox key="test" display="flex" py={1} pr={2} pl={4}>
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Description: &nbsp;
                    </MKTypography>
                    <MKTypography
                      variant="h6"
                      fontWeight="regular"
                      color="text"
                    >
                      {item.description}
                    </MKTypography>
                  </MKBox>
                </Card>
                <MKBox>
                  <Grid container spacing={3} pt={3} >
                    <Grid item xs={12} md={12} lg={12} >
                      <AssessmentReport
                        title="Assessment Report"
                        name={besName.slice(1)}
                        version={selectedOption}
                        
                      />
                    </Grid>
                  </Grid>
                </MKBox>
                <MKBox>
                  <Grid container spacing={3} pt={3} >
                    <Grid item xs={12} md={12} lg={12} >
                      <AssessmentAnalytics
                        title="Assessment Analytics"
                        name={besName.slice(1)}
                        version={selectedOption}
                        versionDetails={versionSummary}
                        masterData={data}
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
