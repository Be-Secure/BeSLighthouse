import * as React from "react";
import { Typography } from "@mui/material";
import MKTypography from "../../../components/MKTypography";
import BasicTable from "./BasicTable";

const FetchSastReport = ({ cqData, sqData }: any): any => {
  let critical: number = 0;
  let high: number = 0;
  let medium: number = 0;
  let low: number = 0;
  let sqissueslen: number = 0;
  if (sqData && Object.values(sqData).length !== 0) {
    sqissueslen = sqData.length;
  }

  if (cqData.length !== 0 && sqissueslen === 0) {
    cqData.forEach((vul: { rule: { security_severity_level: string; }; }) => {
      if (vul.rule.security_severity_level === "critical") {
        critical++;
      } else if (vul.rule.security_severity_level === "high") {
        high++;
      } else if (vul.rule.security_severity_level === "medium") {
        medium++;
      } else if (vul.rule.security_severity_level === "low") {
        low++;
      }
    });
    const data = [
      {
        severity: "Critical",
        count: critical,
      },
      {
        severity: "High",
        count: high,
      },
      {
        severity: "Medium",
        count: medium,
      },
      {
        severity: "Low",
        count: low,
      },
    ];
    const headings = ["severity", "count"];

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

        <BasicTable tableData={ data } tableHeading={ headings } tableStyle={ { textAlign: "center" } } />
      </>
    );
  } else if (
    JSON.stringify(Object.values(cqData).length) === "0" &&
    sqissueslen !== 0
  ) {
    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;

    sqData?.forEach((vul: { severity: string; }) => {
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

    const data = [
      {
        severity: "Blocker",
        count: sqblocker,
      },
      {
        severity: "Critical",
        count: sqcritical,
      },
      {
        severity: "Major",
        count: sqmajor,
      },
      {
        severity: "Minor",
        count: sqminor,
      },
    ];
    const headings = ["severity", "count"];
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

        <BasicTable tableData={ data } tableHeading={ headings } tableStyle={ { textAlign: "center" } } />
      </>
    );
  } else if (
    JSON.stringify(Object.values(cqData).length) !== "0" &&
    sqissueslen !== 0
  ) {
    let cqcritical: number = 0;
    let cqhigh: number = 0;
    let cqmedium: number = 0;
    let cqlow: number = 0;

    if (Array.isArray(cqData)) {
      cqData?.forEach((vul) => {
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

      const data = [
        {
          severity: "Critical",
          count: cqcritical,
        },
        {
          severity: "High",
          count: cqhigh,
        },
        {
          severity: "Medium",
          count: cqmedium,
        },
        {
          severity: "Low",
          count: cqlow,
        },
      ];
      const headings = ["severity", "count"];
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
          <BasicTable tableData={ data } tableHeading={ headings } tableStyle={ { textAlign: "center" } } />
        </>
      );
    }
  } else {
    return (
      <>
        <Typography
          variant="body1"
          key={ `MKTypoLBlankCQSQ1` }
          color="inherit"
          style={ {
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
            height: "100%",
            paddingBottom: "15%",
            paddingTop: "15%",
            margin: "0px 35px 0px 35px",
            textAlign: 'center'
          } }
        >
          No Weaknesses Found.
        </Typography>
      </>
    );
  }
};

export default FetchSastReport;
