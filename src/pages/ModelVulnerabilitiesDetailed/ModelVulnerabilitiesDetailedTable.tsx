import React, { useState } from "react";
import { fetchJsonData } from "../BesVersionHistory/AssessmentReport";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";

import {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import { useParams } from "react-router-dom";

const TABLE_HEAD = [
  { id: "index", label: "##", alignRight: false },
  { id: "weakness", label: "Weakness", alignRight: false },
  { id: "severity", label: "Severity", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "filename", label: "Filename", alignRight: false },
];

const regex = /^(.*?)(?=#).*Severity:(.*?)- (.*)/;

function createRow(row: any, combinedMatch: any) {
  return (
    <>
      <TableCell sx={ { fontSize: "13px" } } align="left">
        { combinedMatch.length === 0 ? "Not Available" : combinedMatch[2] }
      </TableCell>
      <TableCell sx={ { fontSize: "13px" } } align="left">
        { combinedMatch.length === 0 ? "Not Available" : combinedMatch[3] }
      </TableCell>
      <TableCell sx={ { fontSize: "13px" } } align="left">
        { row.file_name }
      </TableCell>
    </>
  );
}

export default function ModelVulnerabilitiesDetailedTable() {
  const [report, setreport]: any = useState([]);

  let { modelName } = useParams<{ modelName: any }>();
  modelName = modelName.slice(1);
  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${modelName}/sast/${modelName}-sast-detailed-report.json`;
    fetchJsonData(link, setreport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modelDetails = Object.values(report);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage: any = (event: {
    target: { value: string };
  }) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <>
      {
        <TableContainer sx={ { minWidth: 800, color: "red" } }>
          <Table>
            <TableHead sx={ { display: "contents" } }>
              <TableRow>
                { TABLE_HEAD.map((headCell: any) => (
                  <TableCell
                    sx={ {
                      color: "#637381",
                      backgroundColor: "#F4F6F8",
                      fontSize: "14px"
                    } }
                    key={ headCell.id }
                    align={ headCell.alignRight ? "right" : "left" }
                  >
                    { headCell.label }
                  </TableCell>
                )) }
              </TableRow>
            </TableHead>
            <TableBody>
              { modelDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => {
                  let combinedMatch;
                  if (row.scanning_reports.output_log?.[0]) {
                    combinedMatch =
                      row.scanning_reports.output_log[0].match(regex);
                  } else {
                    combinedMatch = [];
                  }
                  return (
                    <TableRow hover key={ index } tabIndex={ -1 }>
                      <TableCell align="left" sx={ { fontSize: "13px" } }>
                        { index + 1 }
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={ { paddingLeft: "2px", fontSize: "13px" } }
                        padding="none"
                      >
                        { combinedMatch.length === 0
                          ? "Not Available"
                          : combinedMatch[1] }
                      </TableCell>
                      { createRow(row, combinedMatch) }
                    </TableRow>
                  );
                }) }
            </TableBody>
          </Table>
          <TablePagination
            sx={ {
              ".MuiTablePagination-selectLabel": {
                margin: "auto"
              },
              ".MuiTablePagination-displayedRows": {
                margin: "auto"
              }
            } }
            rowsPerPageOptions={ [15, 30, 45] }
            component="div"
            count={ Object.keys(report).length }
            rowsPerPage={ rowsPerPage }
            page={ page }
            onPageChange={ handleChangePage }
            onRowsPerPageChange={ handleChangeRowsPerPage }
          />
        </TableContainer>
      }
    </>
  );
}
