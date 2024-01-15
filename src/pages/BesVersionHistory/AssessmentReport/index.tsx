import * as React from "react";


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

      return false;
    }
  } catch (error) {

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

const FetchSAST = ({ cqData, sqData }: any) => {

  let critical: number = 0;
  let high: number = 0;
  let medium: number = 0;
  let low: number = 0;
  let sqissueslen: number = 0;

  if (JSON.stringify(Object.values(sqData).length) !== "0") {
    sqissueslen = sqData.length;
  }

  if (JSON.stringify(Object.values(cqData).length) !== "0" &&
    sqissueslen === 0) {

    cqData.forEach((vul) => {
      if (vul.rule.security_severity_level === "critical") {
        critical++;
      } else if (vul.rule.security_severity_level === "high") {
        high++;
      } else if (vul.rule.security_severity_level === "medium") {
        medium++;
      } else if (vul.rule.security_severity_level === "high") {
        low++;
      }
    });

    return (<>
      <Grid key={`GRIDSASTCQ1`}
        style={{
          minWidth: "calc(10rem + 5vw)",
          marginTop: "1.1rem",
          // marginLeft: "1.5rem",
          fontSize: "15px",
          justifyContent: "left"
        }}>
        <Grid container
          key={`GRIDSASTCQ2`}>
          <Grid item
            xs={6}
            key={`GRIDSASTCQ3`}>
            <MKTypography variant="body1"
              key={`MKTYPOSASTCQ1`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                // paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDCQ1">Critical : </b>{critical}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDSASTCQ4`}
            xs={6}>
            <MKTypography variant="body1"
              key={`MKTypoSASTCQ2`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                // paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDCQ2">High : </b>{high}
            </MKTypography>
          </Grid>
        </Grid>
        <Grid key={`GRIDSASTCQ5`}
          container>
          <Grid item
            key={`GRIDSASTCQ6`}
            xs={6}>
            <MKTypography variant="body1"
              key={`MKTypoSASTCQ3`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDCQ3">Medium : </b>{medium}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDSASTCQ7`}
            xs={6}>
            <MKTypography key={`MKTypoSASTCQ4`}
              variant="body1"
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDCQ4"> Low : </b> {low}
            </MKTypography>
          </Grid>
        </Grid>
      </Grid>
    </>
    );
  } else if (JSON.stringify(Object.values(cqData).length) === "0" &&
    sqissueslen !== 0) {
    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;
    let sqissues: any = "0";
    sqissues = Object.values(sqData)[5]

    sqData.forEach((vul) => {
      if (vul.severity === "BLOCKER") {
        sqblocker++;
      } else if (vul.severity === "CRITICAL") {
        sqcritical++;
      } else if (vul.severity === "MAJOR") {
        sqmajor++;
      } else if (vul.severity === "MINOR") {
        sqminor++;
      }
    });

    return (<>
      <Grid key={`GRIDSASTSQ1`}
        style={{
          minWidth: "calc(10rem + 5vw)",
          marginTop: "1.1rem",
          marginLeft: "1.5rem"
        }}>
        <Grid key={`GRIDSASTSQ2`}
          container>
          <Grid item
            key={`GRIDSASTSQ3`}
            xs={6}>
            <MKTypography variant="body1"
              color="inherit"
              key={`MKTypoSASTSQ1`}
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDSQ1"> Critical : </b> {sqblocker}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDSASTSQ4`}
            xs={6}>
            <MKTypography variant="body1"
              key={`MKTypoSASTSQ2`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDSQ2"> High : </b> {sqcritical}
            </MKTypography>
          </Grid>
        </Grid>
        <Grid key={`GRIDSASTSQ5}`}
          container>
          <Grid item
            key={`GRIDSASTSQ6`}
            xs={6}>
            <MKTypography variant="body1"
              key={`MKTypoSASTSQ3`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDSQ3">Medium : </b> {sqmajor}
            </MKTypography>
          </Grid>
          <Grid item
            key={`GRIDSASTSQ7`}
            xs={6}>
            <MKTypography variant="body1"
              key={`MKTypoSASTSQ4`}
              color="inherit"
              style={{
                fontSize: "calc(0.6rem + 0.5vw)",
                paddingLeft: "calc(0.1rem + 0.3vw)"
              }}>
              <b key="BOLDSQ4">Low : </b>{sqminor}
            </MKTypography>
          </Grid>
        </Grid>
      </Grid>
    </>
    );
  } else if (JSON.stringify(Object.values(cqData).length) !== "0" &&
    sqissueslen !== 0) {
    let cqcritical: number = 0;
    let cqhigh: number = 0;
    let cqmedium: number = 0;
    let cqlow: number = 0;

    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;

    cqData.forEach((vul) => {
      if (vul.rule.security_severity_level === "critical") {
        cqcritical++;
      } else if (vul.rule.security_severity_level === "high") {
        cqhigh++;
      } else if (vul.rule.security_severity_level === "medium") {
        cqmedium++;
      } else if (vul.rule.security_severity_level === "low") {
        cqlow++;
      }
    });

    sqData.forEach((vul) => {
      if (vul.severity === "BLOCKER") {
        sqblocker++;
      } else if (vul.severity === "CRITICAL") {
        sqcritical++;
      } else if (vul.severity === "MAJOR") {
        sqmajor++;
      } else if (vul.severity === "MINOR") {
        sqminor++;
      }
    });

    return (<>
      <Grid key={`GRIDSASTCQSQ1`}
        style={{ minWidth: "calc(10rem + 5vw)" }}>
        <Grid key={`GRIDSASTCQSQ2`}
          container>
          <Grid item
            key={`GRIDSASTCQSQ3`}
            xs={6}>
            <Grid key={`GRIDSASTCQSQ4`}>
              <Grid key={`GRIDSASTCQSQ5`}
                container >
                <Grid item
                  key={`GRIDSASTCQSQ6`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ1`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ1">Critical </b>: {cqcritical}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ7`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ2`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ2">High </b>: {cqhigh}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ8`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ3`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ3">Medium </b>: {cqmedium}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ9`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ4`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ4">Low </b>: {cqlow}
                  </MKTypography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item
            key={`GRIDSASTCQSQ10`}
            xs={6}>
            <Grid key={`GRIDSASTCQSQ11`}>
              <Grid key={`GRIDSASTCQSQ12`}
                container>
                <Grid item
                  key={`GRIDSASTCQSQ13`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ5`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ5">Critical </b> : {sqblocker}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ14`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASRCQSQ6`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ6">High</b> : {sqcritical}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ15`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ7`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ7">Medium</b> : {sqmajor}
                  </MKTypography>
                </Grid>
                <Grid item
                  key={`GRIDSASTCQSQ16`}
                  xs={12}
                  style={{
                    justifyContent: "center",
                    display: "flex"
                  }}>
                  <MKTypography variant="body1"
                    key={`MKTypoSASTCQSQ8`}
                    color="inherit"
                    style={{ fontSize: "calc(0.4rem + 0.3vw)" }}>
                    <b key="BOLDCQSQ8">Low</b>: {sqminor}
                  </MKTypography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
    );
  } else {
    return (
      <>
        <Typography variant="body1"
          key={`MKTypoLBlankCQSQ1`}
          color="inherit"
          style={{
            fontSize: "calc(0.3rem + 0.5vw)",
            display: "flex",
            justifyContent: "center"
          }}>
          No SAST issues data Available
        </Typography>
      </>
    );
  }
};

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
  //console.log("item data=" + JSON.stringify(itemData));
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

const FetchSBOM = ({ data, masterData }: any) => {

  let tracked: string[] = [];
  let dis: any = {};

  data.forEach((dp) => {
    masterData.forEach((tp) => {
      let duplicate: boolean = false;
      if (dp.name === tp.name) {
        tracked.forEach((tmptracked) => {
          if (tmptracked === dp.name)
            duplicate = true;
        });

        if (!duplicate)
          tracked.push(dp.name);
      }
    });
  });

  dis = tracked.map(function (td: string, index: number) {
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
          {td}
        </MKTypography>
      </Grid>
    </>
    );
  });

  return (<>
    <Grid key={`GRIDSBOMMAIN`}
      style={{ minWidth: "200px" }}>
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
      <Grid key={`GRIDSBOMSUBMAIN`}
        container>
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

  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;
      fetchJsonData(link, setJsonData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-sonarqube-report.json`;
      fetchvulJsonData(link, "sonarqube", setCQData, setSQData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version.trim()) {
      let link: string = "";
      link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-codeql-report.json`;
      fetchvulJsonData(link, "codeql", setCQData, setSQData);
    }
  }, [version]);

  let jsonDataLength: number = Object.values(jsonData).length;
  if (report === "Criticality Score" && jsonDataLength !== 0) {
    return (
      <>
      {/* Criticality score value */}
        <MKTypography variant="h6"
          key={`TypoCriticalityScore`}
          color="inherit"
          style={{
            fontSize: "15px",
            justifyContent: "center",
            display: "flex"
          }}>
          {jsonData.criticality_score}
          {/* Criticality score data */}
        </MKTypography>
        <Grid key={`GridCriticalutyScore`}
          style={{
            height: "150px",
            minWidth: "90%",
            borderRadius: "3px",
            fontSize: "20px",
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
    {/* Display scorecard score */}
      <Typography variant="h6"
        key={`TypoSC1`}
        color="inherit"
        style={{ fontSize: "15px" }}>
        <Link to={myObject}
          key={`LinkSC1`}
          style={{
            fontSize: "calc(0.6rem + 0.5vw)",
            display: "flex",
            justifyContent: "center"
          }}>
          {jsonData.score}
        </Link>
      </Typography>
      {/* Scorecard data */}
      <Grid key={`GridSC1`}
        style={{
          height: "150px",
          minWidth: "90%",
          borderRadius: "3px",
          fontSize: "15px"
        }}
        sx={{ overflowY: "scroll" }}>
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
    return (<>
    {/* Codeql score */}
      <Typography variant="h6"
        key="SASCQTMAINHEADING"
        color="inherit"
        style={{
          fontSize: "13px",
          display: "flex",
          justifyContent: "center",
        }}>
          {/* <a href=""></a> */}
        
        CodeQL: {codeQlData.length}
      </Typography>
      <MKBox key="MKBOXSASTCQMAINBODY">
        <FetchSAST
          cqData={codeQlData}
          sqData={sonarqubeData}
        />
      </MKBox>
    </>
    );
  } else if (report === "Vulnerabilities" && (JSON.stringify(Object.values(sonarqubeData).length) !== "0" &&
    JSON.stringify(Object.values(codeQlData).length) === "0")) {
    let issues: any = Object.values(sonarqubeData)[5];
    return (<>
      <Typography variant="h6"
        key="SASSQTMAINHEADING"
        color="inherit"
        style={{
          fontSize: "13px",
          display: "flex",
          justifyContent: "center"
        }}>
        Sonarqube: {sonarqubeData.total}
      </Typography>
      <MKBox key="MKBOXSASTSQMAINBODY">
        <FetchSAST
          cqData={codeQlData}
          sqData={issues}
        />
      </MKBox>
    </>
    );
  } else if (report === "Vulnerabilities" && (JSON.stringify(Object.values(codeQlData).length) !== "0" &&
    JSON.stringify(Object.values(sonarqubeData).length) !== "0")) {
    const codeqldetails: any = Object.values(codeQlData);
    const codeqllength: number = Object.values(codeQlData).length;
    let sqissues: any = Object.values(sonarqubeData)[5];

    return (
      <>
        <Grid item
          key="GRIDSASTCQSQMAIN1"
          container
          xs={12}>
          <Grid item
            key="GRIDSASTCQSQMAIN2"
            xs={6}>
            <Typography variant="h6"
              key="TYPOSASTCQSQMAIN1"
              color="inherit"
              style={{
                fontSize: "13px",
                justifyContent: "center",
                display: "flex",
                paddingBottom: "8px",
                paddingTop: "4px"
              }}>

              CodeQL: {codeqllength}
              
            </Typography>
          </Grid>
          <Grid item
            key="GRIDSASTCQSQMAIN3"
            xs={6}>
            <Typography variant="h6"
              key="TYPOSASTCQSQMAIN2"
              color="inherit"
              style={{
                fontSize: "13px",
                justifyContent: "center",
                display: "flex",
                paddingBottom: "8px",
                paddingTop: "4px"
              }}>

             Sonarqube: {sonarqubeData.total}

            </Typography>
          </Grid>
        </Grid>
        <Grid key="GRIDSASTCQSQMAIN4"
          container>
          <Grid>
            <MKBox key="MKBOXSASTCQSQMAIN1">
              <FetchSAST
                cqData={codeqldetails}
                sqData={sqissues}
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
    return (
      <>
        <MKTypography variant="h6"
          key="TYPOLICMAIN1"
          color="inherit"
          style={{ fontSize: "calc(0.6rem + 0.5vw)" }}>
          <Link to={myObject}
            key="LINKLICMAIN1"
            style={{
              fontSize: "calc(0.6rem + 0.5vw)",
              display: "flex",
              justifyContent: "center",
            }}>
            {uniqueLicenses.length}
          </Link>
        </MKTypography>
        <Grid key="GRIDLICMAIN1"
          style={{
            height: "150px",
            borderRadius: "3px",
            overflowY: "scroll"
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
        key="TYPOSBOMMAIN1"
        color="inherit"
        style={{
          fontSize: "calc(0.6rem + 0.5vw)"
        }}>
        <Link to={myObject}
          key="LINKSBOMMAIN1"
          style={{
            fontSize: "calc(0.6rem + 0.5vw)",
            display: "flex",
            justifyContent: "center"
          }}>
          {jsonData.packages.length}
        </Link>
      </Typography>
      <Grid key="GRIDSBOMMAIN1"
        style={{
          height: "100px",
          borderRadius: "3px"
        }}
        sx={{ overflowY: "scroll" }}>
        <MKBox key="MKBOXSBOMMAIN1">
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
    <MKTypography variant="h6"
      key="TYPOSBOMMAINBLANK1"
      color="inherit"
      style={{
        fontSize: "12px", display: "flex",
        justifyContent: "center", alignItems: "center", position: "relative", top: "67px"
      }}>
      Not Available
    </MKTypography>
  );
};

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
function AssessmentReport({ title, name, version, itemData, masterData, ...other }: any) {
  const report: string[] = [
    "ScoreCard",
    "Criticality Score",
    "Vulnerabilities",
    "License Compliance",
    "Dependencies"
  ];

  return (<>
    <Grid container key="maingridAssmentreport"
      justifyContent="center"
      style={{ width: "100%", placeContent: "space-evenly"}}>
        {/* Getting the assessment report */}
      {report.map((value, index) => {
        return (
          <>
            <Grid item
              style={{ height: "250px" }}
              key={`Grid1${index}`}
              xs={12} sm={6} md={6} lg={3} xl={2.4}>
              <MKBox p={2}
                key={`Mbox1${index}`}
                borderRadius="lg">
                  {/* Making the grey box */}
                <Grid
                  key={`Grid2${index}`}
                  justifyContent="center"
                  style={{
                    backgroundColor: "#f3f6f4",
                    borderRadius: "5px",
                    height: "220px",
                    fontSize: "15px",
                    paddingTop: "5px"
                  }} >
                    {/* Assessment heading */}
                  <Grid container 
                    key={`Grid3${index}`}
                    justifyContent="center"
                    alignItems="center" >
                    <Grid item
                      key={`Grid4${index}`}
                      justifyContent="center">
                      <Typography variant="h6"
                        key={`Typo1${index}`}
                        color="black"
                        style={{ fontSize: "calc(0.3rem + 0.5vw)" }}>
                        <GetHeadings Key={`Grid10${index}`} receivedValue={value} />
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* Assessment data display */}
                  <Grid key={`Grid5${index}`}>
                    <Grid key={`Grid6${index}`}>
                      <Grid key={`Grid7${index}`}
                        container
                        justifyContent="center"
                        alignItems="center"
                        style={{ display: "block" }}
                      >
                        <Grid key={`Grid8${index}`}>
                          <GetAssessmentData
                            Key={`Grid9${index}`}
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