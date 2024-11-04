import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useParams } from "react-router-dom";
import { projectOfInterestData } from "../../utils/ProjectOfInterestData";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import AssessmentReport from "./AssessmentReport";
import AssessmentAnalytics from "./AssessmentAnalytics";
import routes from "../../routes";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import GitHubIcon from "@mui/icons-material/GitHub";

import { assessmentDatastoreURL } from "../../dataStore";
import { checkFileExists } from "../../utils/checkFileExists";
import { verifyLink } from "../../utils/verifyLink";
import { InfoGridItem, InfoGridSelect, OSARGridItem } from "../../components/InfoGridComponents/InfoGridComponents";
import ModalForEnvsAndPlaybook from "../../components/ModalForEnvsAndPlaybook/ModalForEnvsAndPlaybook";
import { DescriptionCard, LanguagesCard, TagsCard } from "../../components/ProjectDetailsCards/ProjectDetailsCards";

const osspoiMasterAndSummary = async (
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

const createOsarReportLink = (besName: any, selectedOption: string) => {
  return `${assessmentDatastoreURL}/${besName.slice(1)}/${selectedOption}/${besName.slice(1)}-${selectedOption}-osar.json`;
};

// Utility function to create cosign link
const createCosignLink = (besName: any, selectedOption: string) => {
  return `${assessmentDatastoreURL}/${besName.slice(1)}/${selectedOption}/cosign.pub`;
};

const getLatestVersion = (versionSummary: any[]) => {
  return versionSummary.reduce((latest: any, current: any) => {
    const currentDate = new Date(current.release_date);
    const latestDate = new Date(latest.release_date);
    return currentDate > latestDate ? current : latest;
  }, versionSummary[0]);
};


function BesVersionHistory() {

  const { besId, besName }: any = useParams<any>();
  const [data, setData] = React.useState<any[]>([]);
  const [osarReportData, setOsarReportData] = React.useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  const [cosignLinkExists, setCosignLinkExists] = React.useState<boolean>(false);
  const [versionSummary, setVersionSummary] = React.useState<any[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      await osspoiMasterAndSummary(setData, besId.slice(1), besName.slice(1), setVersionSummary);

      // Set the default selected option if none is selected
      if (!selectedOption && versionSummary.length > 0) {
        const latestVersion = getLatestVersion(versionSummary);
        if (latestVersion.version) {
          setSelectedOption(latestVersion.version);
        }
      }

      // If selectedOption is set, create links and verify them
      if (selectedOption) {
        const osarReportLink = createOsarReportLink(besName, selectedOption);
        const cosignLink = createCosignLink(besName, selectedOption);

        verifyLink(osarReportLink, setOsarReportData);
        checkFileExists(cosignLink, setCosignLinkExists);
      }
    };

    fetchData();
  }, [besId, besName, selectedOption, versionSummary]);

  const handleOptionChange: any = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
            const definedScore = item.hasOwnProperty("score") ? item.score : "Not Available";
            const techStackMap: any = {
              A: "Application",
              "L&F": "Language and Framework",
              DO: "DevOps and Infrastructure Tool",
              DA: "Distributed and Decentralized Application",
              S: "Open Source Security tool"
            };
            const languages = Object.keys(item.language);

            return (
              <>
                <Card key={ `TOPCARD${index}` } style={ { marginTop: "-1.5rem", paddingTop: "6px" } }>
                  <Grid key={ `TOPGRID1${index}` } container spacing={ 1 } pl={ 4 }>
                    <InfoGridItem label="Project Name" value={ item.name } />
                    <InfoGridSelect
                      label="Version"
                      value={ selectedOption }
                      onChange={ handleOptionChange }
                      options={ versionSummary.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()).map(option => option.version) }
                      key={ `TOPSELECT1${index}` }
                    />
                    <InfoGridItem label="BeS Score" value={ definedScore } />
                    <InfoGridItem label="BeS Tech Stack" value={ techStackMap[item.bes_technology_stack] || item.bes_technology_stack } />
                    <InfoGridItem label="BeS Tracking Id" value={ item.id } />
                    <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "12px" } }>
                      <a href={ item.html_url } target="_blank" rel="noopener noreferrer" style={ { textDecoration: 'none', color: 'inherit' } }>
                        <MKTypography variant="h6" textTransform="capitalize" color="text" style={ { fontSize: "15px", fontWeight: "normal" } }>
                          <GitHubIcon style={ { position: 'relative', top: '3px' } } fontSize="small" />
                          &nbsp; repository
                        </MKTypography>
                      </a>
                    </Grid>
                    <OSARGridItem osarReportData={ osarReportData } besName={ besName } selectedOption={ selectedOption } cosignLinkExists={ cosignLinkExists } />
                    <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "12px", position: "relative", bottom: "7px" } }>
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

                <Grid container spacing={ 1 } pt={ 2 } style={ { display: "flex", justifyContent: "space-around" } }>
                  { /* Project Description - Adjusted height */ }
                  <Grid item xs={ 12 } md={ 6 } style={ { display: "flex"} }>
                    <DescriptionCard title="Project Description" content={ item.description } />
                  </Grid>

                  { /* Languages and Tags - Combined height matches Project Description */ }
                  <Grid item xs={ 12 } md={ 6 } style={ { display: "flex", flexDirection: "column", justifyContent: "space-between" } }>
                    <LanguagesCard languages={ languages } style={ { flex: 1 } } />
                    <TagsCard tags={ item.tags } style={ { flex: 1 } } />
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
