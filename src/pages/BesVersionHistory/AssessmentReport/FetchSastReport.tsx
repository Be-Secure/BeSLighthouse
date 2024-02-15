import * as React from "react";
import { Grid, Typography } from "@mui/material";
import MKTypography from "../../../components/MKTypography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BasicTable from "./BasicTable"





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
        count: high
      },
      {
        severity: "critical",
        count: critical
      },
      {
        severity: "medium",
        count: medium
      },
      {
        severity: "minor",
        count: low
      },
    ]
    const headings = ["severity", "count"]

    return (

      <BasicTable tableData={data} tableHeading={headings} tableStyle={{textAling: "center"}}/>
    )
    //   // <>
    //   //   <Grid container spacing={1} pt={2}>
    //   //     <Grid item xs={6} md={6} lg={6}>
    //   //       <MKTypography
    //   //         variant="body1"
    //   //         key={`MKTypoSASTCQSQ7`}
    //   //         color="inherit"
    //   //         style={{
    //   //           fontSize: "14px",
    //   //           display: "flex",
    //   //           justifyContent: "center"
    //   //         }}
    //   //       >
    //   //         <b key="BOLDCQ1">Critical : </b>
    //   //         {critical}
    //   //       </MKTypography>
    //   //     </Grid>
    //   //     <Grid item xs={6} md={6} lg={6}>
    //   //       <MKTypography
    //   //         variant="body1"
    //   //         key={`MKTypoSASTCQSQ7`}
    //   //         color="inherit"
    //   //         style={{
    //   //           fontSize: "14px",
    //   //           display: "flex",
    //   //           justifyContent: "center"
    //   //         }}
    //   //       >
    //   //         <b key="BOLDCQ2">High : </b>
    //   //         {high}
    //   //       </MKTypography>
    //   //     </Grid>

    //   //     <Grid item xs={6} md={6} lg={6}>
    //   //       <MKTypography
    //   //         variant="body1"
    //   //         key={`MKTypoSASTCQSQ7`}
    //   //         color="inherit"
    //   //         style={{
    //   //           fontSize: "14px",
    //   //           display: "flex",
    //   //           justifyContent: "center"
    //   //         }}
    //   //       >
    //   //         <b key="BOLDCQ3">Medium : </b>
    //   //         {medium}
    //   //       </MKTypography>
    //   //     </Grid>
    //   //     <Grid item xs={6} md={6} lg={6}>
    //   //       <MKTypography
    //   //         variant="body1"
    //   //         key={`MKTypoSASTCQSQ7`}
    //   //         color="inherit"
    //   //         style={{
    //   //           fontSize: "14px",
    //   //           display: "flex",
    //   //           justifyContent: "center"
    //   //         }}
    //   //       >
    //   //         <b key="BOLDCQ4"> Low : </b> {low}
    //   //       </MKTypography>
    //   //     </Grid>
    //   //   </Grid>
    //   // </>
    // );
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
    // rowData.push(createData(["critical", sqcritical]))
    // rowData.push(createData(["major", sqmajor]))
    // rowData.push(createData(["minor", sqminor]))
    // rowData.push(createData(["blocker", sqblocker]))
    // heading.push(createHeading(["Severity", "Count"]))
    const data = [
      {
        severity: "Blocker",
        count: sqblocker
      },
      {
        severity: "critical",
        count: sqcritical
      },
      {
        severity: "major",
        count: sqmajor
      },
      {
        severity: "minor",
        count: sqminor
      },
    ]
    const headings = ["severity", "count"]
    return (

      <BasicTable tableData={data} tableHeading={headings} tableStyle={{textAling: "center"}}/>
    )

    // return (
    //   <>
    //     <Grid
    //       key={`GRIDSASTSQ1`}
    //       style={{
    //         minWidth: "calc(10rem + 5vw)",
    //         marginTop: "1.1rem",
    //         marginLeft: "1.5rem"
    //       }}
    //     >
    //       <Grid key={`GRIDSASTSQ2`} container>
    //         <Grid item key={`GRIDSASTSQ3`} xs={6}>
    //           <MKTypography
    //             variant="body1"
    //             color="inherit"
    //             key={`MKTypoSASTSQ1`}
    //             style={{
    //               fontSize: "calc(0.6rem + 0.5vw)",
    //               paddingLeft: "calc(0.1rem + 0.3vw)"
    //             }}
    //           >
    //             <b key="BOLDSQ1"> Critical : </b> {sqblocker}
    //           </MKTypography>
    //         </Grid>
    //         <Grid item key={`GRIDSASTSQ4`} xs={6}>
    //           <MKTypography
    //             variant="body1"
    //             key={`MKTypoSASTSQ2`}
    //             color="inherit"
    //             style={{
    //               fontSize: "calc(0.6rem + 0.5vw)",
    //               paddingLeft: "calc(0.1rem + 0.3vw)"
    //             }}
    //           >
    //             <b key="BOLDSQ2"> High : </b> {sqcritical}
    //           </MKTypography>
    //         </Grid>
    //       </Grid>
    //       <Grid key={`GRIDSASTSQ5}`} container>
    //         <Grid item key={`GRIDSASTSQ6`} xs={6}>
    //           <MKTypography
    //             variant="body1"
    //             key={`MKTypoSASTSQ3`}
    //             color="inherit"
    //             style={{
    //               fontSize: "calc(0.6rem + 0.5vw)",
    //               paddingLeft: "calc(0.1rem + 0.3vw)"
    //             }}
    //           >
    //             <b key="BOLDSQ3">Medium : </b> {sqmajor}
    //           </MKTypography>
    //         </Grid>
    //         <Grid item key={`GRIDSASTSQ7`} xs={6}>
    //           <MKTypography
    //             variant="body1"
    //             key={`MKTypoSASTSQ4`}
    //             color="inherit"
    //             style={{
    //               fontSize: "calc(0.6rem + 0.5vw)",
    //               paddingLeft: "calc(0.1rem + 0.3vw)"
    //             }}
    //           >
    //             <b key="BOLDSQ4">Low : </b>
    //             {sqminor}
    //           </MKTypography>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </>
    // );
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
      // rowData.push(createData({"critical", critical}))
      // rowData.push(createData({"high", high}))
      // rowData.push(createData({"medium", medium}))
      // rowData.push(createData({"low", low}))
      // heading.push(createHeading(["Severity", "Count"]))
      const data = [
        {
        severity: "critical",
        count: cqcritical
        },
        {
          severity: "high",
          count: cqhigh
        },
        {
          severity: "low",
          count: cqlow
        },
        {
          severity: "medium",
          count: cqmedium
        }
      ]
      const headings = ["severity", "count"]
      return (
  
        <BasicTable tableData={data} tableHeading={headings} tableStyle={{textAlign: "center"}}/>
      )
    }

    // if (Array.isArray(sqData)) {
    //   sqData?.forEach((vul) => {
    //     if (vul.severity === "BLOCKER") {
    //       sqblocker++;
    //     } else if (vul.severity === "CRITICAL") {
    //       sqcritical++;
    //     } else if (vul.severity === "MAJOR") {
    //       sqmajor++;
    //     } else if (vul.severity === "MINOR") {
    //       sqminor++;
    //     }
    //   });
    // } else {
    //   console.log("error");
    // }

    // return (
    //   <>
    //     <Grid container spacing={1} pt={2}>
    //       <Grid item xs={6} md={6} lg={6}>
    //         <MKTypography
    //           variant="body1"
    //           key={`MKTypoSASTCQSQ5`}
    //           color="inherit"
    //           style={{
    //             fontSize: "14px",
    //             display: "flex",
    //             justifyContent: "center"
    //           }}
    //         >
    //           <b key="BOLDCQSQ5">Critical </b> : {sqblocker}
    //         </MKTypography>
    //       </Grid>
    //       <Grid item xs={6} md={6} lg={6}>
    //         <MKTypography
    //           variant="body1"
    //           key={`MKTypoSASRCQSQ6`}
    //           color="inherit"
    //           style={{
    //             fontSize: "14px",
    //             display: "flex",
    //             justifyContent: "center"
    //           }}
    //         >
    //           <b key="BOLDCQSQ6">High</b> : {sqcritical}
    //         </MKTypography>
    //       </Grid>
    //       <Grid item xs={6} md={6} lg={6}>
    //         <MKTypography
    //           variant="body1"
    //           key={`MKTypoSASTCQSQ7`}
    //           color="inherit"
    //           style={{
    //             fontSize: "14px",
    //             display: "flex",
    //             justifyContent: "center"
    //           }}
    //         >
    //           <b key="BOLDCQSQ7">Medium</b> : {sqmajor}
    //         </MKTypography>
    //       </Grid>
    //       <Grid item xs={6} md={6} lg={6}>
    //         <MKTypography
    //           variant="body1"
    //           key={`MKTypoSASTCQSQ8`}
    //           color="inherit"
    //           style={{
    //             fontSize: "14px",
    //             display: "flex",
    //             justifyContent: "center"
    //           }}
    //         >
    //           <b key="BOLDCQSQ8">Low</b>: {sqminor}
    //         </MKTypography>
    //       </Grid>
    //     </Grid>
    //   </>
    // );
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
            justifyContent: "center"
          }}
        >
          No SAST issues data Available
        </Typography>
      </>
    );
  }
};

// function BasicTable() {
//   return (
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="a dense table" style={{ padding: "10px 10px 10px 10px", width: "100%", height: "100%" }}>
//         <TableHead>
//           {/* <TableRow style={{width: "100%", display: "inline-flex", alignItems: "flex-end", justifyContent: "space-between", paddingLeft: "30px"}}> */}
//           <TableRow hover tabIndex={-1} sx={{ color: "#637381", backgroundColor: "#F4F6F8" }}>
//             <TableCell>Severity</TableCell>
//             <TableCell style={{ position: "fixed", right: "75px" }}>Count</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rowData.map((row) => (
//             <TableRow
//               key={row.severity}
//               style={{ width: "100%", display: "inline-flex", alignItems: "flex-end", justifyContent: "space-between", paddingLeft: "30px" }}
//             >
//               {/* <TableCell scope="row" style={{ position: "relative", left: "15px", right: "15px"}}> */}
//               <TableCell align="left">
//                 {row.severity}
//               </TableCell>
//               <TableCell align="left">
//                 {row.count}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

export default FetchSAST;
