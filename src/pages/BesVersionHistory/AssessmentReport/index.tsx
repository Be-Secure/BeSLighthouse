import * as React from "react";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { Divider, Grid, Typography } from "@mui/material";
import { fetchJsonReport } from "../../../utils/fatch_json_report";
import { Link } from "react-router-dom";
import { assessment_datastore } from "../../../dataStore";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";

import {
  assessment_path,
  assessment_report
} from "../../../utils/assessmentReport";
import { forEach } from "lodash";

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      if (link.toLocaleLowerCase().endsWith(".pdf")) {
        setLinkStatus(true);
      } else {
        setLinkStatus(data);
      }
      return true;
    } catch (err) {
      if (link.toLocaleLowerCase().endsWith(".pdf")) {
        setLinkStatus(false);
      } else {
        setLinkStatus({});
      }
      return false;
    }
  } catch (error) {
    if (link.toLocaleLowerCase().endsWith(".pdf")) {
      setLinkStatus(false);
    } else {
      setLinkStatus({});
    }
    return false;
  }
};

const FetchLowScores = ({ data }: any) => {
  let lowscorers: any = [];
  let displayData: any = {};
  data.checks.forEach ((issue) => {
    if(issue.hasOwnProperty('score')){
      if(issue.score <= 5)
        lowscorers.push(issue);
    }
    else 
    {
      lowscorers.push(issue);
    }      
  });
  displayData = lowscorers.map(function(iss:any, index:number)
  {
    return(<>
            <li>
              <MKTypography variant="body1" 
                            color="inherit" 
                            style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                    marginTop: "calc(-0.4rem + (-0.2vw))", 
                                    paddingLeft: "calc(0.1rem + 0.3vw)"}}>
                 {iss.name} : {iss.reason}
              </MKTypography>
            </li>
          </>
        )
  })
  return(<>
          <Grid style={{minWidth: "200px"}}>
            <ul>
              {displayData}
            </ul>
          </Grid>
        </>
  )   
};

const FetchCS = ({ data }: any) => {
  
  return(<>
            <Grid style={{minWidth: "200px"}}>
              <ul>
                <li>
                    <MKTypography variant="body1" 
                                  color="inherit" 
                                  style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                          marginTop: "calc(-0.4rem + (-0.3vw))",
                                          paddingLeft: "calc(0.1rem + 0.3vw)"
                                        }}>
                      Age : {data.created_since}
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                     No. Of Contributors : {data.contributor_count}
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Update Frequency : {data.commit_frequency}
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Organisations : {data.org_count}
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body1" 
                                  color="inherit" 
                                  style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                          marginTop: "calc(-0.4rem + (-0.3vw))",
                                          paddingLeft: "calc(0.1rem + 0.3vw)"}}>
                    Issue Fixed : {data.closed_issues_count}
                  </MKTypography>
                </li>
                <li>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Last Updated : {data.updated_since}
                  </MKTypography>
                </li>
              </ul>
            </Grid>
          </>
        );
};

const FetchSAST = ({ data }: any) => {
  
  let critical: number = 0;
  let high: number = 0;
  let medium: number = 0;
  let low: number = 0;

  data.forEach ((vul) => {
     if(vul.rule.security_severity_level === "critical"){
       critical++;
     }else if(vul.rule.security_severity_level === "high"){
       high++;
     }else if(vul.rule.security_severity_level === "medium"){
       medium++;
     }else if(vul.rule.security_severity_level === "high"){
       low++;
     } 
  });

  return(<>
            <Grid style={{minWidth: "calc(10rem + 5vw)", marginTop:"2.1rem", marginLeft: "3rem"}}>
              <Grid container>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Critical : {critical}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    High : {high}
                  </MKTypography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Medium : {medium}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        marginTop: "calc(-0.4rem + (-0.3vw))",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Low : {low}
                  </MKTypography>
                  </Grid>
              </Grid>
            </Grid>
          </>
        );
};

const FetchLicense = ({ data, uniq_lic, itemData }: any) => {

  let license_list: string [] = [];
  let non_lic_files: number = 0;

  uniq_lic.forEach ((ul) => {
    if(ul.length !== 0)
      license_list.push(" "+ ul + ",")
  });

  data.forEach((ld) => {
    if(ld.LicenseConcluded && (ld.LicenseConcluded === "NOASSERTION" ||
       ld.LicenseConcluded.length === 0 ))
       non_lic_files++;
  });
  
  return(<>
          <Grid style={{minWidth: "200px"}}>
              <Grid container>
                <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    Project License : {itemData.license.key}
                  </MKTypography>
                </Grid>
                <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                  No. of Non License Files : {non_lic_files}
                </MKTypography>
                </Grid>
                <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    Unique Licenses : {license_list}
                </MKTypography>
                </Grid>
          </Grid>   
        </Grid>
      </>
    );
};

const FetchSBOM = ({ data, masterData }: any) => {
  
  let tracked: string []= [];
  let dis: any = {};
 
  data.forEach((dp) => {
    masterData.forEach((tp) => {
      if(dp.name === tp.name){
        tracked.push(dp.name);
      }  
    });
  });

  dis = tracked.map(function( td: string, index: number){
    return(<>
              <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)",
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                  {td}  
                </MKTypography>   
              </Grid>     
            </>
          );
  });

  return(<>
          <Grid style={{minWidth: "200px"}}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    Projects Under BeS : 
                </MKTypography>
                <Grid container>
                {dis}
                </Grid>
          </Grid>
        </>
      );
};

const CheckLink = ({ version, name, report, itemData, masterData }: any) => {
  const [linkStatus, setLinkStatus]: any = React.useState({});
  let reportNameMap = "";
  if (report === "Criticality Score") {
    reportNameMap = "Criticality Score";
  } else if (report === "Vulnerabilities") {
    reportNameMap = "Codeql";
  } else if (report === "License Compliance") {
    reportNameMap = "Fossology";
  } else if (report === "Dependencies") {
    reportNameMap = "SBOM";
  } else if (report === "ScoreCard") {
    reportNameMap = "Scorecard";
  }

  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
      link= `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;
      verifyLink(link, setLinkStatus);
    }
  }, [version]);

  let linkStatusLength: number = Object.values(linkStatus).length;
  if (report === "Criticality Score" && linkStatusLength !== 0){ 
    return (
      <>
        <Typography variant="h6" 
                    color="inherit" 
                    style={{fontSize: "calc(0.6rem + 0.5vw)",
                    justifyContent: "center",
                    display: "flex"}}>
           {linkStatus.criticality_score}
        </Typography>
        <Card style={{height: "100px", 
                      minWidth: "100%",
                      borderRadius: "3px"
                    }} 
                    sx={{ overflowY: "scroll"}}>
          <MKBox>
            <FetchCS 
             data={linkStatus}
            />
          </MKBox>
        </Card>
      </>
    );
  }

  const pathName: string = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;
  const myObject = { pathname: pathName, state: linkStatus } as {
    pathname: string;
  };

  if (report === "ScoreCard" && linkStatusLength !== 0) {  
    return (<>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)"}}>
                <Link to={myObject} 
                      style={{fontSize: "calc(0.6rem + 0.5vw)", 
                              display: "flex", 
                              justifyContent: "center"}}>
                  {linkStatus.score}
                </Link>
              </Typography>
              <Card style={{height: "100px",
                            minWidth: "100%",
                            borderRadius: "3px"
                          }} 
                        sx={{ overflowY: "scroll"}}>
                <MKBox>
                  <FetchLowScores 
                     data={linkStatus}
                  />
                </MKBox>
              </Card>
            </>
          );
  }

  if (report === "Vulnerabilities" && linkStatusLength !== 0) {    
    return (<>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)"}}>
                <Link to={myObject} 
                      style={{fontSize: "calc(0.6rem + 0.5vw)",
                              display: "flex", 
                              justifyContent: "center"}}>
                  {linkStatus.length}
                </Link>
              </Typography>
                <MKBox >
                 <FetchSAST 
                     data={linkStatus}
                 />
                </MKBox>
            </>
          );
  }

  if (report === "License Compliance" && linkStatusLength !== 0) {
    let uniqueLicenses: any = [];
    
    for (let i = 0; i < linkStatus.length; i++) {
      let flag: number = 0;
      for (let j = 0; j < uniqueLicenses.length; j++) {
        if (
          linkStatus[i].LicenseConcluded === uniqueLicenses[j] ||
          linkStatus[i].LicenseConcluded === "NOASSERTION"
        ) {
          flag = 1;
          break;
        }
      }
      if (flag === 0 && linkStatus[i].hasOwnProperty('LicenseConcluded') && linkStatus[i].LicenseConcluded.length !== 0) {
        uniqueLicenses.push(linkStatus[i].LicenseConcluded);
      }
    }
    return( 
            <>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)"}}>
                <Link to={myObject} 
                      style={{ fontSize: "calc(0.6rem + 0.5vw)",
                      display: "flex", 
                      justifyContent: "center"}}>
                  {uniqueLicenses.length}
                </Link>
              </Typography>
              <Card style={{height: "100px",
                            borderRadius: "3px"
                            }} 
                            >
                <MKBox>
                  <FetchLicense 
                     data={linkStatus}
                     uniq_lic={uniqueLicenses}
                     itemData={itemData}
                  />
                </MKBox>
              </Card>
            </>
          );
  }

  if (report === "Dependencies" && linkStatusLength !== 0) {
    return (<>
             <Typography variant="h6" 
                         color="inherit" 
                         style={{fontSize: "calc(0.6rem + 0.5vw)"
                               }}> 
                <Link to={myObject}
                      style={{ fontSize: "calc(0.6rem + 0.5vw)",
                      display: "flex", 
                      justifyContent: "center"}}>
                  {linkStatus.packages.length}
                </Link> 
             </Typography>
             <Card style={{height: "100px",
                           borderRadius: "3px"
                          }} 
                          sx={{ overflowY: "scroll"}}>
                <MKBox>
                  <FetchSBOM 
                     data={linkStatus.packages}
                     masterData={masterData}
                  />
                </MKBox>
              </Card>
            </>
          );
  }
  
  return (
    <Typography variant="h6" 
                color="inherit" 
                style={{fontSize: "calc(0.6rem + 0.5vw)"}}>
      --
    </Typography>
  );
};

const GetHeadings = ({ receivedValue }: any) => {

    if(receivedValue === "License Compliance"){
       return(<> {" "}
                  License Compatibiltity
                  <Icon title="Licensing information of the OSS" sx={{fontSize: 'calc(0.3rem + 0.3vw) !important'}}>
                    info
                  </Icon>
              </>);
    }else if(receivedValue === "Dependencies"){
      return(<> {" "}
                Dependencies
                <Icon title="Software Bill Of Material" sx={{fontSize: 'calc(0.3rem + 0.3vw) !important'}}>
                  info
                </Icon>
              </>);
      
    }else if(receivedValue === "ScoreCard"){
      return(<> {" "}
                OpenSSF Scorecard (0-10)
                <Icon title="Overall Security Score of the project" sx={{fontSize: 'calc(0.3rem + 0.3vw) !important'}}>
                  info
                </Icon>
              </>);
     
    }else if(receivedValue === "Criticality Score"){
      return(<> {" "}
                OpenSSF Criticality Score (0-1)
                <Icon title="Score to tell how critical the OSS project" sx={{fontSize: 'calc(0.3rem + 0.3vw) !important'}}>
                  info
                </Icon>
              </>);
     
    }else if(receivedValue === "Vulnerabilities"){
      return(<> {" "}
              Static Analysis Summary
              <Icon title="Provides Static Code Analysis (SAST) report by CodeQL / SonarQube" sx={{fontSize: 'calc(0.3rem + 0.3vw) !important'}}>
                info
              </Icon>
              </>);
    }else{
      return(receivedValue);
    }
}
function AssessmentReport({ title, name, version, itemData, masterData, ...other }: any) {
  const report: string[] = [
    "ScoreCard",
    "Criticality Score",
    "Vulnerabilities",
    "License Compliance",
    "Dependencies"
  ];
  return (    
    
      <Grid container 
            p={0.3} 
            justifyContent="center" 
            style={{width: "100%"}}>
        {report.map((value, index) => {
          return (
            <>
              <Grid item 
                    xs={2.4}>
                <MKBox p={0.3} 
                       borderRadius="lg">
                  <Grid p={1} 
                        justifyContent="center" 
                        style={{backgroundColor: "#f3f6f4", 
                                borderRadius: "5px", 
                                minHeight: "10rem"}} >
                    <Grid container 
                          justifyContent="center" 
                          alignItems="center" >
                      <Grid item justifyContent="center">
                        <Typography variant="h6" 
                                    color="black" 
                                    style={{fontSize: "calc(0.3rem + 0.5vw)"}}>
                          <GetHeadings receivedValue={value}/> 
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid >
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                          style={{display: "block"}}
                        >
                          <Grid>
                            <CheckLink
                              version={version}
                              name={name}
                              report={value}
                              itemData={itemData}
                              masterData={masterData}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </MKBox>
              </Grid>
            </>
          );
        })
      }
    </Grid>
  );
};

export default AssessmentReport;
