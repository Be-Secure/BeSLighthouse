import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectOfInterestData } from "../../utils/poi_data";
import { Icon, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import AssessmentReport from "./AssessmentReport";
import AssessmentAnalytics from "./AssessmentAnalytics";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import { Divider } from "@mui/material";
import { getEnvPathStatus } from "../../utils/fatch_json_report";
import { Tune } from "@mui/icons-material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

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

export const getResponse = async (name: string) => {
  const res = await getEnvPathStatus(name);
  return res;
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
            }}
          >
            recomentaion 1: Fetch the recomendations from master jason as
            suggested by the POD team.
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
            }}
          >
            recomentaion 2: Fetch the recomendations from master jason as
            suggested by the POD team.
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
            }}
          >
            recomentaion 3: Fetch the recomendations from master jason as
            suggested by the POD team.
          </MKTypography>
        </li>
      </ul>
    </>
  );
};

// Style for Modal
const modalstyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "60%",
  height: "60%",
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Function to handle modal component
export const ModalForEnvsAndPlaybook = (): any => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} disabled variant="contained" size="small" title="Show compatible envs and playbooks" style={{ fontSize: "15px", color: "black", backgroundColor: "#d7d7d7", textTransform: "capitalize", fontWeight: "regular" }}>
        BeS Envs and Playbooks
      </Button>
      {/* <Button onClick={handleOpen}>BeS Envs and Playbooks</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalstyle}>
            <Grid container
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <Grid item>
                <MKTypography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={{ fontSize: "15px" }}
                >
                  {/* <Card style={{ borderRadius: "0" }}> */}
                    BeS Environments
                  {/* </Card> */}
                </MKTypography>
              </Grid>
              <Grid item>

                <MKTypography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={{ 
                    fontSize: "15px",
                    margin: "auto"
                  }}
                >
                    BeS Playbooks
                </MKTypography>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
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

  const [isenvpath, setisenvpath]: any = React.useState();
  React.useEffect(() => {
    const response: any = getResponse(besName.slice(1));
    response.then(
      (resolvedValue) => {
        setisenvpath(resolvedValue);
      },
      (rejectionReason) => {
        setisenvpath(rejectionReason);
      }
    );
  });

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
      <MKBox
        key="TOPMKBOX"
        pt={12}
        sx={{
          mx: {
            xs: "auto",
            lg: 3
          }
        }}
      >
        {data.map((item: any, index: number) => {
          if (`:${item.name}` === besName) {
            let definedScore: string = "0";
            if (item.hasOwnProperty("score")) definedScore = item.score;
            else definedScore = "Not Available";
            // Adding a Map
            const techStackMap = {
              A: "Application",
              "L&F": "Language and Framework",
              DO: "DevOps and Infrastructure",
              DA: "Distributed and Decentralised Applications",
              S: "Open Source Security tools"
            }
            const name = item.name.split("-");
            const camelCaseString = name
              .map((part, index) => {
                return index === 0
                  ? part
                  : part.charAt(0).toUpperCase() + part.slice(1);
              })
              .join("");
            const envpath: string = `https://github.com/Be-Secure/besecure-ce-env-repo/tree/master/${camelCaseString}/`;
            const languages = Object.keys(item.language) // To get the list of languages
            // console.log(item.owner)
            // debugger
            return (
              <>
                <Card key={`TOPCARD${index}`} style={{ marginTop: "-1.5rem" }}>
                  <Grid key={`TOPGRID1${index}`} container spacing={1} pl={4}>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
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
                        style={{ fontSize: "15px" }}
                      >
                        {item.name}
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      >
                        Version: &nbsp;
                      </MKTypography>
                      <Select
                        key={`TOPSELECT1${index}`}
                        className={classes.select}
                        value={selectedOption}
                        onChange={handleOptionChange}
                        style={{
                          fontSize: "15px",
                          height: "fit-content"
                        }}
                      >
                        {versionSummary.map((option: any, index1: any) => (
                          <MenuItem
                            key={`TOPMENUITEM${index}${index1}`}
                            value={option.version}
                          >
                            {option.version}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
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
                        style={{ fontSize: "15px" }}
                      >
                        {definedScore}
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
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
                        style={{ fontSize: "15px" }}
                      >
                        {/* Checks if item.bes_technology_stack exists in techStackMap Object, if yes it prints from the mapping, if not it prints the default value*/}
                        {/* We do this to write the full forms of BeS Tech Stacks */}
                        {techStackMap[item.bes_technology_stack] ? techStackMap[item.bes_technology_stack] : item.bes_technology_stack}

                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
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
                        style={{ fontSize: "15px" }}
                      >
                        {item.id}
                      </MKTypography>
                    </Grid>
                    {/* <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
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
                        style={{ fontSize: "15px" }}
                      >
                        {isenvpath ? (
                          <Link key={`TOPLINK1${index}`} to={envpath}>
                            {item.name}
                          </Link>
                        ) : (
                          "Not Available"
                        )}
                      </MKTypography>
                    </Grid> */}

                    {/* For Open Source Assurance Provider */}
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px" }}
                    >
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        title="Open Source Assurance Provider"
                        style={{ fontSize: "15px" }}
                      >
                        OSAP: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}
                      >
                        {item.owner["login"]}
                      </MKTypography>
                      {/* The osap icon is given inside MKTypography for handling its css */}
                      <MKTypography
                        fontWeight="regular"
                        color="text"
                        style={{
                          position: "relative",
                          // paddingLeft: "3px",
                          bottom: "3px"
                        }}>
                        {/* {item.owner["type"] === "Organization" && (<IconButton aria-label="add" title="Organization">
                        </IconButton> ) */}
                        {/* Tooltip is used to provide the title for the icon */}
                        <Tooltip title="Organization">

                          <ApartmentIcon />
                        </Tooltip>

                        {/* {findOSAP(item)} */}
                        {/* <Icon component={ApartmentIcon} style={{ fontSize: "large" }} title="Organization" /> */}
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px", position: "relative", bottom: "7px" }}
                    >
                      {/* <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      > */}
                      <Button variant="contained" disabled size="small" title="Download Assessment Summary Report" endIcon={<DownloadIcon style={{ color: "black" }} />} style={{ fontSize: "15px", color: "black", backgroundColor: "#d7d7d7", width: "55%" }}>
                        OSAR
                      </Button>
                      {/* <Button variant="contained" startIcon={<DownloadIcon />}>OSAR</Button> */}

                      {/* </MKTypography> */}
                      {/* <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}
                      >
                        {item.id}
                      </MKTypography> */}
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      style={{ display: "flex", paddingTop: "12px", position: "relative", bottom: "7px" }}
                    >
                      {/* <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ fontSize: "15px" }}
                      > */}
                      {/* <Button variant="contained" size="small" title="Show compatible envs and playbooks" style={{ fontSize: "15px", color: "black", backgroundColor: "#d7d7d7" }}>
                        BeS Envs & Playbooks
                      </Button> */}
                      <ModalForEnvsAndPlaybook />
                      {/* <Button variant="contained" startIcon={<DownloadIcon />}>OSAR</Button> */}

                      {/* </MKTypography> */}
                      {/* <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px" }}
                      >
                        {item.id}
                      </MKTypography> */}
                    </Grid>
                    {/* The below code moves the description to the next line if the character count exceeds 100 */}
                    {/* It also checks if the 'description' of a repo is available, if not, displays 'Not Available'  */}
                    {/* {item.description ? (
                      item.description.length < 100 ? (
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            paddingTop: "12px",
                            paddingBottom: "7px"
                          }}
                        >
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
                        </Grid>
                      ) : (
                        <></>
                      )
                    ) : (
                      <Grid
                        item
                        xs={6}
                        style={{
                          display: "flex",
                          paddingTop: "12px",
                          paddingBottom: "7px"
                        }}
                      >
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
                      </Grid>
                    )} */}
                  </Grid>
                  {/* {item.description?.length > 100 ? (
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      textTransform="capitalize"
                      style={{
                        fontSize: "15px",
                        paddingLeft: "30px",
                        display: "flex",
                        paddingTop: "12px",
                        paddingBottom: "8px"
                      }}
                    >
                      Description:{" "}
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{ fontSize: "15px", paddingLeft: "8px" }}
                      >
                        {item.description}
                      </MKTypography>
                    </MKTypography>
                  ) : (
                    <></>
                  )} */}
                </Card>
                {/* For project description, languages and tags */}
                <Grid container spacing={3}
                  style={{
                    paddingTop: "30px",
                    placeContent: "space-between",
                    display: "flex"
                  }}
                >
                  <Grid item xs={12} md={6}
                    style={{
                      display: "flex",
                      paddingTop: "12px",
                      paddingBottom: "7px"
                    }}
                  >
                    <Card
                      style={{
                        // height: "fit-content",
                        width: "100%",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      }}
                    >
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center",
                        }}
                      >
                        Project Description
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          placeContent: "center",
                          paddingLeft: "5%",
                          paddingRight: "5%"
                        }}
                      >
                        {item.description}
                      </MKTypography>
                    </Card>
                  </Grid>
                  {/* The below grid item contains two cards - to align the vertically. */}
                  <Grid item xs={12} md={6}
                    style={{
                      paddingTop: "12px",
                      paddingBottom: "7px"
                    }}>
                    <Card
                      style={{
                        height: "fit-content",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center"
                        }}
                      >
                        Languages
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          placeContent: "center",
                          paddingLeft: "5%",
                          paddingRight: "5%"
                        }}
                      >
                        {languages.map((language) => (
                          // <li key={key}>{key}</li>
                          language
                        )).join("; ")}
                      </MKTypography>
                    </Card>
                    <Card
                      style={{
                        marginTop: "12px",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      }}>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center"
                        }}
                      >
                        Tags
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        color="text"
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          placeContent: "center",
                          paddingLeft: "5%",
                          paddingRight: "5%"
                        }}
                      >
                        {/* Parsing through the json arrays to get each tag. Also helps to add ; in between */}
                        {item.tags.map((tag) => (
                          tag
                          // Add a semicolon after each tag except for the last one
                        )).join('; ')}
                      </MKTypography>
                    </Card>
                  </Grid>
                </Grid>
                <Card key={`TOPCARD2${index}`} style={{ marginTop: "12px" }}>
                  <Grid key={`TOPGRID14${index}`} container spacing={1} p={1}>
                    <Grid
                      key={`TOPGRID15${index}`}
                      item
                      xs={12}
                      justifyContent="flex-start"
                    >
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
                <MKBox key={`TOPMKBOX7${index}`} style={{ marginTop: "12px" }}>
                  <Grid key={`TOPGRID16${index}`} container spacing={3} pt={3}>
                    <Grid
                      key={`TOPGRID17${index}`}
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      style={{ paddingTop: "5px" }}
                    >
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

function setisenvpath(getEnvPathStatus: (url: string) => Promise<boolean>) {
  throw new Error("Function not implemented.");
}
