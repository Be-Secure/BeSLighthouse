/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { fetchJsonReport } from "../../../utils/fatchJsonReport";
import { Link } from "react-router-dom";
import { assessmentDatastoreURL, versionDetailsURL } from "../../../dataStore";
import MKTypography from "../../../components/MKTypography";
import {
  assessmentPath,
  assessmentReport,
} from "../../../utils/assessmentReport";
import { useState } from "react";
import vulnerabilityIcon from "../../../assets/images/bug.png";
import dependencyIcon from "../../../assets/images/data-flow.png";
import licenseIcon from "../../../assets/images/certificate.png";
import scorecardIcon from "../../../assets/images/speedometer.png";
import tavossIcon from "../../../assets/images/verified.png";
import BasicTable from "./BasicTable";
import FetchSastReport from "./FetchSastReport";

export const fetchJsonData = async (link: any, setJsonData: any) => {
  try {
    const response = await fetchJsonReport(link);

    try {
      const data = JSON.parse(response);

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
      const data = JSON.parse(response);
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
  const tableData: any[] = [{}];
  const headings = ["Issue", "Reason"];

  const lowscorers: any = [];

  data.checks.forEach((issue: { hasOwnProperty: (arg0: string) => any; score: number; }) => {

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
      <MKTypography
        style={ {
          paddingTop: "10px",
          fontWeight: "bold",
          fontSize: "18px",
        } }
      >
        Summary Report
      </MKTypography>
      <BasicTable
        tableData={ tableData }
        tableHeading={ headings }
        tableStyle={ { textAlign: "center" } }
      />
    </>
  );
};

const FetchCS = ({ data }: any) => {
  let tableData: any[] = [];
  const headings = [
    "Age(in months)",
    "Contributors",
    "Organizations",
    "Closed Issues",
    "Last Updated",
  ];

  if ("default_score" in data) {
    tableData = [
      {
        "Age(in months)": data.legacy.created_since,
        Contributors: data.legacy.contributor_count,
        Organizations: data.legacy.org_count,
        "Closed Issues": data.legacy.closed_issues_count,
        "Last Updated": data.legacy.updated_since,
      },
    ];
  } else if ("criticality_score" in data) {
    tableData = [
      {
        "Age(in months)": data.created_since,
        Contributors: data.contributor_count,
        Organizations: data.org_count,
        "Closed Issues": data.closed_issues_count,
        "Last Updated": data.updated_since,
      },
    ];
  }
  return (
    <>
      <MKTypography
        style={ {
          fontSize: "18px",
          fontWeight: "bold",
          paddingTop: "20px",
        } }
      >
        Summary Report
      </MKTypography>

      <BasicTable
        tableData={ tableData }
        tableHeading={ headings }
        tableStyle={ { textAlign: "center" } }
      />
    </>
  );
};

const FetchLicense = ({ data, uniq_lic, itemData }: any) => {
  let tableData: any[] = [];
  let non_lic_files: number = 0;
  const license_list: string[] = [];
  let project_lcesnse: string = "Not Found";
  const headings = ["Project License", "Undetermined Files", "Licenses Found"];

  uniq_lic.forEach((ul: any) => {
    if (ul.length !== 0) license_list.push(ul);
  });

  data.forEach((ld: { LicenseConcluded: string | any[]; }) => {
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
          style={ {
            paddingTop: "10px",
            fontWeight: "bold",
            fontSize: "18px",
          } }
        >
          Summary Report
        </MKTypography>
        <BasicTable
          tableData={ tableData }
          tableHeading={ headings }
          tableStyle={ { textAlign: "center" } }
        />
      </>
    );
  } else {
    return (
      <>
        <MKTypography
          variant="h6"
          key={ `MKTypoLBlank` }
          color="inherit"
          style={ {
            fontSize: "12px",
            display: "flex",

            justifyContent: "center",
          } }
        >
          Not Available
        </MKTypography>
      </>
    );
  }
};

async function checkForWeakness(dataObject: any, setWeakness: any) {
  let version: any;
  let sonarqubeLink: any;
  let codeqlLink: any;
  let codeqlData: any[];
  let sonarqubeData: any;
  const foundPackages: any = {};

  for (const dependency of dataObject) {
    try {
      const versionSummaryResponse: any = await fetchJsonReport(
        versionDetailsURL +
        dependency.id +
        "-" +
        dependency.name +
        "-Versiondetails.json"
      );

      const versionData: any[] = JSON.parse(versionSummaryResponse);
      version = versionData[0].version;
      sonarqubeLink = `${assessmentDatastoreURL}/${dependency.name}/${version}/sast/${dependency.name}-${version}-sonarqube-report.json`;

      codeqlLink = `${assessmentDatastoreURL}/${dependency.name}/${version}/sast/${dependency.name}-${version}-codeql-report.json`;
    } catch (error) {
      codeqlData = [];
      sonarqubeData = {};
    }
    try {
      const responseCodeql: any = await fetchJsonReport(codeqlLink);
      codeqlData = JSON.parse(responseCodeql);
    } catch (error) {
      codeqlData = [];
    }

    try {
      const responseSonarqube: any = await fetchJsonReport(sonarqubeLink);
      sonarqubeData = JSON.parse(responseSonarqube);
    } catch (error) {
      sonarqubeData = {};
    }

    if (codeqlData && codeqlData.length > 0) {
      foundPackages[dependency.name] = true;
    } else if (
      codeqlData.length === 0 &&
      sonarqubeData &&
      sonarqubeData.total !== 0
    ) {
      foundPackages[dependency.name] = true;
    }
  }

  setWeakness(foundPackages);
}

const FetchSBOM = ({ data, masterData, name, weakness }: any) => {
  const tableData: any[] = [{}];
  const headings = [
    "ID",
    "Name",
    "BeS Tech Stack",
    "License",
    "Link",
    "Weakness",
  ];
  const tracked: string[] = [];

  data.forEach((dp: { name: string; }) => {
    if (!dp.name) {
      return;
    }

    if (dp.name.toLowerCase() === name.toLowerCase()) {
      return;
    }

    masterData.forEach((tp: { name: string; }) => {
      let duplicate: boolean = false;

      if (dp.name.toLowerCase() === tp.name.toLowerCase()) {
        tracked.forEach((tmptracked) => {
          if (tmptracked.toLowerCase() === dp.name.toLowerCase())
            duplicate = true;
        });

        const dataObject = masterData?.find(function (item: { name: any; }) {
          return item.name === tp.name;
        });

        const id = dataObject?.id;
        const projectName = dataObject?.name;
        const bes_technology_stack = dataObject?.bes_technology_stack;

        const license = dataObject?.license.spdx_id;
        if (!duplicate) tracked.push(dp.name);
        tableData.push({
          ID: id,
          Name: projectName,
          "BeS Tech Stack": bes_technology_stack,
          License: license,
          Link: (
            <a
              href={ `/BeSLighthouse/Project-Of-Interest/bes_version_history/:${id}/:${projectName}` }
            >
              link
            </a>
          ),
          Weakness: weakness[projectName] ? "Exist" : "Absent",
        });
      }
    });
  });

  return (
    <>
      { tracked.length !== 0 ? (
        <>
          <MKTypography
            style={ {
              paddingTop: "10px",
              fontWeight: "bold",
              fontSize: "18px",
            } }
          >
            Dependencies Tracked under the Lab
          </MKTypography>
          <BasicTable
            tableData={ tableData }
            tableHeading={ headings }
            tableStyle={ { textAlign: "center" } }
          />
        </>
      ) : (
        <MKTypography
          style={ {
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
            height: "100%",
            paddingBottom: "15%",
            paddingTop: "15%",
            margin: "0px 35px 0px 35px",
          } }
        >
          <b key={ `BOLDSBOM1` }>
            None of the dependencies detected are currently tracked in this lab
          </b>
        </MKTypography>
      ) }
    </>
  );
};

function GetAssessmentData(version: string, name: string, report: string, itemData: any, masterData: any[]) {
  const [jsonData, setJsonData]: any = React.useState({});
  const [codeQlData, setCQData]: any = React.useState([]);
  const [sonarqubeData, setSQData]: any = React.useState({});
  const [weakness, setWeakness]: any = React.useState({});

  let reportNameMap = "";
  let reportNameMapCodeql = "";
  if (report === "Criticality Score") {
    reportNameMap = "Criticality Score";
  } else if (report === "Vulnerabilities") {
    reportNameMapCodeql = "Codeql";
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
      link = `${assessmentDatastoreURL}/${name}/${version}/${assessmentPath[reportNameMap]}/${name}-${version}-${assessmentReport[reportNameMap]}-report.json`;
      fetchJsonData(link, setJsonData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      // Fix me
      link = `${assessmentDatastoreURL}/${name}/${version}/sast/${name}-${version}-sonarqube-report.json`;
      fetchvulJsonData(link, "sonarqube", setCQData, setSQData);
    }
  }, [version]);

  React.useEffect(() => {
    if (version?.trim()) {
      let link: string = "";
      link = `${assessmentDatastoreURL}/${name}/${version}/${assessmentPath[reportNameMapCodeql]}/${name}-${version}-codeql-report.json`;
      fetchvulJsonData(link, "codeql", setCQData, setSQData);
    }
  }, [version]);

  const jsonDataLength: number = Object.values(jsonData).length;

  React.useEffect(() => {
    const dataObject = masterData?.filter((element: { name: string; }) =>
      jsonData?.packages?.some(
        (item: { name: string; }) => item.name.toLowerCase() === element.name.toLowerCase()
      )
    );
    if (dataObject.length > 0 && Object.values(weakness).length === 0) {

      checkForWeakness(dataObject, setWeakness);
    }
  });

  const pathName = `/BeSLighthouse/bes_assessment_report/:${name}/:${version}/:${reportNameMap}`;

  const myObject = { pathname: pathName, state: jsonData } as {
    pathname: string;
  };

  if (report === "Criticality Score" && jsonDataLength !== 0) {
    let color_code = "";
    let risk_level = "";
    let criticality_score: any = 0.0;
    if ("default_score" in jsonData) {
      criticality_score = parseFloat(jsonData.default_score);
    } else if ("criticality_score" in jsonData) {
      criticality_score = jsonData.criticality_score;
    }
    if (
      criticality_score.toFixed(2) >= 0.1 &&
      criticality_score.toFixed(2) < 0.4
    ) {
      color_code = "#008000";

      risk_level = "Low risk";
    } else if (
      criticality_score.toFixed(2) >= 0.4 &&
      criticality_score.toFixed(2) < 0.6
    ) {
      color_code = "#FFC300";

      risk_level = "Medium risk";
    } else if (
      criticality_score.toFixed(2) >= 0.6 &&
      criticality_score.toFixed(2) <= 1.0
    ) {
      color_code = "#FF5733";

      risk_level = "High risk";
    }

    return ([
      criticality_score.toFixed(2),
      <FetchCS data={ jsonData } />,
      color_code,
      "",
      risk_level,
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

    return ([
      jsonData.score,
      <FetchLowScores data={ jsonData } />,
      color_code,
      myObject,
      risk_level,
    ]);
  }
  if (
    report === "Vulnerabilities" &&
    Object.values(codeQlData).length !== 0 &&
    Object.values(sonarqubeData).length === 0
  ) {
    return ([
      codeQlData.length,
      <FetchSastReport cqData={ codeQlData } sqData={ sonarqubeData } />,
      "",
      "",
    ]);
  } else if (
    report === "Vulnerabilities" &&
    Object.values(sonarqubeData).length !== 0 &&
    Object.values(codeQlData).length === 0
  ) {
    const issues: any = Object.values(sonarqubeData)[5];
    let count = 0;
    if (issues && issues.length > 0) {
      for (let i = 0; i < issues.length; i++) {
        if (
          issues[i].severity === "CRITICAL" ||
          issues[i].severity === "MAJOR" ||
          issues[i].severity === "MINOR" ||
          issues[i].severity === "BLOCKER"
        )
          count++;
      }
    }
    return ([
      count,
      <FetchSastReport cqData={ codeQlData } sqData={ issues } />,
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

    const sqissues: any = Object.values(sonarqubeData)[5];

    return ([
      codeqllength,
      <FetchSastReport cqData={ codeqldetails } sqData={ sqissues } />,
      "",
      "",
    ]);
  }

  if (report === "License Compliance" && jsonDataLength !== 0) {
    const uniqueLicenses: any = [];

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

    return ([
      uniqueLicenses.length,
      <FetchLicense
        data={ jsonData }
        uniq_lic={ uniqueLicenses }
        itemData={ itemData }
      />,
      "",
      myObject,
    ]);
  }

  if (report === "Dependencies" && jsonDataLength !== 0) {
    if (
      !(
        jsonData.packages.length === 1 &&
        jsonData.packages[0].name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return ([
        jsonData.packages.length - 1,
        <FetchSBOM
          data={ jsonData.packages }
          masterData={ masterData }
          name={ name }
          weakness={ weakness }
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
      style={ {
        fontSize: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        top: "67px",
      } }
    >
      Assessment report not available
    </MKTypography>
  );
}

function printText(item: string) {
  if (item === "Dependencies") {
    return item + " found";
  }

  if (item === "Vulnerabilities") {
    return "weaknesses found";
  } else if (item === "License Compliance") {
    return "unique licenses found";
  } else if (item === "ScoreCard" || item === "Criticality Score") {
    return "OpenSSF " + item;
  } else {
    return "on " + item;
  }
}

function getImage(report: any) {
  if (report === "Vulnerabilities") {
    return vulnerabilityIcon;
  } else if (report === "Dependencies") {
    return dependencyIcon;
  } else if (report === "License Compliance") {
    return licenseIcon;
  } else if (report === "TAVOSS Score") {
    return tavossIcon;
  } else if (report === "ScoreCard" || report === "Criticality Score") {
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

      height: "90%",

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
  // close functionality
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [isHovered, setIsHovered] = useState(false);
  const data: any = GetAssessmentData(version, name, item, itemData, masterData);
  let color: any;
  const countData = data[0];
  if (data && data[2]) {
    color = data[2];
  } else {
    color = "";
  }
  return (
    <>
      <Button
        variant="contained"
        onClick={ handleOpen }
        disabled={ !(data && countData !== undefined) }
        sx={ {
          height: "100px",
          width: "100%",
          ":hover": {
            boxShadow: "0 15px 20px rgba(0,0,0,0.1)",

            transition: "box-shadow 0.5s ease-in-out",
            border: "1px solid #5c4f4f",
            color: "blueviolet",
          },
        } }
        style={ {
          backgroundColor: "white",
          display: "block",
          textAlign: "left",
        } }
      >
        { color ? (
          <MKTypography
            style={ {
              fontSize: "40px",
              color: color,
              fontWeight: "bold",
            } }
          >
            { data ? data[0] : 0 }
            <img
              style={ {
                width: "40px",
                float: "right",
                position: "relative",
                top: "14px",
                height: "40px",
              } }
              src={ getImage(item) }
            />
          </MKTypography>
        ) : (
          <MKTypography
            style={ {
              fontSize: "40px",

              fontWeight: "bold",

              color: "black",
            } }
          >
            { data ? data[0] : 0 }

            <img
              style={ {
                width: "40px",
                float: "right",
                position: "relative",
                top: "14px",
                height: "40px",
              } }
              src={ getImage(item) }
            />
          </MKTypography>
        ) }

        <MKTypography
          textTransform="capitalize"
          style={ {
            fontSize: "12px",
          } }
        >
          { printText(item) }
          { item === "ScoreCard" || item === "Criticality Score" ? (
            <span
              style={ {
                position: "absolute",
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-block",
                transition: "color 0.5s",
                color: "#36454F",
                marginLeft: "5px",
              } }
              onMouseEnter={ () => setIsHovered(true) }
              onMouseLeave={ () => setIsHovered(false) }
            >
              <i className="fas fa-info-circle" />
            </span>
          ) : (
            ""
          ) }
          { isHovered && (
            <div
              style={ {
                position: "absolute",
                top: "98%",
                left: "55%",
                transform: "translateX(-70%)",
                backgroundColor: "#fff",
                color: "black",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.4)",
                fontSize: "12px",
                fontWeight: "normal",
                transition: "opacity 0.5s",
                zIndex: 9999,
                whiteSpace: "nowrap",
              } }
            >
              { item === "ScoreCard" ? (
                <><p>
                  Scorecard is an automated tool that assesses a number of important heuristics associated
                  with software security and assigns each check a score of 0-10.
                </p><ul style={ { listStyleType: "disc", margin: "8px", paddingInlineStart: "14px" } }>
                  <li>Low risk: 0 - 2</li>
                  <li>Medium risk: 2 - 5</li>
                  <li>High risk: 5 - 7.5</li>
                  <li>Critical risk: 7.5 - 10</li>
                </ul></>
              ) : (
                <>
                  <p>
                    A project's criticality score defines the influence and importance of a project.
                    It is a number between 0 (least-critical) and 1 (most-critical).
                  </p>
                  <ul style={ { listStyleType: "disc", margin: "8px", paddingInlineStart: "14px" } }>
                    <li>Low Critical: 0.1 - 0.4</li>
                    <li>Medium critical: 0.4 - 0.6</li>
                    <li>Highly critical: 0.6 - 1.0</li>
                  </ul>
                </>
              ) }
            </div>
          ) }
        </MKTypography>
      </Button>

      <Modal
        open={ open }
        onClose={ handleClose }
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
      >
        <Fade in={ open }>
          <Box style={ {
            ...modalStyle(item),
            borderRadius: "9px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
          } }>
            <IconButton
              style={ {
                position: "absolute",
                top: "0px",
                right: "0px",
                color: "black",
              } }
              onClick={ handleClose }>
              <CloseIcon fontSize="medium" sx={ { ':hover': { color: 'red' } } } />
            </IconButton>
            { data ? data[1] : "Not found" }

            { data && data[3] ? (
              <Typography
                style={ {
                  fontSize: "15px",
                  color: "black",
                  position: "fixed",
                  right: "40px",
                  bottom: "10px",
                } }
              >
                <Link to={ data[3] }>Detailed Report</Link>
              </Typography>
            ) : (
              ""
            ) }
          </Box>
        </Fade>
      </Modal>

    </>
  );
};

function AssessmentReport({ name, version, itemData, masterData }: any) {
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
      { reports.map((item, index) => (
        <Grid item xs={ 6 } md={ 4 } lg={ 4 } xl={ 2 }>
          <ReportModal
            key={ item }
            version={ version }
            name={ name }
            item={ item }
            itemData={ itemData }
            masterData={ masterData }
          />
        </Grid>
      )) }
    </>
  );
}

export default AssessmentReport;
