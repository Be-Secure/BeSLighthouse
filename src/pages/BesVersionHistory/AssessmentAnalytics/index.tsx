import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SeverityLevels from "../../../examples/Charts/PieChart/SeverityLevels";
import VulHistory from "../../../examples/Charts/BarChart/VulHistory";
import { fetchJsonReport } from "../../../utils/fatch_json_report";
import { Link } from "react-router-dom";
import { assessment_datastore } from "../../../dataStore";
import MKBox from "../../../components/MKBox";
import {
  assessment_path,
  assessment_report
} from "../../../utils/assessmentReport";
import MKTypography from "../../../components/MKTypography";
import { StyledChartWrapper } from "../../../examples/Charts/PieChart/StyledChartWrapper";
import { AlignHorizontalCenter } from "@mui/icons-material";

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
  if (Object.keys(vulnerabilityData).length !== 0) 
  {
    let supportedSeverityLevels: string[] = [
      "low",
      "medium",
      "high",
      "critical"
    ];
    
    let severityCounts: any = {};
    const severityForChart: any = [];

    for(let i=0; i<supportedSeverityLevels.length; i++){
      severityCounts[supportedSeverityLevels[i]]=0;
    }

    for (let i = 0; i < vulnerabilityData.length; i++) {   
      for (let j=0; j<supportedSeverityLevels.length; j++) {
        if (vulnerabilityData[i]["rule"]["security_severity_level"] === supportedSeverityLevels[j])
          severityCounts[supportedSeverityLevels[j]]++;
      }
    }

    for (let sevStack of Object.keys(severityCounts)) {
      severityForChart.push({ label: sevStack, value: severityCounts[sevStack] });
    }
    setSeverity(severityForChart);
  }
}

const FetchCritical = ({ riskData }: any) => {
  let tmp:any = [];
  let flag=0;
  let res:any = {};
  for(var i=0; i<= riskData.length; i++){
      tmp.push(riskData[i]);
  }
  if(tmp.length !== 0){
    res = tmp.map(function(vul:any, index:number){     
          if(vul !== undefined && (vul.rule.security_severity_level === "critical"))
          {
              flag=1;
              let name: string  = vul.rule.name;
              let url: string  = vul.html_url;
              let des: string  = vul.description;
              return ( 
                <>
                  <MKTypography variant="body2" color="inherit" style={{fontSize:"1rem"}}>
                                {name} : <Link to={url} style={{fontSize:"0.8rem",}}>{name}</Link>
                  </MKTypography>    
                </>
              )
          }else{
            return(<></>)
          }
      });
    if(flag !== 0){      
       return(<>{res}</>);
    }else{
      return(<>
              <MKTypography variant="body2" color="inherit" style={{fontSize:"1rem"}}>
                No Critical Issues Found
              </MKTypography>
            </>);
    }
  }else{
    return(<>
      <MKTypography variant="body2" color="inherit" style={{fontSize:"1rem"}}>
        No Data Available
      </MKTypography>
    </>);
  }
}

const FetchVulHistory = (versionDetails: any, setVulHistory: any) => 
{  
  const vulHsitoryForChart: any = [];
  if(versionDetails[0].cve_details !== "Not Available"){
    for(let j=0; j< versionDetails[0].cve_details.length; j++){
          if(versionDetails[0].cve_details[j].Year !== "Total" && versionDetails[0].cve_details[j].Year !== null)
           vulHsitoryForChart.push({label: versionDetails[0].cve_details[j].Year, value: versionDetails[0].cve_details[j].No_of_Vulnerabilities} );
    }
    if(vulHsitoryForChart.length !== 0)
      setVulHistory(vulHsitoryForChart);
    else
      return(<></>)
    return(vulHsitoryForChart)
  }else{
    return(<></>)
  }
}

const FetchData = ({version, name, report, versionDetails, masterData}: any) => {
  const [riskData, setRiskData]: any = React.useState({});
  const [severityData, setSeverity] = React.useState([]);
  const [vulHistoryData, setVulHistory] = React.useState([]);
  React.useEffect(() => {
    if (version.trim()) {
      let link: string = `${assessment_datastore}/${name}/${version}/${assessment_path["Codeql"]}/${name}-${version}-${assessment_report["Codeql"]}-report.json`;
      getLinkData(link, setRiskData);
    }
  }, [version]);
  React.useEffect(() => {
    countSeverity(riskData, setSeverity);
  }, [riskData]);
  
  React.useEffect(() => {
    FetchVulHistory(versionDetails, setVulHistory);
  }, [versionDetails]);
  
  const theme = useTheme();  
  if(report === "Risk Posture"){
    if(severityData.length !== 0){
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
    }else{
      return(
      <Grid item xs={6} md={6} lg={6}>
          <MKBox mb={6}>
              <Card  style={{height: "70%", width: "200%"}}>
                  <MKBox>
                    <MKBox pt={1} pb={1} px={1} > 
                    <StyledChartWrapper dir="ltr" >
                       <MKTypography variant="body2" color="inherit" style={{fontSize:"1rem"}}>
                           No Data Available
                        </MKTypography>
                    </StyledChartWrapper>  
                    </MKBox>
                  </MKBox>
              </Card>
          </MKBox>
      </Grid>
      );
    }
   }else if(report === "Critical Issues"){
    return (
    <>
    <Grid item xs={12} md={12} lg={12} style={{height: "100%"}}>
      <MKBox mb={6} style={{height: "100%"}}>
        <Card  style={{height: "100%", width: "100%"}} sx={{ overflowY: "scroll"}}>
          <MKBox style={{height: "100%"}}>
              <MKBox pt={1} pb={1} px={1} style={{height: "100%" }}> 
                 <FetchCritical
                    riskData={riskData}
                  />
              </MKBox>
          </MKBox>
        </Card>
      </MKBox>
    </Grid>
    </> 
    );
   }else if(report === "Vulnerability History"){
    return (
      <>
          <Grid item xs={12} md={12} lg={12}>
            <MKBox mb={6}>
              <VulHistory
                  vuldata={vulHistoryData}
              />  
            </MKBox>
          </Grid>
      </>
    );
   }else{
    return (<></>);
   }
}

const GetHeadings = ({ receivedValue }: any) => {
  //const [fieldInfo, setfieldInfo]: any = React.useState({});
    if(receivedValue === "Risk Posture"){
       return(<> Risk Posture
                  <Icon title="Percentage of low, high, critical issues found" sx={{fontSize: '0.5rem !important'}}>
                    info
                  </Icon>
              </>);
    }else if(receivedValue === "Critical Issues"){
      return(<> Critical SAST
                <Icon title="Software Bill Of Material" sx={{fontSize: '0.5rem !important'}}>
                  info
                </Icon>
              </>);
      
    }else if(receivedValue === "Vulnerability History"){
      return(<> CVE History
                <Icon title="Overall Security Score of the project" sx={{fontSize: '0.5rem !important'}}>
                  info
                </Icon>
              </>);
     
    }else{
      return(receivedValue);
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
                        <GetHeadings receivedValue={value}>
                          
                        </GetHeadings>
                      </Grid>
                    </Grid>
                    <Grid style={{height: "92%"}}>
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
