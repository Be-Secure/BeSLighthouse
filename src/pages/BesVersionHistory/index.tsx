import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useParams } from "react-router-dom";
import { projectOfInterestData } from "../../utils/ProjectOfInterestData";
import { MenuItem, Select } from "@mui/material";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import AssessmentReport from "./AssessmentReport";
import AssessmentAnalytics from "./AssessmentAnalytics";
import routes from "../../routes";
import { getEnvPathStatus } from "../../utils/fatchJsonReport";
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { projectTags } from "./tags";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';

import CheckIcon from '../../assets/images/checked.png';
import { assessmentDatastoreURL } from "../../dataStore";
import { generatePdfFromJson } from "../../utils/OsarPdf";
import { checkFileExists } from "../../utils/checkFileExists";
import { verifyLink } from "../../utils/verifyLink";

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

// Style for Modal
const envPlaybookModalStyle = {
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
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  return (
    <div>
      <Button
        onClick={ handleOpen }
        size="small"
        title="Show compatible envs and playbooks"
        disabled
        style={ {
          fontSize: "15px",
          color: "black",
          right: "16px",
          textTransform: "capitalize",
          fontWeight: "normal",
        } }
      >
        BeS Envs and Playbooks
      </Button>
      { /* <Button onClick={handleOpen}>BeS Envs and Playbooks</Button> */ }
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={ open }
        onClose={ handleClose }
        closeAfterTransition
        slots={ { backdrop: Backdrop } }
        slotProps={ {
          backdrop: {
            timeout: 500,
          },
        } }
      >
        <Fade in={ open }>
          <Box sx={ envPlaybookModalStyle }>
            <Grid container
              style={ {
                display: "flex",
                justifyContent: "space-around"
              } }
            >
              <Grid item>
                <MKTypography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={ { fontSize: "15px" } }
                >
                  { /* <Card style={{ borderRadius: "0" }}> */ }
                  BeS Environments
                  { /* </Card> */ }
                </MKTypography>
              </Grid>
              <Grid item>

                <MKTypography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={ {
                    fontSize: "15px",
                    margin: "auto"
                  } }
                >
                  BeS Playbooks
                </MKTypography>
              </Grid>
              <MKTypography
                style={ {
                  position: "fixed",
                  bottom: 0,
                  fontSize: "12px"
                } }>
                Compatible BeS environments and BeS playbooks
              </MKTypography>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

// This function is returns the full form of the project tags
function getProjectTags(value: any) {
  // projectTags is the Object name
  return Object.keys(projectTags).filter(key => projectTags[key] === value);
}

function BesVersionHistory() {
  // const classes = useStyles();
  const { besId, besName }: any = useParams();
  const [data, setData] = React.useState([]);
  const [getOsarReport, setOsarReportData]: any = React.useState(
    {}
  );
  const [selectedOption, setSelectedOption] = React.useState("");
  const [getCosignLink, setCosignLink]: any = React.useState(false);

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

  React.useEffect(() => {
    // Call osspoiMasterAndSummary only when selectedOption changes
    if (selectedOption) {

      const osarReportLink = `${assessmentDatastoreURL}/${besName.slice(1)}/${selectedOption}/${besName.slice(1)}-${selectedOption}-osar.json`;
      const cosignLink = `${assessmentDatastoreURL}/${besName.slice(1)}/${selectedOption}/cosign.pub`;

      verifyLink(osarReportLink, setOsarReportData);
      checkFileExists(cosignLink, setCosignLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  try {
    if (!selectedOption && versionSummary) {
      const latestVersion = versionSummary.reduce((latest: { release_date: string | number | Date; }, current: { release_date: string | number | Date; }) => {
        const currentDate = new Date(current.release_date);
        const latestDate = new Date(latest.release_date);
        return currentDate > latestDate ? current : latest;
      }, versionSummary[0]);
      if (latestVersion.version) {
        setSelectedOption(latestVersion.version);
      }
    }
  } catch (e: any) {
    console.log(e);
  }

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <DefaultNavbar routes={ routes } />
      <MKBox
        key="TOPMKBOX"
        pt={ 14 }
        sx={ {
          mx: {
            xs: "auto",
            lg: 3
          }
        } }
      >
        { data.map((item: any, index: number) => {
          if (`:${item.name}` === besName) {
            let definedScore: string = "0";
            if (item.hasOwnProperty("score")) definedScore = item.score;
            else definedScore = "Not Available";
            // Adding a Map
            const techStackMap: any = {
              A: "Application",
              "L&F": "Language and Framework",
              DO: "DevOps and Infrastructure Tool",
              DA: "Distributed and Decentralized Application",
              S: "Open Source Security tool"
            };
            const languages = Object.keys(item.language); // To get the list of languages
            return (
              <>
                <Card key={ `TOPCARD${index}` } style={ { marginTop: "-1.5rem", paddingTop: "6px" } }>
                  <Grid key={ `TOPGRID1${index}` } container spacing={ 1 } pl={ 4 }>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                      >
                        Project Name: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ { fontSize: "15px" } }
                      >
                        { item.name }
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                      >
                        Version: &nbsp;
                      </MKTypography>
                      <Select
                        key={ `TOPSELECT1${index}` }
                        // className={ classes.select }
                        value={ selectedOption }
                        onChange={ handleOptionChange }
                        style={ {
                          fontSize: "15px",
                          height: "fit-content"
                        } }
                      >
                        { versionSummary
                          .sort((a: { release_date: string | number | Date; }, b: { release_date: string | number | Date; }) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
                          .map((option: any, index1: any) => (
                            <MenuItem
                              key={ `TOPMENUITEM${index}${index1}` }
                              value={ option.version }
                            >
                              { option.version }
                            </MenuItem>
                          )) }
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                      >
                        BeS Score: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ { fontSize: "15px" } }
                      >
                        { definedScore }
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                      >
                        BeS Tech Stack: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ { fontSize: "15px" } }
                      >
                        { /* Checks if item.bes_technology_stack exists in techStackMap Object, if yes it prints from the mapping, if not it prints the default value */ }
                        { /* We do this to write the full forms of BeS Tech Stacks */ }
                        { techStackMap[item.bes_technology_stack] ? techStackMap[item.bes_technology_stack] : item.bes_technology_stack }

                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                      >
                        BeS Tracking Id: &nbsp;
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ { fontSize: "15px" } }
                      >
                        { item.id }
                      </MKTypography>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <a href={ item.html_url } target="_blank" rel="noopener noreferrer" style={ { textDecoration: 'none', color: 'inherit' } }>
                        <MKTypography
                          variant="h6"
                          textTransform="capitalize"
                          color="text"
                          style={ { fontSize: "15px", fontWeight: "normal" } }
                        >
                          <GitHubIcon style={ { position: 'relative', top: '3px' } } fontSize="small" />
                          &nbsp; repository
                        </MKTypography>
                      </a>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px" } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ { fontSize: "15px", fontWeight: "normal" } }
                        title="Open Source Assessment Summary Report"
                      >
                        OSAR: &nbsp;
                      </MKTypography>
                      <div style={ { display: 'flex' } }>
                        { Object.keys(getOsarReport).length === 0 ? <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          style={ { fontSize: "15px" } }
                        >
                          Not Available
                        </MKTypography> : <Tooltip title="Download OSAR">
                          <DownloadIcon
                            onClick={ () => generatePdfFromJson(getOsarReport, `${besName.slice(1)}-${selectedOption}-osar.json`, getCosignLink) }
                            style={ { cursor: "pointer" } }
                            fontSize="medium"
                            titleAccess="Download OSAR"
                          />
                        </Tooltip> }
                        { getCosignLink ? <img style={ { position: 'relative', top: '-2px' } } src={ CheckIcon } title="Attested" alt="Checked Icon" width={ 24 } height={ 24 } /> : <></> }
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={ 6 }
                      md={ 3 }
                      style={ { display: "flex", paddingTop: "12px", position: "relative", bottom: "7px" } }
                    >
                      <ModalForEnvsAndPlaybook />
                    </Grid>
                  </Grid>
                </Card>

                { /* For project description, languages and tags */ }
                <Grid key={ `TOPGRID14${index}` } container pt={ 2 } spacing={ 1 } style={ { display: "flex", justifyContent: "space-between" } }>
                  <AssessmentReport
                    title="Assessment Report"
                    name={ besName.slice(1) }
                    version={ selectedOption }
                    itemData={ item }
                    masterData={ data }
                  />
                </Grid>

                <Grid container spacing={ 1 } pt={ 2 }
                  style={ {
                    placeContent: "space-between",
                    display: "flex"
                  } }
                >
                  <Grid item xs={ 12 } md={ 6 }
                    style={ {
                      display: "flex",
                      paddingTop: "12px",
                      paddingBottom: "7px"
                    } }
                  >
                    <Card
                      style={ {
                        // height: "fit-content",
                        width: "100%",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      } }
                    >
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        color="text"
                        textTransform="capitalize"
                        style={ {
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center",
                        } }
                      >
                        Project Description
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ {
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          paddingLeft: "5%",
                          paddingRight: "5%",
                          paddingTop: "15px",
                          placeContent: "center",
                          color: "black"

                        } }
                      >
                        { item.description }
                      </MKTypography>
                    </Card>
                  </Grid>
                  { /* The below grid item contains two cards - to align the vertically. */ }
                  <Grid item xs={ 12 } md={ 6 }
                    style={ {
                      paddingTop: "12px",
                      paddingBottom: "7px"
                    } }
                  >
                    <Card
                      style={ {
                        height: "fit-content",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      } }
                    >
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ {
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center"
                        } }
                      >
                        Languages
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ {
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          placeContent: "center",
                          paddingLeft: "5%",
                          paddingRight: "5%",
                          color: "black"
                        } }
                      >
                        { languages.map((language) => (
                          // <li key={key}>{key}</li>
                          language
                          // <a href="#" onClick={(event) => selectFilter(language, event)}>{language}</a>
                        )).join("; ") }
                      </MKTypography>
                    </Card>
                    <Card
                      style={ {
                        marginTop: "12px",
                        paddingBottom: "8px",
                        paddingTop: "5px"
                      } }>
                      <MKTypography
                        variant="h6"
                        textTransform="capitalize"
                        color="text"
                        style={ {
                          fontSize: "15px",
                          display: "flex",
                          placeContent: "center"
                        } }
                      >
                        Tags
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="regular"
                        style={ {
                          fontFamily: "Arial",
                          fontSize: "15px",
                          display: "flex",
                          textAlign: "justify",
                          placeContent: "center",
                          paddingLeft: "5%",
                          paddingRight: "5%",
                          color: "black"
                        } }
                      >
                        { /* Parsing through the json arrays to get each tag. Also helps to add ; in between */ }
                        { item.tags.map((tag: any) => (
                          getProjectTags(tag)
                          // tag
                          // Add a semicolon after each tag except for the last one
                        )).join('; ') }
                      </MKTypography>
                    </Card>
                  </Grid>
                </Grid>

                <AssessmentAnalytics
                  title="Assessment Analytics"
                  name={ besName.slice(1) }
                  version={ selectedOption }
                  versionDetails={ versionSummary }
                  masterData={ data }
                />
              </>
            );
          }
        }) }
      </MKBox>
    </>
  );
}

export default BesVersionHistory;
