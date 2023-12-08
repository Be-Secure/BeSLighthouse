import * as React from "react";

import Card from "@mui/material/Card";

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

const dividerDiv = (index: number) => {
  if (index !== 0) return <Divider sx={{ my: 1.5 }} />;
};

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      //console.log(data);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus({});
    }
  } catch (error) {
    setLinkStatus({});
  }
};

const CheckLink = ({ version, name, report }: any) => {
  const [linkStatus, setLinkStatus]: any = React.useState({});
  let reportNameMap = "";
if(report === "Criticality Score"){
  reportNameMap = "Criticality Score";
}else if(report === "Vulnerabilities"){
  reportNameMap = "Codeql";
}else if(report === "License Compliance"){
  reportNameMap = "Fossology";
}else if(report === "Dependencies"){
  reportNameMap = "SBOM";
}else if(report === "ScoreCard"){
  reportNameMap = "Scorecard";
}

  React.useEffect(() => {
    if (version.trim()) {
      let link: string = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;
      verifyLink(link, setLinkStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  let linkStatusLength: number = Object.values(linkStatus).length;
  //console.log("reportType="+report+"  LinkStatusLength="+linkStatusLength+"\n")
  //console.log("criticality Score="+linkStatus.criticality_score + "\n")
  if (report === "Criticality Score" && linkStatusLength !== 0){
    //console.log("Criticality Score="+JSON.stringify(linkStatus));
    return (
      
      <Typography variant="subtitle1" color="inherit">
        {linkStatus.criticality_score}
      </Typography>
    );
  }
  const pathName: string = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;
  const myObject = { pathname: pathName, state: linkStatus } as {
    pathname: string;
  };
  
  if (report === "ScoreCard" && linkStatusLength !== 0) {
    //console.log("Scorecard="+JSON.stringify(linkStatus));
    return <Link to={myObject}>{linkStatus.score}</Link>;
  }
  if (report === "Vulnerabilities" && linkStatusLength !== 0) {
    //console.log("Vulnerability Object="+JSON.stringify(linkStatus));
    //console.log("Vulnerabilities count="+linkStatus.length);
    return <Link to={myObject}>{linkStatus.length}</Link>;
  }
  if (report === "License Compliance" && linkStatusLength !== 0) {
    //console.log("License="+JSON.stringify(linkStatus));
    return <Link to={myObject}>{linkStatus.length}</Link>;
  }
  if (report === "Dependencies" && linkStatusLength !== 0) {
    //console.log("Dependencies="+JSON.stringify(linkStatus));
    return <Link to={myObject}>{linkStatus.packages.length}</Link>;
  }
  /*if (linkStatusLength !== 0) {
    return <Link to={myObject}>{linkStatus.criticality_score}</Link>;
  }*/
  
  return (
    <Typography variant="subtitle1" color="inherit">
      --
    </Typography>
  );
};

function AssessmentReport({ title, name, version, ...other }: any) {
  const report: string[] = [
    "ScoreCard",
    "Criticality Score",
    "Vulnerabilities",
    "License Compliance",
    "Dependencies"
  ];
  return (
    
    <Card sx={{ height: "100%" }} >
      <Grid container p={2} justifyContent="center" >
        
        {report.map((value, index) => {
            return (
              <>
              <Grid item xs={2.4}>
              <MKBox p={1.5} borderRadius="lg">
              
              <Grid p={1} justifyContent="center" style={{backgroundColor: "#f3f6f4", borderRadius: 10}} >
                  
                    <Grid container justifyContent="center" alignItems="center" >
                      <Grid item justifyContent="center">
                        <Typography variant="h6" color="black">
                          {value}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid item>
                        <Grid container justifyContent="center" alignItems="center">
                          <Grid item>
                            <CheckLink version={version} name={name} report={value} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  
                </Grid>
              
              </MKBox>
              </Grid>
              </>
            );
          })}
        
        </Grid>
    </Card>
  );
}

export default AssessmentReport;
