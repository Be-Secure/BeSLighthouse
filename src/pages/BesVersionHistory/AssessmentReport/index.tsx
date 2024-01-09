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
import { BOLD_WEIGHT } from "jest-matcher-utils";
//import SimpleBar from 'simplebar-react';
//import 'simplebar-react/dist/simplebar.min.css';

export const fetchJsonData = async (link: any, setJsonData: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      if (link.toLocaleLowerCase().endsWith(".pdf")) {
        setJsonData(true);
      } else {
        setJsonData(data);
      }
      return true;
    } catch (err) {
      if (link.toLocaleLowerCase().endsWith(".pdf")) {
        setJsonData(false);
      } else {
        setJsonData({});
      }
      return false;
    }
  } catch (error) {
    if (link.toLocaleLowerCase().endsWith(".pdf")) {
      setJsonData(false);
    } else {
      setJsonData({});
    }
    return false;
  }
};

export const fetchvulJsonData = async (link: any, vulTool: any, setCQData: any, setSQData: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      //console.log("fetcheddata=", data);
      if(vulTool === "codeql"){
         setCQData(data);
         //console.log("fetchedql=", data);
      }
      else if(vulTool === "sonarqube"){
         setSQData(data);
         
         //console.log("fetchedsl=", data);
      }
      else
         return false
    } catch (err) {
        
        return false;
    }
  } catch (error) {
      
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
            
              <MKTypography variant="body1" 
                            color="inherit" 
                            style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                     
                                    paddingLeft: "calc(0.1rem + 0.3vw)"}}>
                 <b>{iss.name} </b>: {iss.reason}
              </MKTypography>
            
          </>
        )
  })
  return(<>
          <Grid style={{minWidth: "200px"}}>
              {displayData}
          </Grid>
        </>
  )   
};

const FetchCS = ({ data }: any) => {
  
  return(<>
            <Grid style={{minWidth: "200px"}}>
                <Grid>
                    <MKTypography variant="body1" 
                                  color="inherit" 
                                  style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                          justifyContent: "center",
                                          display: "flex",
                                          paddingLeft: "calc(0.1rem + 0.3vw)"
                                        }}>
                      <b>Age </b>: {data.created_since} months
                  </MKTypography>
                </Grid>
                <Grid>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        justifyContent: "center",
                                        display: "flex",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    <b> No. Of Contributors </b>: {data.contributor_count}
                  </MKTypography>
                </Grid>
                
                <Grid>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        justifyContent: "center",
                                        display: "flex",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                   <b> Organisations </b>: {data.org_count}
                  </MKTypography>
                </Grid>
                <Grid>
                  <MKTypography variant="body1" 
                                  color="inherit" 
                                  style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                          justifyContent: "center",
                                          display: "flex",
                                          paddingLeft: "calc(0.1rem + 0.3vw)"}}>
                    <b>Issue Fixed </b>: {data.closed_issues_count}
                  </MKTypography>
                </Grid>
                <Grid>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                        justifyContent: "center",
                                        display: "flex",
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                   <b> Last Updated </b>: {data.updated_since}
                  </MKTypography>
                </Grid>
            </Grid>
          </>
        );
};

const FetchSAST = ({ cqData, sqData }: any) => {
  
  let critical: number = 0;
  let high: number = 0;
  let medium: number = 0;
  let low: number = 0;
  //console.log("receiveCQdData=" + cqData);
  //console.log("receivedSQData" + sqData);
  if (JSON.stringify(Object.values(cqData).length) !== "0" && 
      JSON.stringify(Object.values(sqData).length) === "0"){
    cqData.forEach ((vul) => {
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
            <Grid style={{minWidth: "calc(10rem + 5vw)", marginTop:"1.1rem", marginLeft: "1.5rem"}}>
              <Grid container>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Critical : {critical}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
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
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Medium : {medium}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Low : {low}
                  </MKTypography>
                  </Grid>
              </Grid>
            </Grid>
          </>
        );
  }else if (JSON.stringify(Object.values(cqData).length) === "0" && 
            JSON.stringify(Object.values(sqData).length) !== "0"){
    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;


    sqData[5].forEach ((vul) => {
      if(vul.severity === "BLOCKER"){
        sqblocker++;
      }else if(vul.severity === "CRITICAL"){
        sqcritical++;
      }else if(vul.severity === "MAJOR"){
        sqmajor++;
      }else if(vul.severity === "MINOR"){
        sqminor++;
      } 
    });

    return(<>
            <Grid style={{minWidth: "calc(10rem + 5vw)", marginTop:"1.1rem", marginLeft: "1.5rem"}}>
              <Grid container>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Blocker : {sqblocker}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Critical : {sqcritical}
                  </MKTypography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                }}>
                    Major : {sqmajor}
                  </MKTypography>
                  </Grid>
                  <Grid xs={6}>
                  <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.6rem + 0.5vw)", 
                                        
                                        paddingLeft: "calc(0.1rem + 0.3vw)"
                                      }}>
                    Minor : {sqminor}
                  </MKTypography>
                  </Grid>
              </Grid>
            </Grid>
          </>
        );
  } else if (JSON.stringify(Object.values(cqData).length) !== "0" && 
             JSON.stringify(Object.values(sqData).length) !== "0"){
    let cqcritical: number = 0;
    let cqhigh: number = 0;
    let cqmedium: number = 0;
    let cqlow: number = 0;

    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;

    cqData.forEach ((vul) => {
      if(vul.rule.security_severity_level === "critical"){
        cqcritical++;
      }else if(vul.rule.security_severity_level === "high"){
        cqhigh++;
      }else if(vul.rule.security_severity_level === "medium"){
        cqmedium++;
      }else if(vul.rule.security_severity_level === "low"){
        cqlow++;
      } 
    });

    sqData[5].forEach ((vul) => {
      if(vul.severity === "BLOCKER"){
        sqblocker++;
      }else if(vul.severity === "CRITICAL"){
        sqcritical++;
      }else if(vul.severity === "MAJOR"){
        sqmajor++;
      }else if(vul.severity === "MINOR"){
        sqminor++;
      } 
    });

    //console.log("Blocker="+sqblocker + " Critical="+ sqcritical + " Major=" + sqmajor)
    return(<>
          <Grid style={{minWidth: "calc(10rem + 5vw)"}}>
           <Grid container>
              <Grid xs={6}>
                <Grid>
                  <Grid container >
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                            <b>Critical </b>: {cqcritical}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>High </b>: {cqhigh}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                            <b>Medium </b>: {cqmedium}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>Low </b>: {cqlow}
                         </MKTypography>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={6}>
                  <Grid >
                    <Grid container>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>Critical </b> : {sqblocker}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>High</b> : {sqcritical}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>Medium</b> : {sqmajor}
                         </MKTypography>
                      </Grid>
                      <Grid xs={12} style={{justifyContent: "center", display: "flex"}}>
                         <MKTypography variant="body1" 
                                color="inherit" 
                                style={{fontSize:"calc(0.4rem + 0.3vw)"}}>
                             <b>Low</b>: {sqminor}
                         </MKTypography>
                      </Grid>
                    </Grid>
                  </Grid>
               </Grid>
            </Grid>
          </Grid>
          </>
        );
  }else{
    return(<></>);
  }
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
                                      justifyContent: "center",
                                      display: "flex",
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    <b>Project License </b>: {itemData.license.key}
                  </MKTypography>
                </Grid>
                <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      justifyContent: "center",
                                      display: "flex",
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                  <b>No. of Non License Files </b>: {non_lic_files}
                </MKTypography>
                </Grid>
                <Grid xs={12}>
                <MKTypography variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)", 
                                      justifyContent: "center",
                                      display: "flex",
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    <b>Unique Licenses </b>: {license_list}
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
      let duplicate: boolean  = false;
      if(dp.name === tp.name){
        tracked.forEach((tmptracked) => {
            if(tmptracked === dp.name)
            duplicate = true;
        });
        
        if(!duplicate)
          tracked.push(dp.name);
      }  
    });
  });

  dis = tracked.map(function( td: string, index: number){
    return(<>
              <Grid xs={12}>
                <MKTypography key={index} variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.2rem + 0.5vw)",
                                      paddingLeft: "calc(0.1rem + 0.3vw)",
                                      justifyContent: "center",
                                      display: "flex",
                                    }}>
                  {td}  
                </MKTypography>   
              </Grid>     
            </>
          );
  });

  return(<>
          <Grid style={{minWidth: "200px"}}>
                <MKTypography key="mainSBOM" variant="body1" 
                              color="inherit" 
                              style={{fontSize:"calc(0.3rem + 0.5vw)", 
                                      justifyContent: "center",
                                      display: "flex",
                                      paddingLeft: "calc(0.1rem + 0.3vw)"
                                    }}>
                    <b>Projects Under BeS :</b> 
                </MKTypography>
                <Grid container>
                {dis}
                </Grid>
          </Grid>
        </>
      );
};

const GetAssessmentData = ({ version, name, report, itemData, masterData }: any) => {
  const [jsonData, setJsonData]: any = React.useState({});
  const [codeQlData, setCQData]: any = React.useState({});
  const [sonarqubeData, setSQData]: any = React.useState({});
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
  
  //if(report !== "Vulnerabilities")
  //{
  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
         link= `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;
         fetchJsonData(link, setJsonData);
    }
    }, [version]);
    //console.log("json data =", jsonData);
  //}
  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
          link= `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-sonarqube-report.json`;
          fetchvulJsonData(link, "sonarqube", setCQData, setSQData);
    }
  }, [version]);
  
  //if(report === "Vulnerabilities")
  //{
    React.useEffect(() => {
      if (version.trim()) {
        let link: string = "";
          link= `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-codeql-report.json`;
          fetchvulJsonData(link, "codeql", setCQData, setSQData);
      }
    }, [version]);

   
    //sonarqubeData = JSON.stringify(sonarqubeData);
    //console.log("codeql data =", codeQlData);
    //console.log("sonarqube data=", sonarqubeData)
  //}

  
  let jsonDataLength: number = Object.values(jsonData).length;
  if (report === "Criticality Score" && jsonDataLength !== 0){ 
    return (
      <>
        <Typography variant="h6" 
                    color="inherit" 
                    style={{fontSize: "calc(0.6rem + 0.5vw)",
                    justifyContent: "center",
                    display: "flex"}}>
           {jsonData.criticality_score}
        </Typography>
        <Grid style={{height: "100px", 
                      minWidth: "90%",
                      borderRadius: "3px"
                    }} 
                    >
          <MKBox>
            <FetchCS 
             data={jsonData}
            />
          </MKBox>
        </Grid>
      </>
    );
  }

  const pathName: string = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;
  const myObject = { pathname: pathName, state: jsonData } as {
    pathname: string;
  };

  if (report === "ScoreCard" && jsonDataLength !== 0) {  
    return (<>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)"}}>
                <Link to={myObject} 
                      style={{fontSize: "calc(0.6rem + 0.5vw)", 
                              display: "flex", 
                              justifyContent: "center"}}>
                  {jsonData.score}
                </Link>
              </Typography>
              <Grid style={{height: "100px",
                            minWidth: "90%",
                            borderRadius: "3px"
                          }} 
                        sx={{ overflowY: "scroll"}}>
                <MKBox>
                  <FetchLowScores 
                     data={jsonData}
                  />
                </MKBox>
              </Grid>
            </>
          );
  }

  if (report === "Vulnerabilities" && (JSON.stringify(Object.values(codeQlData).length) !== "0" && 
                                       JSON.stringify(Object.values(sonarqubeData).length) === "0")) { 
    //console.log("codeql issues = " + codeQlData.length)   
    return (<>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)",
                                  display: "flex", 
                                  justifyContent: "center"}}>
                  {codeQlData.length}
              </Typography>
                <MKBox >
                 <FetchSAST 
                     cqData={codeQlData}
                     sqData={sonarqubeData}
                 />
                </MKBox>
            </>
          );
  }else if (report === "Vulnerabilities" && (JSON.stringify(Object.values(sonarqubeData).length) !== "0" && 
                                             JSON.stringify(Object.values(codeQlData).length) === "0")) { 
    //console.log("sonarqube issues = " + Object.values(sonarqubeData).length)   
    return (<>
              <Typography variant="h6" 
                          color="inherit" 
                          style={{fontSize: "calc(0.6rem + 0.5vw)",
                                  display: "flex", 
                                  justifyContent: "center"}}>
                  {Object.values(sonarqubeData).length}
              </Typography>
                <MKBox >
                 <FetchSAST 
                     cqData={codeQlData}
                     sqData={sonarqubeData}
                 />
                </MKBox>
            </>
          );
  }else if (report === "Vulnerabilities" && (JSON.stringify(Object.values(codeQlData).length) !== "0" && 
                                            JSON.stringify(Object.values(sonarqubeData).length) !== "0")){
    //console.log("codeql issues both = " + JSON.stringify(Object.values(codeQlData).length))
    //console.log("sonarqube issues both = " + JSON.stringify(Object.values(sonarqubeData).length))
    const codeqldetails: any = Object.values(codeQlData);
    const sonardetails: any = Object.values(sonarqubeData);
    const codeqllength: number = Object.values(codeQlData).length;
    const sonarlength: number = Object.values(sonarqubeData).length;
    //console.log(codeqldetails.length);
    //console.log(Object.values(sonardetails));
    return(
      <>
          <Grid container xs={12}>
             <Grid xs={6}>
                <Typography variant="h6" 
                            color="inherit" 
                            style={{fontSize: "calc(0.6rem + 0.5vw)",
                                  justifyContent: "center",
                                  display: "flex"}}>
                  {codeqllength}
                </Typography>
             </Grid>
             <Grid xs={6}>
                <Typography variant="h6" 
                            color="inherit" 
                            style={{fontSize: "calc(0.6rem + 0.5vw)", 
                                  justifyContent: "center",
                                  display: "flex"}}>
                    {sonardetails[0]}
                </Typography>
             </Grid>
          </Grid>
          <Grid container>
            <Grid>
              <MKBox >
                 <FetchSAST 
                     cqData={codeqldetails}
                     sqData={sonardetails}
                 />
                </MKBox>
            </Grid>
          </Grid>
      </>
    );
  }

  if (report === "License Compliance" && jsonDataLength !== 0) {
    let uniqueLicenses: any = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      let flag: number = 0;
      for (let j = 0; j < uniqueLicenses.length; j++) {
        if (
          jsonData[i].LicenseConcluded === uniqueLicenses[j] ||
          jsonData[i].LicenseConcluded === "NOASSERTION"
        ) {
          flag = 1;
          break;
        }
      }
      if (flag === 0 && jsonData[i].hasOwnProperty('LicenseConcluded') && jsonData[i].LicenseConcluded.length !== 0) {
        uniqueLicenses.push(jsonData[i].LicenseConcluded);
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
              <Grid style={{height: "100px",
                            borderRadius: "3px"
                            }} 
                            >
                <MKBox>
                  <FetchLicense 
                     data={jsonData}
                     uniq_lic={uniqueLicenses}
                     itemData={itemData}
                  />
                </MKBox>
              </Grid>
            </>
          );
  }

  if (report === "Dependencies" && jsonDataLength !== 0) {
    return (<>
             <Typography variant="h6" 
                         color="inherit" 
                         style={{fontSize: "calc(0.6rem + 0.5vw)"
                               }}> 
                <Link to={myObject}
                      style={{ fontSize: "calc(0.6rem + 0.5vw)",
                      display: "flex", 
                      justifyContent: "center"}}>
                  {jsonData.packages.length}
                </Link> 
             </Typography>
             <Grid style={{height: "100px",
                           borderRadius: "3px"
                          }} 
                          sx={{ overflowY: "scroll"}}>
                <MKBox>
                  <FetchSBOM 
                     data={jsonData.packages}
                     masterData={masterData}
                  />
                </MKBox>
              </Grid>
            </>
          );
  }
  
  return (
    <Typography variant="h6" 
                color="inherit" 
                style={{fontSize: "calc(0.6rem + 0.5vw)", display: "flex", 
                justifyContent: "center"}}>
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

  return (<>
      <Grid container 
            p={0.3} 
            justifyContent="center" 
            style={{width: "100%"}}>
        {report.map((value) => {
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
                            <GetAssessmentData
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
    </>
  );
};

export default AssessmentReport;
