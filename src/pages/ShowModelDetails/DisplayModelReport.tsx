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

// Fixme: Code refactor

const model = [
  "Total Number of Model Found",
  "Total Number of Model Scanned",
  "Total Model Vulnerabilities Found"
];

const TABLE_HEAD = [
  { id: "found", label: "Found", alignRight: false },
  { id: "scanned", label: "Scanned", alignRight: false },
  { id: "critical", label: "Critical", alignRight: false },
  { id: "high", label: "High", alignRight: false },
  { id: "medium", label: "Medium", alignRight: false },
  { id: "low", label: "Low", alignRight: false }
];

export default function DisplayModelReport({ data }: any): any {
  const location = useLocation();
  const selectedMenu: { name: string } = location.state.selectedMenu;
  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" color="inherit">
                Models & Vulnerabilities:
              </Typography>
            </Grid>
            <Grid item>
              <TableContainer>
                <Table>
                  <PoiListHead headLabel={ TABLE_HEAD } requestFromOtherComponent={ true } />
                  <TableBody>
                    <TableRow hover key={ "dddd" } tabIndex={ -1 }>
                      <TableCell component="th" scope="row" padding="none">
                        { data[model[0]] > 0 ? (
                          <a

                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[0]] }
                          </a>
                        ) : (
                          data[model[0]]
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[model[1]] > 0 ? (
                          <a

                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[1]] }
                          </a>
                        ) : (
                          data[model[1]]
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[model[2]].Critical > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[2]].Critical }
                          </a>
                        ) : (
                          data[model[2]].Critical
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[model[2]].High > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[2]].High }
                          </a>
                        ) : (
                          data[model[2]].High
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[model[2]].Medium > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[2]].Medium }
                          </a>
                        ) : (
                          data[model[2]].Medium
                        ) }
                      </TableCell>
                      <TableCell align="left">
                        { data[model[2]].Low > 0 ? (
                          <a
                            style={ { color: "#587f2f", cursor: "pointer" } }
                            href={ `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}` }
                          >
                            { data[model[2]].Low }
                          </a>
                        ) : (
                          data[model[2]].Low
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
