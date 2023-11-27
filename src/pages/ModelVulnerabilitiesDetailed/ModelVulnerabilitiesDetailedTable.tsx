import { filter } from "lodash";
import React, { useState } from "react";
import { verifyLink } from "../BesVersionHistory/AssessmentReport";
import { besecureMlAssessmentDataStore, vulnerabilities } from "../../dataStore";
import { getComparator } from "../../layouts/pages/projectOfInterest/ProjectDisplay";
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

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    let search = query.trim();
    return filter(array, (_user: any) => {
      if (_user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        return true;
    });
  }
  return stabilizedThis.map((el: any) => el[0]);
}

const TABLE_HEAD = [
  { id: "filename", label: "Filename", alignRight: false },
  { id: "tool", label: "Tool", alignRight: false },
  { id: "severity", label: "Severity", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "vulnerabilities", label: "Vulnerabilities", alignRight: false }
];

const regex = /^(.*?)(?=#).*Severity:(.*?)- (.*)/;

function createRow(row: any) {
  const combinedMatch = row["scanning_reports"]["output_log"][0].match(regex);
  return (
    <>
      <TableCell align="left">{combinedMatch[2]}</TableCell>
      <TableCell align="left">{combinedMatch[3]}</TableCell>
      <TableCell align="left">{combinedMatch[1]}</TableCell>
    </>
  );
}

export default function ModelVulnerabilitiesDetailedTable() {
  const [report, setreport]: any = useState([]);
  
  let { modelName }: any = useParams();
  modelName = modelName.slice(1);
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${modelName}/vulnerabilities/${modelName}-vulnerabilities-detailed-report.json`;
    verifyLink(link, setreport);
  }, []);

  const modelDetails = Object.values(report);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        <TableContainer sx={{ minWidth: 800, color: "red" }}>
          <Table>
            <TableHead sx={{ display: "contents" }}>
              <TableRow>
                {TABLE_HEAD.map((headCell: any) => (
                  <TableCell
                    sx={{ color: "#637381", backgroundColor: "#F4F6F8" }}
                    key={headCell.id}
                    align={headCell.alignRight ? "right" : "left"}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {modelDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => {
                  return (
                    <TableRow hover key={index} tabIndex={-1}>
                      <TableCell
                        align="center"
                        sx={{ paddingLeft: "2px" }}
                        padding="none"
                      >
                        {row.file_name}
                      </TableCell>
                      <TableCell align="left">
                        {row["scanning_reports"]["tool"]}
                      </TableCell>
                      {createRow(row)}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            sx={{
              ".MuiTablePagination-selectLabel": {
                margin: "auto"
              },
              ".MuiTablePagination-displayedRows": {
                margin: "auto"
              }
            }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={Object.keys(report).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      }
    </>
  );
}
