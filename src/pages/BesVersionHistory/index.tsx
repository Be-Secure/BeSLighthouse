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
const FetchRecomedations = ({itemData, masterData}: any) => {

  return (
    <>
    <ul>
      <li>
        <MKTypography 
          variant="body1" 
          color="inherit" 
          style={{fontSize:"calc(0.2rem + 0.5vw)", 
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
          style={{fontSize:"calc(0.2rem + 0.5vw)", 
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
          style={{fontSize:"calc(0.2rem + 0.5vw)", 
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
      <MKBox pt={11} sx={{ mx: { xs: 2, lg: 3 } }}>
        {data.map((item: any) => {
          if (`:${item.name}` === besName) {
            let definedScore: string = "0";
            if(item.hasOwnProperty('score'))
               definedScore = item.score;
            else
               definedScore = "--";
            const envpath: string = `https://github.com/Be-Secure/besecure-ce-env-repo/tree/master/${item.name}/0.0.1/`;
            
            return (
              <>
              <Card style={{marginTop: "-1.5rem"}}>
                <Grid  
                        container 
                        spacing={1} 
                        pl={4} 
                        style={{height: "5rem"}}>
                  <Grid item 
                          xs={6} 
                          justifyContent="flex-start">
                    <Grid  
                        container 
                        style={{height: "2.3rem"}}>
                      <Grid item 
                          xs={4} 
                          justifyContent="flex-start">
                        <MKBox  
                             display="flex"  
                             py={1} 
                             pr={2}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                          style={{fontSize: "calc(0.4rem + 0.5vw)"}}        
                        >
                          Project Name: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          color="text"
                          style={{fontSize: "calc(0.4rem + 0.5vw)"}}
                        >
                          {item.name}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                    <Grid item 
                          xs={4} 
                          justifyContent="flex-start">    
                      <MKBox  
                             display="flex" 
                             py={1} 
                             pr={2}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                          style={{fontSize: "calc(0.4rem + 0.5vw)"}}
                        >
                          Version: &nbsp;
                        </MKTypography>

                        <Select
                          key={"test1"}
                          className={classes.select}
                          value={selectedOption}
                          onChange={handleOptionChange}
                          style={{fontSize: "calc(0.4rem + 0.5vw)", 
                                  height: '1.2rem', 
                                  width: "20px"}}
                        >
                          {
                            versionSummary.map((option: any, index: any) => (
                              <MenuItem key={index} value={option.version}>
                                {option.version} 
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </MKBox>
                    </Grid>
                    <Grid item 
                            xs={4} 
                            justifyContent="flex-start">
                        <MKBox k 
                              display="flex"
                              py={1}
                              pr={2}>
                          <MKTypography
                            variant="h6"
                            fontWeight="bold"
                            textTransform="capitalize"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            Score: &nbsp;
                          </MKTypography>
                          <MKTypography
                            variant="h6"
                            fontWeight="regular"
                            color="text"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            {definedScore}
                          </MKTypography>
                        </MKBox>
                      </Grid>
                    </Grid>


                    <Grid  
                        container 
                        style={{height: "2.3rem"}}>
                      <Grid item 
                          xs={4} 
                          justifyContent="flex-start">
                        <MKBox  
                           display="flex">
                      <MKTypography
                            variant="h6"
                            fontWeight="bold"
                            textTransform="capitalize"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            BeS Tracking Id: &nbsp;
                          </MKTypography>
                          <MKTypography
                            variant="h6"
                            fontWeight="regular"
                            color="text"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            {item.id}
                          </MKTypography>
                        </MKBox>
                    </Grid>
                    <Grid item 
                          xs={4} 
                          justifyContent="flex-start">    
                      <MKBox  display="flex">
                          <MKTypography
                            variant="h6"
                            fontWeight="bold"
                            textTransform="capitalize"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            BeS Tech Stack: &nbsp;
                          </MKTypography>
                          <MKTypography
                            variant="h6"
                            fontWeight="regular"
                            color="text"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            {item.bes_technology_stack}
                          </MKTypography>
                        </MKBox>
                    </Grid>
                    <Grid item 
                            xs={4} 
                            justifyContent="flex-start">
                        <MKBox display="flex" >
                          <MKTypography
                            variant="h6"
                            fontWeight="bold"
                            textTransform="capitalize"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          >
                            BeS Environment: &nbsp;
                          </MKTypography>
                          <MKTypography
                            variant="h6"
                            fontWeight="regular"
                            color="text"
                            style={{fontSize: "calc(0.3rem + 0.5vw)"}}
                          > 
                          <Link to={envpath}>{item.name}</Link>
                          
                          </MKTypography>
                        </MKBox>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item 
                          xs={6} 
                          justifyContent="flex-start">
                    <Grid  
                        container 
                        spacing={1} 
                        pl={4} 
                        style={{height: "3.3rem"}}> 
                    
                    <Grid item 
                          xs={12} 
                          justifyContent="flex-start">
                      <MKBox  
                             display="flex" 
                             py={1} 
                             pr={2} 
                             pl={4}>
                        <MKTypography
                          variant="h6"
                          fontWeight="bold"
                          textTransform="capitalize"
                          style={{fontSize: "calc(0.4rem + 0.5vw)"}}
                        >
                          Description: &nbsp;
                        </MKTypography>
                        <MKTypography
                          variant="h6"
                          fontWeight="regular"
                          color="text"
                          style={{fontSize: "calc(0.4rem + 0.5vw)"}}
                        >
                          {item.description}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
            <Card style={{marginTop: "0.3rem"}}>
                    <Grid  
                          container 
                          spacing={1} 
                          p={2}>
                      <Grid item 
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
                
            <MKBox style={{marginTop: "-0.5rem"}}>
                <Grid container 
                      spacing={3} 
                      pt={3} >
                  <Grid item 
                        xs={12} 
                        md={12} 
                        lg={12}
                        style={{paddingTop: "5px"}} >
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
