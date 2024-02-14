import * as React from "react";


import Icon from "@mui/material/Icon";
import { Backdrop, Box, Button, Divider, Fade, Grid, Modal, Typography } from "@mui/material";
import { fetchJsonReport } from "../../../utils/fatch_json_report";
import { Link } from "react-router-dom";
import { assessment_datastore } from "../../../dataStore";
import MKBox from "../../../components/MKBox";
import MKTypography from "../../../components/MKTypography";
import {
  assessment_path,
  assessment_report
} from "../../../utils/assessmentReport";
import FetchSAST from "./FetchSastReport";

import SastToggleButton from "./SastToggleButton"
import { useState } from "react";
import vulnerabilityIcon from "../../../assets/images/security.png"

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
      if (vulTool === "codeql") {
        setCQData(data);
      }
      else if (vulTool === "sonarqube") {
        setSQData(data);
      }
      else
        return false
    } catch (err) {
      if (vulTool === "codeql") {
        setCQData([]);
      }
      else if (vulTool === "sonarqube") {
        setSQData({});
      }
      return false;
    }
  } catch (error) {
    if (vulTool === "codeql") {
      setCQData([]);
    }
    else if (vulTool === "sonarqube") {
      setSQData({});
    }
    return false;
  }
};

const FetchLowScores = ({ data }: any) => {
  let lowscorers: any = [];
  let displayData: any = {};
  data.checks.forEach((issue) => {
    if (issue.hasOwnProperty('score')) {
      if (issue.score <= 5)
        lowscorers.push(issue);
    }
    else {
      lowscorers.push(issue);
    }
  });
  displayData = lowscorers.map(function (iss: any, index: number) {
    return (<>
      <MKTypography variant="body1"
        key={`MKTypoSC${index}`}
        color="inherit"
        style={{
          fontSize: "12px",
          paddingLeft: "calc(0.1rem + 0.3vw)"
        }}>
        <b key={`BOLDSC${index}`}>{iss.name} </b>: {iss.reason}
      </MKTypography>
    </>
    )
  })
  return (<>
    <Grid key={`GRIDSC2`}
      style={{ minWidth: "200px" }}>
      {displayData}
    </Grid>
  </>
  )
};

const FetchCS = ({ data }: any) => {
  return (<>
    <Grid key={`GridCS1`}
      style={{ minWidth: "200px", textAlign: "left", paddingTop: "5px" }}>
      <Grid key={`GridCS2`}>
        <MKTypography variant="body1"
          key={`MKTypoCS1`}
          color="inherit"
          style={{
            fontSize: "12px",
            // justifyContent: "center",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key="BOLDCS5">Age </b>: {data.created_since} months
        </MKTypography>
      </Grid>
      <Grid key={`GridCS22`}>
        <MKTypography variant="body1"
          key={`MKTypoCS2`}
          color="inherit"
          style={{
            fontSize: "12px",
            // justifyContent: "center",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key="BOLDCS4"> No. Of Contributors </b>: {data.contributor_count}
        </MKTypography>
      </Grid>
      <Grid key={`GridCS3`}>
        <MKTypography variant="body1"
          key={`MKTypoCS3`}
          color="inherit"
          style={{
            fontSize: "12px",
            // justifyContent: "center",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key="BOLDCS3"> Organisations </b>: {data.org_count}
        </MKTypography>
      </Grid>
      <Grid key={`GridCS4`}>
        <MKTypography variant="body1"
          key={`MKTypoCS4`}
          color="inherit"
          style={{
            fontSize: "12px",
            // justifyContent: "center",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key="BOLDCS2">Issue Fixed </b>: {data.closed_issues_count}
        </MKTypography>
      </Grid>
      <Grid key={`GridCS5`}>
        <MKTypography variant="body1"
          key={`MKTypoCS5`}
          color="inherit"
          style={{
            fontSize: "12px",
            // justifyContent: "center",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key="BOLDCS1"> Last Updated </b>: {data.updated_since}
        </MKTypography>
      </Grid>
    </Grid>
  </>
  );
};

// const FetchSAST = ({ cqData, sqData }: any) => {

//   let critical: number = 0;
//   let high: number = 0;
//   let medium: number = 0;
//   let low: number = 0;
//   let sqissueslen: number = 0;

//   if (JSON.stringify(Object.values(sqData).length) !== "0") {
//     sqissueslen = sqData.length;
//   }

//   if (JSON.stringify(Object.values(cqData).length) !== "0" &&
//     sqissueslen === 0) {

//     cqData.forEach((vul) => {
//       if (vul.rule.security_severity_level === "critical") {
//         critical++;
//       } else if (vul.rule.security_severity_level === "high") {
//         high++;
//       } else if (vul.rule.security_severity_level === "medium") {
//         medium++;
//       } else if (vul.rule.security_severity_level === "high") {
//         low++;
//       }
//     });

//     return (<>
//       <Grid key={`GRIDSASTCQ1`}
//         style={{
//           minWidth: "calc(10rem + 5vw)",
//           marginTop: "1.1rem",
//           // marginLeft: "1.5rem",
//           fontSize: "15px",
//           justifyContent: "left"
//         }}>
//         <Grid container
//           key={`GRIDSASTCQ2`}>
//           <Grid item
//             xs={6}
//             key={`GRIDSASTCQ3`}
//             style={{ 
//               fontSize: "13px"
//              }}
//             >
//             <MKTypography variant="body1"
//               key={`MKTYPOSASTCQ1`}
//               color="inherit"
//               style={{ fontSize: "15px" }}
//               >
//               <b key="BOLDCQ1">Critical : </b>{critical}
//             </MKTypography>
//           </Grid>
//           <Grid item
//             key={`GRIDSASTCQ4`}
//             xs={6}>
//             <MKTypography variant="body1"
//               key={`MKTypoSASTCQ2`}
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 // paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDCQ2">High : </b>{high}
//             </MKTypography>
//           </Grid>
//         </Grid>
//         <Grid key={`GRIDSASTCQ5`}
//           container>
//           <Grid item
//             key={`GRIDSASTCQ6`}
//             xs={6}>
//             <MKTypography variant="body1"
//               key={`MKTypoSASTCQ3`}
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDCQ3">Medium : </b>{medium}
//             </MKTypography>
//           </Grid>
//           <Grid item
//             key={`GRIDSASTCQ7`}
//             xs={6}>
//             <MKTypography key={`MKTypoSASTCQ4`}
//               variant="body1"
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDCQ4"> Low : </b> {low}
//             </MKTypography>
//           </Grid>
//         </Grid>
//         </Grid>
//     </>
//     );
//   } else if (JSON.stringify(Object.values(cqData).length) === "0" &&
//     sqissueslen !== 0) {
//     let sqblocker: number = 0;
//     let sqcritical: number = 0;
//     let sqmajor: number = 0;
//     let sqminor: number = 0;
//     let sqissues: any = "0";
//     sqissues = Object.values(sqData)[5]

//     sqData.forEach((vul) => {
//       if (vul.severity === "BLOCKER") {
//         sqblocker++;
//       } else if (vul.severity === "CRITICAL") {
//         sqcritical++;
//       } else if (vul.severity === "MAJOR") {
//         sqmajor++;
//       } else if (vul.severity === "MINOR") {
//         sqminor++;
//       }
//     });

//     return (<>
//       <Grid key={`GRIDSASTSQ1`}
//         style={{
//           minWidth: "calc(10rem + 5vw)",
//           marginTop: "1.1rem",
//           marginLeft: "1.5rem"
//         }}>
//         <Grid key={`GRIDSASTSQ2`}
//           container>
//           <Grid item
//             key={`GRIDSASTSQ3`}
//             xs={6}>
//             <MKTypography variant="body1"
//               color="inherit"
//               key={`MKTypoSASTSQ1`}
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDSQ1"> Critical : </b> {sqblocker}
//             </MKTypography>
//           </Grid>
//           <Grid item
//             key={`GRIDSASTSQ4`}
//             xs={6}>
//             <MKTypography variant="body1"
//               key={`MKTypoSASTSQ2`}
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDSQ2"> High : </b> {sqcritical}
//             </MKTypography>
//           </Grid>
//         </Grid>
//         <Grid key={`GRIDSASTSQ5}`}
//           container>
//           <Grid item
//             key={`GRIDSASTSQ6`}
//             xs={6}>
//             <MKTypography variant="body1"
//               key={`MKTypoSASTSQ3`}
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDSQ3">Medium : </b> {sqmajor}
//             </MKTypography>
//           </Grid>
//           <Grid item
//             key={`GRIDSASTSQ7`}
//             xs={6}>
//             <MKTypography variant="body1"
//               key={`MKTypoSASTSQ4`}
//               color="inherit"
//               style={{
//                 fontSize: "calc(0.6rem + 0.5vw)",
//                 paddingLeft: "calc(0.1rem + 0.3vw)"
//               }}>
//               <b key="BOLDSQ4">Low : </b>{sqminor}
//             </MKTypography>
//           </Grid>
//         </Grid>
//       </Grid>
//     </>
//     );
//   } else if (JSON.stringify(Object.values(cqData).length) !== "0" &&
//     sqissueslen !== 0) {
//     let cqcritical: number = 0;
//     let cqhigh: number = 0;
//     let cqmedium: number = 0;
//     let cqlow: number = 0;

//     let sqblocker: number = 0;
//     let sqcritical: number = 0;
//     let sqmajor: number = 0;
//     let sqminor: number = 0;

//     cqData.forEach((vul) => {
//       if (vul.rule.security_severity_level === "critical") {
//         cqcritical++;
//       } else if (vul.rule.security_severity_level === "high") {
//         cqhigh++;
//       } else if (vul.rule.security_severity_level === "medium") {
//         cqmedium++;
//       } else if (vul.rule.security_severity_level === "low") {
//         cqlow++;
//       }
//     });

//     sqData.forEach((vul) => {
//       if (vul.severity === "BLOCKER") {
//         sqblocker++;
//       } else if (vul.severity === "CRITICAL") {
//         sqcritical++;
//       } else if (vul.severity === "MAJOR") {
//         sqmajor++;
//       } else if (vul.severity === "MINOR") {
//         sqminor++;
//       }
//     });

//     return (<>
//       <Grid key={`GRIDSASTCQSQ1`}
//         style={{ minWidth: "calc(10rem + 5vw)" }}>
//         <Grid key={`GRIDSASTCQSQ2`}
//           container>
//           <Grid item
//             key={`GRIDSASTCQSQ3`}
//             xs={6}>
//             <Grid key={`GRIDSASTCQSQ4`}>
//               <Grid key={`GRIDSASTCQSQ5`}
//                 container >
//                 <Grid item
//                   key={`GRIDSASTCQSQ6`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ1`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ1">Critical </b>: {cqcritical}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ7`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ2`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ2">High </b>: {cqhigh}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ8`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ3`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ3">Medium </b>: {cqmedium}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ9`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ4`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ4">Low </b>: {cqlow}
//                   </MKTypography>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item
//             key={`GRIDSASTCQSQ10`}
//             xs={6}>
//             <Grid key={`GRIDSASTCQSQ11`}>
//               <Grid key={`GRIDSASTCQSQ12`}
//                 container>
//                 <Grid item
//                   key={`GRIDSASTCQSQ13`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ5`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ5">Critical </b> : {sqblocker}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ14`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASRCQSQ6`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ6">High</b> : {sqcritical}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ15`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ7`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ7">Medium</b> : {sqmajor}
//                   </MKTypography>
//                 </Grid>
//                 <Grid item
//                   key={`GRIDSASTCQSQ16`}
//                   xs={12}
//                   style={{
//                     justifyContent: "center",
//                     display: "flex"
//                   }}>
//                   <MKTypography variant="body1"
//                     key={`MKTypoSASTCQSQ8`}
//                     color="inherit"
//                     style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
//                     <b key="BOLDCQSQ8">Low</b>: {sqminor}
//                   </MKTypography>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </>
//     );
//   } else {
//     return (
//       <>
//         <Typography variant="body1"
//           key={`MKTypoLBlankCQSQ1`}
//           color="inherit"
//           style={{
//             fontSize: "calc(0.3rem + 0.5vw)",
//             display: "flex",
//             justifyContent: "center"
//           }}>
//           No SAST issues data Available
//         </Typography>
//       </>
//     );
//   }
// };

const FetchLicense = ({ data, uniq_lic, itemData }: any) => {

  let license_list: string[] = [];
  let non_lic_files: number = 0;
  let project_lcesnse: string = "Not Found";

  uniq_lic.forEach((ul) => {
    if (ul.length !== 0)
      license_list.push(" " + ul + ",")
  });

  data.forEach((ld) => {
    if (ld.LicenseConcluded && (ld.LicenseConcluded === "NOASSERTION" ||
      ld.LicenseConcluded.length === 0))
      non_lic_files++;
  });
  if (itemData.license && itemData.license.key) {
    project_lcesnse = itemData.license.key;
  }

  if (JSON.stringify(Object.values(itemData).length) !== "0") {
    return (<>
      <Grid key={`GRIDL1`}
        style={{ minWidth: "200px" }}>
        <Grid key={`GRIDL2`}
          container style={{ paddingLeft: "5px" }}>
          <Grid item
            key={`GRIDL3`}
            xs={12}>
            <MKTypography variant="body1"
              key={`MKTypoL1`}
              color="inherit"
              style={{
                fontSize: "12px",
                justifyContent: "left",
                display: "flex",
                // paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDL2">Project License </b>: {project_lcesnse}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDL4`}
            xs={12}>
            <MKTypography variant="body1"
              key={`MKTypoL2`}
              color="inherit"
              style={{
                fontSize: "12px",
                justifyContent: "left",
                display: "flex",
                // paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDL3">Non-License Files </b>: {non_lic_files}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDL5`}
            xs={12}>
            <MKTypography variant="body1"
              key={`MKTypoL3`}
              color="inherit"
              style={{
                fontSize: "12px",
                justifyContent: "left",
                display: "flex",
                // paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDL4">Unique Licenses</b>:
            </MKTypography>
            <MKTypography
              fontSize="12px"
            >
              {license_list}
            </MKTypography>
          </Grid>
        </Grid>
      </Grid>
    </>
    );
  } else {
    return (<><MKTypography variant="h6"
      key={`MKTypoLBlank`}
      color="inherit"
      style={{
        fontSize: "12px", display: "flex",
        justifyContent: "center"
      }}>
      Not Available
    </MKTypography></>)
  }
};

const FetchSBOM = ({ data, masterData, name }: any) => {
  let tracked: string[] = [];
  let dis: any = {};
  data.forEach((dp) => {
    if (!dp.name) {
      return;
    }
    if (dp.name.toLowerCase() === name.toLowerCase()) {
      return;
    }
    masterData.forEach((tp) => {
      let duplicate: boolean = false;
      if (dp.name.toLowerCase() === tp.name.toLowerCase()) {
        tracked.forEach((tmptracked) => {
          if (tmptracked.toLowerCase() === dp.name.toLowerCase())
            duplicate = true;
        });

        if (!duplicate)
          tracked.push(dp.name);
      }
    });
  });
  dis = tracked.map(function (td: string, index: number) {
    const dataObject = masterData.find(function (item) {
      return item.name == td
    })
    const trackingID = dataObject?.id
    return (<>
      <Grid item
        key={`GRIDSBOM${index}`}
        xs={12}>
        <MKTypography variant="body1"
          key={`MKTypoSBOM${index}`}
          color="inherit"
          style={{
            fontSize: "12px",
            paddingLeft: "calc(0.1rem + 0.3vw)",
            justifyContent: "left",
            display: "flex",
          }}>
          {/* Using link the data was not getting loaded. Fix it later */}
          {/* <Link to={`/BeSLighthouse/Project-Of-Interest/bes_version_history/:${trackingID}/:${td}`}>{td}</Link> */}
          <a href={`/BeSLighthouse/Project-Of-Interest/bes_version_history/:${trackingID}/:${td}`}>{td}</a>
        </MKTypography>
      </Grid>
    </>
    );
  });
  return (<>
    <Grid key={`GRIDSBOMMAIN`}
      style={{ minWidth: "200px" }}>
      {tracked.length !== 0 ? (
        <MKTypography key="MKTypoSBOMMain" variant="body1"
          color="inherit"
          style={{
            fontSize: "12px",
            justifyContent: "left",
            display: "flex",
            paddingLeft: "calc(0.1rem + 0.3vw)"
          }}>
          <b key={`BOLDSBOM1`}>Tracked under BeS :</b>
        </MKTypography>
      ) : (
        <MKTypography key="MKTypoSBOMMain" variant="body1"
          color="inherit"

          style={{
            fontSize: "12px", display: "flex",
            justifyContent: "center", alignItems: "center", position: "relative", top: "55px"
          }}>
          <b key={`BOLDSBOM1`}>No dependencies tracked under BeS</b>
        </MKTypography>
      )}
      <Grid key={`GRIDSBOMSUBMAIN`}
        container>
        {dis}
      </Grid>
    </Grid>
  </>
  );
};

function GetAssessmentData(version, name, report, itemData, masterData) {
  const [jsonData, setJsonData]: any = React.useState({});
  const [codeQlData, setCQData]: any = React.useState([]);
  const [sonarqubeData, setSQData]: any = React.useState({});


  let reportNameMap = "";
  let reportNameMapCodeql = "";
  let reportNameMapSonar = "";

  if (report === "Criticality Score") {
    reportNameMap = "Criticality Score";
  } else if (report === "Vulnerabilities") {
    reportNameMapCodeql = "Codeql";
    reportNameMapSonar = "Sonarqube";
  } else if (report === "License Compliance") {
    reportNameMap = "Fossology";
  } else if (report === "Dependencies") {
    reportNameMap = "SBOM";
  } else if (report === "ScoreCard") {
    reportNameMap = "Scorecard";
  }

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;
      fetchJsonData(link, setJsonData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMapSonar]}/${name}-${version}-sonarqube-report.json`;
      fetchvulJsonData(link, "sonarqube", setCQData, setSQData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMapCodeql]}/${name}-${version}-codeql-report.json`;
      fetchvulJsonData(link, "codeql", setCQData, setSQData);
    }
  }, [version]);

  let jsonDataLength: number = Object.values(jsonData).length;
  let data_array: any[]
  if (report === "Criticality Score" && jsonDataLength !== 0) {
    let color_code = "";
    let risk_level = "";
    if (jsonData.criticality_score >= 0.1 && jsonData.criticality_score < 0.4) {
      color_code = "#008000";
      risk_level = "Low risk";
    } else if (jsonData.criticality_score >= 0.4 && jsonData.criticality_score < 0.6) {
      color_code = "#FFC300";
      risk_level = "Medium risk";
    } else if (jsonData.criticality_score >= 0.6 && jsonData.criticality_score <= 1) {
      color_code = "#FF5733";
      risk_level = "High risk";
    }
    return data_array = [jsonData.criticality_score.toFixed(2), <FetchCS data={jsonData} />, color_code,vulnerabilityIcon]

    return (
      <>
        {/* Criticality score value */}
        {/* <MKTypography variant="h6"
          key={`TypoCriticalityScore`}
          color="inherit"
          style={{
            fontSize: "15px",
            justifyContent: "center",
            display: "flex"
          }}> */}
        {/* {jsonData.criticality_score} */}
        {/* Criticality score data */}
        {/* </MKTypography> */}
        {/* <Grid key={`GridCriticalutyScore`}
          style={{
            height: "150px",
            minWidth: "90%",
            borderRadius: "3px",
            fontSize: "20px",
          }}
        > */}
        {/* <MKBox> */}
        {/* <FetchCS
              data={jsonData}
            /> */}
        {/* </MKBox> */}
        {/* </Grid> */}
      </>
    );
  }

  let pathNameCodeql: string;
  let pathNameSonar: string;
  let pathName: string;
  let myObjectCodeql;
  let myObjectSonar;
  let myObject;

  //   if (report === "Vulnerabilities") {
  //     pathNameCodeql = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMapCodeql}`;
  //     pathNameSonar = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMapSonar}`;
  //     myObjectCodeql = { pathname: pathNameCodeql, state: jsonData } as {
  //       pathname: string;
  //     };
  //     myObjectSonar = { pathname: pathNameSonar, state: jsonData } as {
  //       pathname: string;
  //     };
  //   } else {

  //     pathName = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;
  //     myObject = { pathname: pathName, state: jsonData } as {
  //       pathname: string;
  //     };
  //   }
  if (report === "ScoreCard" && jsonDataLength !== 0) {
    let color_code = "";
    let risk_level = "";
    if (jsonData.score >= 0 && jsonData.score <= 2) {
      color_code = "#008000";
      risk_level = "Low risk";
    } else if (jsonData.score > 2 && jsonData.score <= 5) {
      color_code = "#FFC300";
      risk_level = "Medium risk";
    } else if (jsonData.score > 5 && jsonData.score <= 7.5) {
      color_code = "#FF5733";
      risk_level = "High risk";
    } else if (jsonData.score > 7.5 && jsonData.score <= 10) {
      color_code = "#C70039";
      risk_level = "Critical risk";
    }
    return data_array = [jsonData.score, <FetchLowScores data={jsonData} />, color_code,vulnerabilityIcon]
    // <>
    //   {/* Display scorecard score */}
    //   <Typography variant="h6"
    //     key={`TypoSC1`}
    //     color="inherit"
    //     style={{ fontSize: "15px", marginLeft: "20px" }}>
    //     <Link to={myObject} key={`LinkSC1`} style={{ fontSize: "calc(0.6rem + 0.5vw)", display: "flex", justifyContent: "center" }}>
    //       <span style={{ color: color_code }}>{jsonData.score}</span>
    //       <span style={{ fontSize: "11px", color: "black" }}>&nbsp;({risk_level})</span>
    //     </Link>
    //   </Typography>
    //   {/* Scorecard data */}
    //   <Grid key={`GridSC1`}
    //     style={{
    //       height: "150px",
    //       minWidth: "90%",
    //       borderRadius: "3px",
    //       fontSize: "15px"
    //     }}
    //     sx={{ overflowY: "scroll" }}>
    //     <MKBox>
    //       <FetchLowScores
    //         data={jsonData}
    //       />
    //     </MKBox>
    //   </Grid>
    // </>
  }

  //   if (report === "Vulnerabilities" && (Object.values(codeQlData).length !== 0 &&
  //     Object.values(sonarqubeData).length === 0)) {
  //     return (<>
  //       {/* Codeql score */}

  //       <Typography variant="h6"
  //         key="SASCQTMAINHEADING"
  //         color="inherit"
  //         style={{
  //           fontSize: "13px",
  //           display: "flex",
  //           justifyContent: "center",
  //         }}>
  //         {/* <a href=""></a> */}
  //         <Link to={myObjectCodeql}
  //           key={`LinkSC1`}
  //           style={{
  //             fontSize: "13px",
  //             display: "flex",
  //             justifyContent: "center"
  //           }}>
  //           CodeQL: {codeQlData.length}
  //         </Link>
  //       </Typography>
  //       <MKBox key="MKBOXSASTCQMAINBODY">
  //         <FetchSAST
  //           cqData={codeQlData}
  //           sqData={sonarqubeData}
  //         />
  //       </MKBox>
  //     </>
  //     );
  //   } else if (report === "Vulnerabilities" && (Object.values(sonarqubeData).length !== 0 &&
  //     Object.values(codeQlData).length === 0)) {
  //     let issues: any = Object.values(sonarqubeData)[5];
  //     return (<>
  //       <Typography variant="h6"
  //         key="SASSQTMAINHEADING"
  //         color="inherit"
  //         style={{
  //           fontSize: "13px",
  //           display: "flex",
  //           justifyContent: "center"
  //         }}>
  //         <Link to={myObjectSonar}
  //           key={`LinkSC1`}
  //           style={{
  //             fontSize: "13px",
  //             display: "flex",
  //             justifyContent: "center"
  //           }}>
  //           Sonarqube: {sonarqubeData.total}
  //         </Link>
  //       </Typography>
  //       <MKBox key="MKBOXSASTSQMAINBODY">
  //         <FetchSAST
  //           cqData={codeQlData}
  //           sqData={issues}
  //         />
  //       </MKBox>
  //     </>
  //     );
  //   } else if (report === "Vulnerabilities" && Object.values(codeQlData).length !== 0 &&
  //     Object.values(sonarqubeData).length !== 0) {
  //     // const codeqldetails: any = Object.values(codeQlData);
  //     // const codeqllength: number = Object.values(codeQlData).length;
  //     // let sqissues: any = Object.values(sonarqubeData)[5];

  //     return (
  //       <>
  //         <SastToggleButton myObjectCodeql={myObjectCodeql} myObjectSonar={myObjectSonar} codeQlData={codeQlData} sonarqubeData={sonarqubeData} />
  //         {/* <Grid item
  //           key="GRIDSASTCQSQMAIN1"
  //           container
  //           xs={12}>
  //           <Grid item
  //             key="GRIDSASTCQSQMAIN2"
  //             xs={6} style={{ display: "flex" }}>
  //             <Typography variant="h6"
  //               key="TYPOSASTCQSQMAIN1"
  //               color="inherit"
  //               style={{
  //                 fontSize: "13px",
  //                 justifyContent: "left",
  //                 display: "flex",
  //                 paddingBottom: "8px",
  //                 paddingTop: "4px",
  //                 paddingLeft: "8px"
  //               }}>
  //               <Link to={myObjectCodeql}
  //                 key={`LinkSC1`}>
  //                 CodeQL: {codeqllength}
  //               </Link>

  //             </Typography>
  //           </Grid>
  //           <Grid item
  //             key="GRIDSASTCQSQMAIN3"
  //             xs={6}>
  //             <Typography variant="h6"
  //               key="TYPOSASTCQSQMAIN2"
  //               color="inherit"
  //               style={{
  //                 fontSize: "13px",
  //                 justifyContent: "center",
  //                 display: "flex",
  //                 paddingBottom: "8px",
  //                 paddingTop: "4px"
  //               }}>
  //               <Link to={myObjectSonar}
  //                 key={`LinkSC1`}
  //                 style={{
  //                   fontSize: "13.5px",
  //                   display: "flex",
  //                   justifyContent: "right",
  //                   paddingRight: "5px"

  //                 }}>
  //                 Sonarqube: {sonarqubeData.total}
  //               </Link>

  //             </Typography>
  //           </Grid>
  //         </Grid>
  //         <Grid key="GRIDSASTCQSQMAIN4"
  //           container>
  //             <MKBox key="MKBOXSASTCQSQMAIN1">
  //               <FetchSAST
  //                 cqData={codeqldetails}
  //                 sqData={sqissues}
  //               />
  //             </MKBox>
  //         </Grid> */}
  //       </>
  //     );
  //   }

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
    return data_array = [uniqueLicenses.length, <FetchLicense data={jsonData} uniq_lic={uniqueLicenses} itemData={itemData} />,"",vulnerabilityIcon]
    // <>
    //   <MKTypography variant="h6"
    //     key="TYPOLICMAIN1"
    //     color="inherit"
    //     style={{ fontSize: "calc(0.6rem + 0.5vw)" }}>
    //     <Link to={myObject}
    //       key="LINKLICMAIN1"
    //       style={{
    //         fontSize: "calc(0.6rem + 0.5vw)",
    //         display: "flex",
    //         justifyContent: "center",
    //       }}>
    //       {uniqueLicenses.length}
    //     </Link>
    //   </MKTypography>
    //   <Grid key="GRIDLICMAIN1"
    //     style={{
    //       height: "150px",
    //       borderRadius: "3px",
    //       overflowY: "scroll"
    //     }}
    //   >
    //     <MKBox>
    //       <FetchLicense
    //         data={jsonData}
    //         uniq_lic={uniqueLicenses}
    //         itemData={itemData}
    //       />
    //     </MKBox>
    //   </Grid>
    // </>
  }
  let flag = false;
  if (report === "Dependencies" && jsonDataLength !== 0) {
    if (!(jsonData.packages.length === 1 && jsonData.packages[0].name.toLowerCase() === name.toLowerCase())) {
      return data_array = [(jsonData.packages.length) - 1, <FetchSBOM data={jsonData.packages} masterData={masterData} name={name}/>,"",vulnerabilityIcon]
    }
    //         <Typography variant="h6"
    //           key="TYPOSBOMMAIN1"
    //           color="inherit"
    //           style={{
    //             fontSize: "calc(0.6rem + 0.5vw)"
    //           }}>
    //           <Link to={myObject}
    //             key="LINKSBOMMAIN1"
    //             style={{
    //               fontSize: "calc(0.6rem + 0.5vw)",
    //               display: "flex",
    //               justifyContent: "center"
    //             }}>
    //             {(jsonData.packages.length) - 1}
    //           </Link>
    //         </Typography>
    //         <Grid key="GRIDSBOMMAIN1"
    //           style={{
    //             height: "100px",
    //             borderRadius: "3px"
    //           }}
    //           sx={{ overflowY: "scroll" }}>
    //           <MKBox key="MKBOXSBOMMAIN1">
    //             <FetchSBOM
    //               data={jsonData.packages}
    //               masterData={masterData}
    //               name={name}
    //             />
    //           </MKBox>
    //         </Grid>
    //       </>
    //       );
    //     } 
    // else {
    //       flag = true;
    //     }


    //   return (
    //     <MKTypography variant="h6"
    //       key="TYPOSBOMMAINBLANK1"
    //       color="inherit"
    //       style={{
    //         fontSize: "12px", display: "flex",
    //         justifyContent: "center", alignItems: "center", position: "relative", top: "67px"
    //       }}>
    //       {flag ? (
    //         "No dependent packages are available"
    //       ) : (
    //         "Assessment report not available"
    //       )}
    //     </MKTypography>
    //   );
  }
}

const GetHeadings = ({ receivedValue }: any) => {

  if (receivedValue === "License Compliance") {
    return (<> {" "}
      <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>

        License Compatibiltity
        <Icon key={`Icon1`} title="Licensing information of the OSS" sx={{ fontSize: 'calc(0.3rem + 0.3vw) !important' }}>
          info
        </Icon>
      </MKTypography>
    </>);
  } else if (receivedValue === "Dependencies") {
    return (<> {" "}
      <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>

        Dependencies
        <Icon key={`Icon2`} title="Software Bill Of Material" sx={{ fontSize: 'calc(0.3rem + 0.3vw) !important' }}>
          info
        </Icon>
      </MKTypography>
    </>);

  } else if (receivedValue === "ScoreCard") {
    return (<> {" "}
      <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>

        OpenSSF Scorecard (0-10)
        <Icon key={`Icon3`} title="Overall Security Score of the project" sx={{ fontSize: 'calc(0.3rem + 0.3vw) !important' }}>
          info
        </Icon>
      </MKTypography>
    </>);

  } else if (receivedValue === "Criticality Score") {
    return (<> {" "}
      <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
        OpenSSF Criticality Score (0-1)
        <Icon key={`Icon4`} title="Score to tell how critical the OSS project" sx={{ fontSize: 'calc(0.3rem + 0.3vw) !important' }}>
          info
        </Icon>
      </MKTypography>
    </>);

  }
  else if (receivedValue === "Vulnerabilities") {
    return (<> {" "}
      <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
        Static Analysis Summary
        <Icon key={`Icon5`} title="Provides Static Code Analysis (SAST) report by CodeQL / SonarQube" sx={{ fontSize: 'calc(0.3rem + 0.3vw) !important' }}>
          info
        </Icon>
      </MKTypography>
    </>);
  }
  else {
    return (receivedValue);
  }
}

function printText(item) {
  if (item == "Vulnerabilities" || item == "Dependencies") {
    return (

      item + " found"
    );
  }
  else if (item == "License Compliance") {
    return ("unique licenses found")
  }
  else if (item == "ScoreCard" || item == "Criticality Score") {
    return ("on OpenSSF " + item)
  }
  else {
    return (

      "on " + item
    )
  }
}


const ReportModal = ({ version, name, item, itemData, masterData }: any) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let data
  data = GetAssessmentData(version, name, item, itemData, masterData)
  let color: any
  if (data && data.length == 3) {
    color = data[2]
  }
  else {
    color = ""
  }
  return (
    <>
      <Button variant="contained" onClick={handleOpen} sx={{
        height: "100px",
        width: "200px",
        ':hover': {
          boxShadow: "0 15px 20px rgba(0,0,0,0.1)", // Adjust the shadow level (0 to 24)
          transition: "box-shadow 0.5s ease-in-out",
          border: "1px solid #5c4f4f",
          color: "blueviolet"
        }
      }} style={{
        backgroundColor: "white",
        display: "block",
        textAlign: "left"
      }}>
        {color ? <MKTypography style={{
          fontSize: "30px",
          color: color,
          fontWeight: "bold"
        }}>
          {data ? data[0] : 0}
        </MKTypography> :
          <MKTypography style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
          }}>
            {data ? data[0] : 0}
          </MKTypography>}
        <MKTypography
          textTransform="capitalize"
          style={{
            fontSize: "12px"
          }}>
          {printText(item)}
        </MKTypography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "500px",
            boxShadow: "24",
            padding: "4",
            backgroundColor: "white"
          }}>

            {data ? data[1] : "Not found"}
          </Box>
        </Fade>

      </Modal>
    </>
  );
};

function AssessmentReport({ title, name, version, itemData, masterData, ...other }: any) {
  const report: string[] = [
    "Vulnerabilities",
    "Dependencies",
    "License Compliance",
    "TAVOSS Score",
    "ScoreCard",
    "Criticality Score",
  ];

  return (

    <>
      {report.map((item, index) => (
        <Grid item xs={6} md={2}>
          {/* <GetAssessmentData
                            Key={`Grid9${index}`}
                            version={version}
                            name={name}
                            report={item}
                            itemData={itemData}
                            masterData={masterData}
                          /> */}
          <ReportModal key={item} version={version} name={name} item={item} itemData={itemData} masterData={masterData} />
        </Grid>
      ))}
      {/* Getting the assessment report */}
      {/* {report.map((value, index) => { */}
      {/* // return ( */}
      {/* //   <> */}

      {/* <Grid item
        //       style={{ height: "250px" }}
        //       key={`Grid1${index}`}
        //       xs={12} sm={6} md={6} lg={3} xl={2.4}>
        //       <MKBox p={2}
        //         key={`Mbox1${index}`}
        //         borderRadius="lg">
        //         <Grid
        //           key={`Grid2${index}`}
        //           justifyContent="center"
        //           style={{
        //             backgroundColor: "#f3f6f4",
        //             borderRadius: "5px",
        //             height: "220px",
        //             fontSize: "15px",
        //             paddingTop: "5px"
        //           }} >
        //           <Grid container
        //             key={`Grid3${index}`}
        //             justifyContent="center"
        //             alignItems="center" >
        //             <Grid item
        //               key={`Grid4${index}`}
        //               justifyContent="center">
        //               <Typography variant="h6"
        //                 key={`Typo1${index}`}
        //                 color="black"
        //                 style={{ fontSize: "calc(0.3rem + 0.5vw)" }}>
        //                 <GetHeadings Key={`Grid10${index}`} receivedValue={value} />
        //               </Typography>
        //             </Grid>
        //           </Grid>
        //           <Grid key={`Grid5${index}`}>
        //             <Grid key={`Grid6${index}`}>
        //               <Grid key={`Grid7${index}`}
        //                 container
        //                 justifyContent="center"
        //                 alignItems="center"
        //                 style={{ display: "block" }}
        //               >
        //                 <Grid key={`Grid8${index}`}>
        //                   <GetAssessmentData
        //                     Key={`Grid9${index}`}
        //                     version={version}
        //                     name={name}
        //                     report={value}
        //                     itemData={itemData}
        //                     masterData={masterData}
        //                   />
        //                 </Grid>
        //               </Grid>
        //             </Grid>
        //           </Grid>
        //         </Grid>
        //       </MKBox>
        //     </Grid> */}
      {/* //   </> */}
      {/* // ); */}
      {/* }) */}
      {/* } */}
    </>
  );
};

export default AssessmentReport;
