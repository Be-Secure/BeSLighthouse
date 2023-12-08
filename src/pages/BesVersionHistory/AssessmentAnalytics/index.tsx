import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import SeverityLevels from "../../../examples/Charts/PieChart/SeverityLevels";
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
import CodeQL from "../../BesAssessmentReport/CodeQL";
import { projectOfInterestData } from "../../../utils/poi_data";
import internal from "stream";

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus({});
    }
  } catch (error) {
    setLinkStatus({});
  }
};

export const getLinkData = async (link: any, setRiskData: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      setRiskData(data);
    } catch (err) {
      setRiskData({});
    }
  } catch (error) {
    setRiskData({});
  }
};

export const countSeverity = async (vulnerabilityData: any, setSeverity: any) => {
  if (Object.keys(vulnerabilityData).length !== 0) {
  let supportedSeverityLevels: any = {
    low: true,
    medium: true,
    high: true,
    critical: true
  };
  //console.log("Vulnerability="+JSON.stringify(vulnerabilityData));
  let severityCounts: any = {};
  const severityForChart: any = [];
  for (let i = 0; i < vulnerabilityData.length; i++) {
    severityCounts["low"] = 0;
    severityCounts["high"] = 0;
    severityCounts["medium"] = 0;
    severityCounts["critical"] = 0;
    
    if (vulnerabilityData[i]["rule"]["security_severity_level"] === "low") {
      severityCounts["low"]++;
    }else if(vulnerabilityData[i]["rule"]["security_severity_level"] === "medium"){
      severityCounts["medium"]++;
    }else if(vulnerabilityData[i]["rule"]["security_severity_level"] === "high"){
      severityCounts["high"]++;
    }else if(vulnerabilityData[i]["rule"]["security_severity_level"] === "critical"){
      severityCounts["critical"]++;
    }
  }
  for (let sevStack of Object.keys(severityCounts)) {
    severityForChart.push({ label: sevStack, value: severityCounts[sevStack] });
  }
  setSeverity(severityForChart);
  }
}
const FetchCritical = ({ version, name, report, versionDetails, masterData, riskData }: any) => {
  //console.log("versionDetails="+JSON.stringify(versionDetails)+"\n");
  //console.log("masterData="+JSON.stringify(masterData));
  //console.log("riskData="+JSON.stringify(riskData));

  //let cveData:any = versionDetails.cve_details;
  let tmp:any = [];
  //let data:any;
  //console.log("cveData="+JSON.stringify(riskData));
  for(var i=0; i<= riskData.length; i++){
      tmp.push(riskData[i]);
  }
  //console.log("tmp="+JSON.stringify(tmp[0].rule));
  return(
    <>
    {
       tmp.map(function(vul:any, index:number){
        
        if(vul !== undefined && (vul.rule.security_severity_level === "critical" ||
           vul.rule.security_severity_level === "high")){
            console.log("tmp="+JSON.stringify(vul.rule));
            let name: string  = vul.rule.name;
            let url: string  = vul.html_url;
            let des: string  = vul.description;
          return ( <><Typography variant="body2" color="inherit" style={{fontSize:"1rem",}}>
                       {name} : <Link to={url} style={{fontSize:"0.8rem",}}>{name}</Link>
                </Typography>
                </>
          )
        }else{
          return(<></>)
        }
       })
    }
    </>
  )
}

const FetchData = ({version, name, report, versionDetails, masterData}: any) => {
  const [riskData, setRiskData]: any = React.useState({});
  const [severityData, setSeverity] = React.useState([]);
  React.useEffect(() => {
    if (version.trim()) {
      let link: string = `${assessment_datastore}/${name}/${version}/${assessment_path["Codeql"]}/${name}-${version}-${assessment_report["Codeql"]}-report.json`;
      getLinkData(link, setRiskData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  
  React.useEffect(() => {
    
    countSeverity(riskData, setSeverity);
  }, [riskData]);
  
  const theme = useTheme();
  //console.log("Severity Levels="+JSON.stringify(severityData));

  if(report === "Risk Posture"){
    //const [data, setData] = React.useState([]);
    
    return (
      <>
            <Grid item xs={6} md={6} lg={6}>
              <MKBox mb={6}>
                <SeverityLevels
                  chartColors={[
                    "#FFBB33",
                    "#FF8633",
                    '#FF6133',
                    "#DC1003",
                  ]}
                  chartData={severityData}
                />
              </MKBox>
            </Grid>
      </>
    );
   }else if(report === "Critical Issues"){
    return (
    <>
    <Grid item xs={12} md={12} lg={12}>
      <MKBox mb={6}>
        <FetchCritical
          version={version}
          name={name}
          report={report}
          versionDetails={versionDetails}
          masterData= {masterData}
          riskData={riskData}
        />
      </MKBox>
    </Grid>
    </> 
    );        
   }else{
    return (
      <>
      </>
    );
   }
}



function AssessmentAnalytics({ title, name, version, versionDetails, masterData, ...other }: any) {
  const report: string[] = [
    "Risk Posture",
    "Critical Issues",
    "Vulnerability History"
  ];
  return (
    
    <Card sx={{ height: "100%" }} >
      <Grid container p={2} justifyContent="space-between" >
        
        {report.map((value, index) => {
            return (
              <>
              <Grid alignItems="center" p={1} xs={4} justifyContent="center">
              <MKBox borderRadius="lg" >
              <Grid p={1} style={{backgroundColor: "#f3f6f4", borderRadius: 10, height: "370px"}} justifyContent="center" >
                    <Grid container alignItems="center" justifyContent="center">
                      <Grid item justifyContent="center">
                        <Typography variant="h6" color="black">
                          {value}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid>
                            <FetchData version={version} name={name} report={value} versionDetails={versionDetails} masterData={masterData}/>
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

export default AssessmentAnalytics;
