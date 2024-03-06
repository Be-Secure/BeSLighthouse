import * as React from "react";

import Icon from "@mui/material/Icon";

import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  Modal,
  Typography,
} from "@mui/material";

import { fetchJsonReport } from "../../../utils/fatch_json_report";

import { Link } from "react-router-dom";

import { assessment_datastore, version_details } from "../../../dataStore";

import MKBox from "../../../components/MKBox";

import MKTypography from "../../../components/MKTypography";

import {
  assessment_path,
  assessment_report,
} from "../../../utils/assessmentReport";

import FetchSAST from "./FetchSastReport";

import SastToggleButton from "./SastToggleButton";

import { useState } from "react";

import vulnerabilityIcon from "../../../assets/images/bug.png";

import dependencyIcon from "../../../assets/images/data-flow.png";

import licenseIcon from "../../../assets/images/certificate.png";

import scorecardIcon from "../../../assets/images/speedometer.png";

import tavossIcon from "../../../assets/images/verified.png";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";

import TableCell from "@mui/material/TableCell";

import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";

import { link } from "fs";
import BasicTable from "./BasicTable";

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

export const fetchvulJsonData = async (
  link: any,
  vulTool: any,
  setCQData: any,
  setSQData: any
) => {
  try {
    const response = await fetchJsonReport(link);

    try {
      let data = JSON.parse(response);

      if (vulTool === "codeql") {
        setCQData(data);
      } else if (vulTool === "sonarqube") {
        setSQData(data);
      } else return false;
    } catch (err) {
      if (vulTool === "codeql") {
        setCQData([]);
      } else if (vulTool === "sonarqube") {
        setSQData({});
      }

      return false;
    }
  } catch (error) {
    if (vulTool === "codeql") {
      setCQData([]);
    } else if (vulTool === "sonarqube") {
      setSQData({});
    }

    return false;
  }
};

const FetchLowScores = ({ data }: any) => {
  let tableData: any[] = [{}];
  let headings = ["Issue", "Reason"];

  let lowscorers: any = [];

  let displayData: any = {};

  data.checks.forEach((issue) => {
    if (issue.hasOwnProperty("score")) {
      if (issue.score <= 5) lowscorers.push(issue);
    } else {
      lowscorers.push(issue);
    }
  });

  lowscorers.map(function (iss: any, index: number) {
    const issue = iss.name;
    const reason = iss.reason;
    tableData.push({ Issue: issue, Reason: reason });
  });

  return (
    <>
      {/* <Grid key={`GRIDSC2`}

      style={{ minWidth: "200px" }}>

      {displayData}

    </Grid> */}
      <MKTypography
        style={{
          paddingTop: "10px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Summary Report
      </MKTypography>
      <BasicTable
        tableData={tableData}
        tableHeading={headings}
        tableStyle={{ textAlign: "center" }}
      />
    </>
  );
};

const FetchCS = ({ data }: any) => {
  let tableData: any[] = [];
  let headings = [
    "Age(in months)",
    "Contributors",
    "Organizations",
    "Closed Issues",
    "Last Updated",
  ];
  tableData = [
    {
      "Age(in months)": data.created_since,
      Contributors: data.contributor_count,
      Organizations: data.org_count,
      "Closed Issues": data.closed_issues_count,
      "Last Updated": data.updated_since,
    },
  ];
  return (
    <>
      <MKTypography
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          paddingTop: "20px",
        }}
      >
        Summary Report
      </MKTypography>

      <BasicTable
        tableData={tableData}
        tableHeading={headings}
        tableStyle={{ textAlign: "center" }}
      />

    </>
  );
};

const FetchLicense = ({ data, uniq_lic, itemData }: any) => {
  let headings = ["Project License", "Undetermined Files", "Licenses Found"];
  let tableData: any[] = [];

  let license_list: string[] = [];

  let non_lic_files: number = 0;

  let project_lcesnse: string = "Not Found";

  uniq_lic.forEach((ul) => {
    if (ul.length !== 0) license_list.push(ul);
  });

  data.forEach((ld) => {
    if (
      ld.LicenseConcluded &&
      (ld.LicenseConcluded === "NOASSERTION" ||
        ld.LicenseConcluded.length === 0)
    )
      non_lic_files++;
  });

  if (itemData.license && itemData.license.key) {
    project_lcesnse = itemData.license.key;
  }

  if (JSON.stringify(Object.values(itemData).length) !== "0") {
    tableData = [
      {
        "Project License": project_lcesnse,
        "Undetermined Files": non_lic_files,
        "Licenses Found": license_list.join("; "),
      },
    ];

    return (
      <>
        <MKTypography
          style={{
            paddingTop: "10px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Summary Report
        </MKTypography>
        <BasicTable
          tableData={tableData}
          tableHeading={headings}
          tableStyle={{ textAlign: "center" }}
        />
      </>
    );
  } else {
    return (
      <>
        <MKTypography
          variant="h6"
          key={`MKTypoLBlank`}
          color="inherit"
          style={{
            fontSize: "12px",
            display: "flex",

            justifyContent: "center",
          }}
        >
          Not Available
        </MKTypography>
      </>
    );
  }
};

async function checkForWeakness(dataObject, setWeakness: any) {
  let version: any
  let sonarqubeLink: any
  let codeqlLink: any
  let codeqlData: any[]
  let sonarqubeData: any
  let foundPackages: any = {}
  // debugger
  for (let dependency of dataObject) {
    try {
      let versionSummaryResponse: any = await fetchJsonReport(
        version_details + dependency.id + "-" + dependency.name + "-Versiondetails.json"
        );
        // debugger
        let versionData: any[] = JSON.parse(versionSummaryResponse)
        version = versionData[0].version
        sonarqubeLink = `${assessment_datastore}/${dependency.name}/${version}/sast/${dependency.name}-${version}-sonarqube-report.json`;
        
        codeqlLink = `${assessment_datastore}/${dependency.name}/${version}/sast/${dependency.name}-${version}-codeql-report.json`;
      } catch (error) {
        
        codeqlData = []
        sonarqubeData = {}
      }
      try {
        let responseCodeql: any = await fetchJsonReport(codeqlLink);
        codeqlData = JSON.parse(responseCodeql);
        
      } catch (error) {
        codeqlData = []
        
      }
      
      try {
        let responseSonarqube: any = await fetchJsonReport(sonarqubeLink);
        sonarqubeData = JSON.parse(responseSonarqube);
      } catch (error) {
        sonarqubeData = {}
        
      }
      
      if (codeqlData && codeqlData.length > 0) {
        
        foundPackages[dependency.name] = true
      } else if ( codeqlData.length === 0 && sonarqubeData && sonarqubeData.total != 0) {
        foundPackages[dependency.name] = true
        
      }
      
  }
  // debugger
  setWeakness(foundPackages)

}

const FetchSBOM = ({ data, masterData, name, weakness }: any) => {
  let tableData: any[] = [{}];
  const headings = ["ID", "Name", "BeS Tech Stack", "License", "Link", "Weakness"];

  let tracked: string[] = [];

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

        const dataObject = masterData?.find(function (item) {
          return item.name == tp.name;
        });

        const id = dataObject?.id;

        const name = dataObject?.name;

        const bes_technology_stack = dataObject?.bes_technology_stack;

        const license = dataObject?.license["spdx_id"];
        // const weakness = await checkForWeakness(id, name);
        if (!duplicate) tracked.push(dp.name);
        tableData.push({
          ID: id,
          Name: name,
          "BeS Tech Stack": bes_technology_stack,
          License: license,
          Link: (
            <a
              href={`/BeSLighthouse/Project-Of-Interest/bes_version_history/:${id}/:${name}`}
            >
              link
            </a>
          ),
          Weakness: (weakness[name] ? "Exist" : "Absent")
        });
      }
    });
  });

  return (
    <>
      {tracked.length !== 0 ? (
        <>
          <MKTypography
            style={{
              paddingTop: "10px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Dependencies Tracked under the Lab
          </MKTypography>
          <BasicTable
            tableData={tableData}
            tableHeading={headings}
            tableStyle={{ textAlign: "center" }}
          />
        </>
      ) : (
        <MKTypography
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
            height: "100%",
            paddingBottom: "15%",
            paddingTop: "15%",
            margin: "0px 35px 0px 35px",
          }}
        >
          <b key={`BOLDSBOM1`}>
            None of the dependencies detected are currently tracked in this lab
          </b>
        </MKTypography>
      )}
    </>
  );
};

function GetAssessmentData(version, name, report, itemData, masterData) {
  const [jsonData, setJsonData]: any = React.useState({});

  const [codeQlData, setCQData]: any = React.useState([]);

  const [sonarqubeData, setSQData]: any = React.useState({});
  const [weakness, setWeakness]: any = React.useState({});

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
      if (assessment_path[reportNameMap]) {
        link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMap]}/${name}-${version}-${assessment_report[reportNameMap]}-report.json`;

        fetchJsonData(link, setJsonData);
      }

    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";

      if (assessment_path[reportNameMapSonar]) {
        link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMapSonar]}/${name}-${version}-sonarqube-report.json`;

        fetchvulJsonData(link, "sonarqube", setCQData, setSQData);
      }

    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      if (assessment_path[reportNameMapCodeql]) {

        link = `${assessment_datastore}/${name}/${version}/${assessment_path[reportNameMapCodeql]}/${name}-${version}-codeql-report.json`;

        fetchvulJsonData(link, "codeql", setCQData, setSQData);
      }
    }
  }, [version]);

  let jsonDataLength: number = Object.values(jsonData).length;

  let data_array: any[];
  let pathNameCodeql: string;

  let pathNameSonar: string;

  let pathName: string;

  let myObjectCodeql;

  let myObjectSonar;

  let myObject;


  React.useEffect(() => {

    const dataObject = masterData?.filter(element => jsonData?.packages?.some(item => item.name.toLowerCase() === element.name.toLowerCase()));
    if (dataObject.length > 0 && Object.values(weakness).length === 0) {
      // debugger
      checkForWeakness(dataObject, setWeakness);
    }

  })


  // console.log(weakness)

  if (report === "Vulnerabilities") {
    pathNameCodeql = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMapCodeql}`;

    pathNameSonar = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMapSonar}`;

    myObjectCodeql = { pathname: pathNameCodeql, state: jsonData } as {
      pathname: string;
    };

    myObjectSonar = { pathname: pathNameSonar, state: jsonData } as {
      pathname: string;
    };
  } else {
    pathName = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;

    myObject = { pathname: pathName, state: jsonData } as {
      pathname: string;
    };
  }

  if (report === "Criticality Score" && jsonDataLength !== 0) {
    let color_code = "";

    let risk_level = "";

    if (
      jsonData.criticality_score.toFixed(2) >= 0.1 &&
      jsonData.criticality_score.toFixed(2) < 0.4
    ) {
      color_code = "#008000";

      risk_level = "Low risk";
    } else if (
      jsonData.criticality_score.toFixed(2) >= 0.4 &&
      jsonData.criticality_score.toFixed(2) < 0.6
    ) {
      color_code = "#FFC300";

      risk_level = "Medium risk";
    } else if (
      jsonData.criticality_score.toFixed(2) >= 0.6 &&
      jsonData.criticality_score.toFixed(2) <= 1.0
    ) {
      color_code = "#FF5733";

      risk_level = "High risk";
    }

    return (data_array = [
      jsonData.criticality_score.toFixed(2),
      <FetchCS data={jsonData} />,
      color_code,
      "",
    ]);
  }

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

    return (data_array = [
      jsonData.score,
      <FetchLowScores data={jsonData} />,
      color_code,
      myObject,
    ]);
  }

  if (
    report === "Vulnerabilities" &&
    Object.values(codeQlData).length !== 0 &&
    Object.values(sonarqubeData).length === 0
  ) {
    return (data_array = [
      codeQlData.length,
      <FetchSAST cqData={codeQlData} sqData={sonarqubeData} />,
      "",
      "",
    ]);
  } else if (
    report === "Vulnerabilities" &&
    Object.values(sonarqubeData).length !== 0 &&
    Object.values(codeQlData).length === 0
  ) {
    let issues: any = Object.values(sonarqubeData)[5];

    return (data_array = [
      sonarqubeData.total,
      <FetchSAST cqData={codeQlData} sqData={issues} />,
      "",
      "",
    ]);
  } else if (
    report === "Vulnerabilities" &&
    Object.values(codeQlData).length !== 0 &&
    Object.values(sonarqubeData).length !== 0
  ) {
    const codeqldetails: any = Object.values(codeQlData);

    const codeqllength: number = Object.values(codeQlData).length;

    let sqissues: any = Object.values(sonarqubeData)[5];

    return (data_array = [
      codeqllength,
      <FetchSAST cqData={codeqldetails} sqData={sqissues} />,
      "",
      "",
    ]);
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

      if (
        flag === 0 &&
        jsonData[i].hasOwnProperty("LicenseConcluded") &&
        jsonData[i].LicenseConcluded.length !== 0
      ) {
        uniqueLicenses.push(jsonData[i].LicenseConcluded);
      }
    }

    return (data_array = [
      uniqueLicenses.length,
      <FetchLicense
        data={jsonData}
        uniq_lic={uniqueLicenses}
        itemData={itemData}
      />,
      "",
      myObject,
    ]);
  }

  let flag = false;


  if (report === "Dependencies" && jsonDataLength !== 0) {
    if (
      !(
        jsonData.packages.length === 1 &&
        jsonData.packages[0].name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return (data_array = [
        jsonData.packages.length - 1,
        <FetchSBOM
          data={jsonData.packages}
          masterData={masterData}
          name={name}
          weakness={weakness}
        />,
        "",
        myObject,
      ]);
    }
  }

  return (
    <MKTypography
      variant="h6"
      key="TYPOSBOMMAINBLANK1"
      color="inherit"
      style={{
        fontSize: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        top: "67px",
      }}
    >
      Assessment report not available
    </MKTypography>
  );
}

const GetHeadings = ({ receivedValue }: any) => {
  if (receivedValue === "License Compliance") {
    return (
      <>
        {" "}
        <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
          License Compatibiltity
          <Icon
            key={`Icon1`}
            title="Licensing information of the OSS"
            sx={{ fontSize: "calc(0.3rem + 0.3vw) !important" }}
          >
            info
          </Icon>
        </MKTypography>
      </>
    );
  } else if (receivedValue === "Dependencies") {
    return (
      <>
        {" "}
        <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
          Dependencies
          <Icon
            key={`Icon2`}
            title="Software Bill Of Material"
            sx={{ fontSize: "calc(0.3rem + 0.3vw) !important" }}
          >
            info
          </Icon>
        </MKTypography>
      </>
    );
  } else if (receivedValue === "ScoreCard") {
    return (
      <>
        {" "}
        <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
          OpenSSF Scorecard (0-10)
          <Icon
            key={`Icon3`}
            title="Overall Security Score of the project"
            sx={{ fontSize: "calc(0.3rem + 0.3vw) !important" }}
          >
            info
          </Icon>
        </MKTypography>
      </>
    );
  } else if (receivedValue === "Criticality Score") {
    return (
      <>
        {" "}
        <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
          OpenSSF Criticality Score (0-1)
          <Icon
            key={`Icon4`}
            title="Score to tell how critical the OSS project"
            sx={{ fontSize: "calc(0.3rem + 0.3vw) !important" }}
          >
            info
          </Icon>
        </MKTypography>
      </>
    );
  } else if (receivedValue === "Vulnerabilities") {
    return (
      <>
        {" "}
        <MKTypography style={{ fontSize: "14px", fontWeight: "bold" }}>
          Static Analysis Summary
          <Icon
            key={`Icon5`}
            title="Provides Static Code Analysis (SAST) report by CodeQL / SonarQube"
            sx={{ fontSize: "calc(0.3rem + 0.3vw) !important" }}
          >
            info
          </Icon>
        </MKTypography>
      </>
    );
  } else {
    return receivedValue;
  }
};

function printText(item) {
  if (item == "Dependencies") {
    return item + " found";
  }

  if (item == "Vulnerabilities") {
    return "weaknesses found";
  } else if (item == "License Compliance") {
    return "unique licenses found";
  } else if (item == "ScoreCard" || item == "Criticality Score") {
    return "on OpenSSF " + item;
  } else {
    return "on " + item;
  }
}

function getImage(report: any) {
  if (report == "Vulnerabilities") {
    return vulnerabilityIcon;
  } else if (report == "Dependencies") {
    return dependencyIcon;
  } else if (report == "License Compliance") {
    return licenseIcon;
  } else if (report == "TAVOSS Score") {
    return tavossIcon;
  } else if (report == "ScoreCard" || report == "Criticality Score") {
    return scorecardIcon;
  }
}

function modalStyle(report: string) {
  let style_params = {};
  switch (report) {
    case "Vulnerabilities":
      style_params = {
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        width: "50%",

        height: "fit-content",

        boxShadow: "24",

        padding: "4",

        backgroundColor: "white",

        display: "flex",

        flexWrap: "wrap",

        placeContent: "center",
      };
      break;

    case "Dependencies":
      style_params = {
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        width: "fit-content",

        height: "fit-content",

        boxShadow: "24",

        padding: "4",

        backgroundColor: "white",

        display: "flex",

        flexWrap: "wrap",

        placeContent: "center",
      };
      break;

    case "License Compliance":
      style_params = {
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        width: "fit-content",

        height: "fit-content",

        boxShadow: "24",

        padding: "4",

        backgroundColor: "white",

        display: "flex",

        flexWrap: "wrap",

        placeContent: "center",
      };
      break;

    case "ScoreCard":
      style_params = {
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        width: "fit-content",

        height: "fit-content",

        boxShadow: "24",

        padding: "4",

        backgroundColor: "white",

        display: "flex",

        flexWrap: "wrap",

        placeContent: "center",
      };
      break;

    case "Criticality Score":
      style_params = {
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        width: "fit-content",

        height: "fit-content",

        boxShadow: "24",

        padding: "4",

        backgroundColor: "white",

        display: "flex",

        flexWrap: "wrap",

        placeContent: "center",
      };
      break;
  }

  return style_params;
}

const ReportModal = ({ version, name, item, itemData, masterData }: any) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let data: any = GetAssessmentData(version, name, item, itemData, masterData);
  let color: any;

  if (data && data[2]) {
    color = data[2];
  } else {
    color = "";
  }
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disabled={data && data[0] ? false : true}
        sx={{
          height: "100px",

          width: "100%",

          ":hover": {
            boxShadow: "0 15px 20px rgba(0,0,0,0.1)", // Adjust the shadow level (0 to 24)

            transition: "box-shadow 0.5s ease-in-out",

            border: "1px solid #5c4f4f",

            color: "blueviolet",
          },
        }}
        style={{
          backgroundColor: "white",

          display: "block",

          textAlign: "left",
        }}
      >
        {color ? (
          <MKTypography
            style={{
              fontSize: "40px",

              color: color,

              fontWeight: "bold",
            }}
          >
            {data ? data[0] : 0}

            <img
              style={{
                width: "40px",
                float: "right",
                position: "relative",
                top: "14px",
                height: "40px",
              }}
              src={getImage(item)}
            />
          </MKTypography>
        ) : (
          <MKTypography
            style={{
              fontSize: "40px",

              fontWeight: "bold",

              color: "black",
            }}
          >
            {data ? data[0] : 0}

            <img
              style={{
                width: "40px",
                float: "right",
                position: "relative",
                top: "14px",
                height: "40px",
              }}
              src={getImage(item)}
            />
          </MKTypography>
        )}

        <MKTypography
          textTransform="capitalize"
          style={{
            fontSize: "12px",
          }}
        >
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
          <Box style={modalStyle(item)}>
            {/* <MKTypography style={{

              fontSize: "20px",
              color: "black",
              textAling: "center"
            }}>
              Summary Report for {item}
              </MKTypography> */}
            {data ? data[1] : "Not found"}

            {data && data[3] ? (
              <MKTypography
                style={{
                  fontSize: "15px",
                  color: "black",
                  position: "fixed",
                  right: "40px",
                  bottom: "10px",
                }}
              >
                Click to get the &nbsp;
                <Link to={data[3]}>detailed report</Link>
              </MKTypography>
            ) : (
              ""
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

function AssessmentReport({
  title,
  name,
  version,
  itemData,
  masterData,
  ...other
}: any) {
  const reports: string[] = [
    "Vulnerabilities",

    "Dependencies",

    "License Compliance",

    "ScoreCard",

    "Criticality Score",

    "TAVOSS Score",
  ];

  return (
    <>
      {reports.map((item, index) => (
        <Grid item xs={6} md={2} lg={2} xl={2}>
          {/* <GetAssessmentData

                            Key={`Grid9${index}`}

                            version={version}

                            name={name}

                            report={item}

                            itemData={itemData}

                            masterData={masterData}

                          /> */}

          <ReportModal
            key={item}
            version={version}
            name={name}
            item={item}
            itemData={itemData}
            masterData={masterData}
          />
        </Grid>
      ))}

      {/* Getting the assessment report */}

      {/* {report.map((value, index) => { */}

      {/* // return ( */}

      {/* //   <> */}

      {/* <Grid item















































































































      {/* //   </> */}

      {/* // ); */}

      {/* }) */}

      {/* } */}
    </>
  );
}

export default AssessmentReport;
