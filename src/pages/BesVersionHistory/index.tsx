import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectOfInterestData } from "../../utils/poi_data";
import { MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import AssessmentReport from "./AssessmentReport";
import AssessmentAnalytics from "./AssessmentAnalytics";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import { Divider } from '@mui/material';

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
    minWidth: "calc(3rem + 0.5vw)",
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
const FetchRecomedations = ({ itemData, masterData }: any) => {

  return (
    <>
      <ul>
        <li>
          <MKTypography
            variant="body1"
            color="inherit"
            style={{
              fontSize: "calc(0.2rem + 0.5vw)",
              marginTop: "calc(-0.4rem + (-0.3vw))",
              paddingLeft: "calc(0.1rem + 0.3vw)"
            }}>
            recomentaion 1: Fetch the recomendations from master jason as suggested by the POD team.
          </MKTypography>
        </li>
        <li>
          <MKTypography
            variant="body1"
            color="inherit"
            style={{
              fontSize: "calc(0.2rem + 0.5vw)",
              marginTop: "calc(-0.4rem + (-0.3vw))",
              paddingLeft: "calc(0.1rem + 0.3vw)"
            }}>
            recomentaion 2: Fetch the recomendations from master jason as suggested by the POD team.
          </MKTypography>
        </li>
        <li>
          <MKTypography
            variant="body1"
            color="inherit"
            style={{
              fontSize: "calc(0.2rem + 0.5vw)",
              marginTop: "calc(-0.4rem + (-0.3vw))",
              paddingLeft: "calc(0.1rem + 0.3vw)"
            }}>
            recomentaion 3: Fetch the recomendations from master jason as suggested by the POD team.
          </MKTypography>
        </li>
      </ul>
    </>
  )
}
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
      <DefaultNavbar routes={routes} />
      <MKBox key="TOPMKBOX"
        pt={12}
        sx={{
          mx: {
            xs: "auto",
            lg: 3
          }
        }}>
        {data.map((item: any, index: number) => {
          if (`:${item.name}` === besName) {
            let definedScore: string = "0";
            if (item.hasOwnProperty('score'))
              definedScore = item.score;
            else
              definedScore = "Not Available";
            const envpath: string = `https://github.com/Be-Secure/besecure-ce-env-repo/tree/master/${item.name}/`;

            return (
              <>
                <Card key={`TOPCARD${index}`}
                  style={{ marginTop: "-1.5rem" }}>
                  <Grid
                    key={`TOPGRID1${index}`}
                    container
                    spacing={1}
                    pl={4}
                  >
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        Project Name: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}>
                        {item.name}
                      </MKTypography>
                    </Grid>
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        Version: &nbsp;
                      </MKTypography>
                      <Select key={`TOPSELECT1${index}`}
                        className={classes.select}
                        value={selectedOption}
                        onChange={handleOptionChange}
                        style={{
                          fontSize: "15px",
                          height: 'fit-content'
                        }}

                      >
                        {
                          versionSummary.map((option: any, index1: any) => (
                            <MenuItem key={`TOPMENUITEM${index}${index1}`} value={option.version}>
                              {option.version}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </Grid>
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        BeS Score: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}>
                        {definedScore}
                      </MKTypography>
                    </Grid>
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        BeS Tech Stack: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}>
                        {item.bes_technology_stack}
                      </MKTypography>
                    </Grid>
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        BeS Tracking Id: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}>
                        {item.id}
                      </MKTypography>
                    </Grid>
                    <Grid item xs={6} md={3} style={{ display: "flex", paddingTop: "12px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        BeS Environment: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}>
                        <Link key={`TOPLINK1${index}`}
                                to={envpath}>
                                {item.name}
                              </Link>
                      </MKTypography>
                    </Grid>
                    {/* The below code moves the description to the next line if the character count exceeds 100 */}
                    {/* It also checks if the 'description' of a repo is available, if not, displays 'Not Available'  */}
                    { item.description ? item.description.length < 100 ? <Grid item xs={6} style={{ display: "flex", paddingTop: "12px", paddingBottom: "7px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        Description: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}
                        >
                        {item.description}
                      </MKTypography>
                    </Grid> : <></> :<Grid item xs={6} style={{ display: "flex", paddingTop: "12px", paddingBottom: "7px" }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        Description: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}
                        >
                        Not Available
                      </MKTypography>
                    </Grid> }
                  </Grid>
                  { item.description?.length > 100 ? <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px", paddingLeft: "30px", display: "flex", paddingTop: "12px", paddingBottom: "8px" }}
                      >
                        Description: <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px", paddingLeft: "8px" }}
                        >
                        {item.description}
                      </MKTypography>

                      </MKTypography> : <></>  }


                </Card>
                <Card key={`TOPCARD2${index}`}
                  style={{ marginTop: "12px" }}>
                  <Grid key={`TOPGRID14${index}`}
                    container
                    spacing={1}
                    p={2}>
                    <Grid key={`TOPGRID15${index}`}
                      item
                      xs={12}
                      justifyContent="flex-start">
                      <AssessmentReport
                        title="Assessment Report"
                        name={besName.slice(1)}
                        version={selectedOption}
                        itemData={item}
                        masterData={data}
                      />
                    </Grid>
                  </Grid>
                </Card>
                <MKBox key={`TOPMKBOX7${index}`}
                  style={{ marginTop: "12px" }}>
                  <Grid key={`TOPGRID16${index}`}
                    container
                    spacing={3}
                    pt={3} >
                    <Grid key={`TOPGRID17${index}`}
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      style={{ paddingTop: "5px" }} >
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