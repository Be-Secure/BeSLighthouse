import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import PoiListHead from "../ProjectOfInterest/PoiTable/PoiListHead";
import { useLocation } from "react-router-dom";
import { dividerDiv } from "./AssessmentSummary";

// Fixme: Code refactor

const files = [
  "Total Number of Notebooks & Requirement files Found",
  "Total Number of Notebooks & Requirement files Scanned",
  "Total Notebook & Requirement files Vulnerabilities Found"
];

const TABLE_HEAD = [
  { id: "found", label: "Found", alignRight: false },
  { id: "scanned", label: "Scanned", alignRight: false },
  { id: "critical", label: "Critical", alignRight: false },
  { id: "high", label: "High", alignRight: false },
  { id: "medium", label: "Medium", alignRight: false },
  { id: "low", label: "Low", alignRight: false }
];

export default function DisplayFileReport({ data }: any) {
  const location = useLocation();
  const selectedMenu: { name: string } = location.state.selectedMenu;
  return (
    <>
      { dividerDiv(1) }
      <Grid container direction="column">
        <Grid item>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" color="inherit">
                Notebooks & Requirements:
              </Typography>
            </Grid>
            <Grid item>
              <TableContainer>
                <Table>
                  <PoiListHead headLabel={ TABLE_HEAD } />
                  <TableBody>
                    <TableRow hover key={ "dddd" } tabIndex={ -1 }>
                      <TableCell component="th" scope="row" padding="none">
                        { data[files[0]] > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[0]] }
                          </a>
                        ) : (
                          data[files[0]]
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[files[1]] > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[1]] }
                          </a>
                        ) : (
                          data[files[1]]
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[files[2]].Critical > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[2]].Critical }
                          </a>
                        ) : (
                          data[files[2]].Critical
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[files[2]].High > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[2]].High }
                          </a>
                        ) : (
                          data[files[2]].High
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[files[2]].Medium > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[2]].Medium }
                          </a>
                        ) : (
                          data[files[2]].Medium
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[files[2]].Low > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[files[2]].Low }
                          </a>
                        ) : (
                          data[files[2]].Low
                        ) }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
