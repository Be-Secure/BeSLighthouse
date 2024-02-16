import * as React from "react";
import { Grid, Typography } from "@mui/material";
import MKTypography from "../../../components/MKTypography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BasicTable from "./BasicTable";

const FetchSAST = ({ cqData, sqData }: any): any => {
  let critical: number = 0;
  let high: number = 0;
  let medium: number = 0;
  let low: number = 0;
  let sqissueslen: number = 0;
  if (sqData && Object.values(sqData).length !== 0) {
    sqissueslen = sqData.length;
  }

  if (cqData.length !== 0 && sqissueslen === 0) {
    cqData.forEach((vul) => {
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
        severity: "high",
        count: high,
      },
      {
        severity: "critical",
        count: critical,
      },
      {
        severity: "medium",
        count: medium,
      },
      {
        severity: "minor",
        count: low,
      },
    ];
    const headings = ["severity", "count"];

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
          tableData={data}
          tableHeading={headings}
          tableStyle={{ textAling: "center" }}
        />
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
    let sqissues: any = "0";
    sqissues = Object.values(sqData)[5];

    sqData?.forEach((vul) => {
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
        severity: "critical",
        count: sqcritical,
      },
      {
        severity: "major",
        count: sqmajor,
      },
      {
        severity: "minor",
        count: sqminor,
      },
    ];
    const headings = ["severity", "count"];
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
          tableData={data}
          tableHeading={headings}
          tableStyle={{ textAling: "center" }}
        />
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

    let sqblocker: number = 0;
    let sqcritical: number = 0;
    let sqmajor: number = 0;
    let sqminor: number = 0;

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
          severity: "critical",
          count: cqcritical,
        },
        {
          severity: "high",
          count: cqhigh,
        },
        {
          severity: "low",
          count: cqlow,
        },
        {
          severity: "medium",
          count: cqmedium,
        },
      ];
      const headings = ["severity", "count"];
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
            tableData={data}
            tableHeading={headings}
            tableStyle={{ textAling: "center" }}
          />
        </>
      );
    }
  } else {
    return (
      <>
        <Typography
          variant="body1"
          key={`MKTypoLBlankCQSQ1`}
          color="inherit"
          style={{
            fontSize: "calc(0.3rem + 0.5vw)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          No SAST issues data Available
        </Typography>
      </>
    );
  }
};

export default FetchSAST;
