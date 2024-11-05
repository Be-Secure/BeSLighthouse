import React, { useState } from "react";
import { fetchJsonData } from "../BesVersionHistory/AssessmentReport";
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
import { besecureMlAssessmentDataStore } from "../../dataStore";

const TABLE_HEAD = [
  { id: "test_case", label: "Test Case", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "severity", label: "Severity", alignRight: false },
  { id: "recommended_treatment", label: "Recommended Treatment", alignRight: false },
];

export default function InsecureCodeDetectionTable() {
  const [report, setReport] = useState([]);
  
  let { modelName }: any = useParams();
  modelName = modelName.slice(1);
  
  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${modelName}/insecure-code-detection/${modelName}-codeshield-summary-report.json`;
    fetchJsonData(link, setReport);
  }, [modelName]);

  const modelDetails = Object.values(report);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <TableContainer sx={ { minWidth: 800 } }>
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
            .map((row: any, index: any) => {
              const issuesFound = row.issues_found[0]; // Get the first issue
              const description = issuesFound ? issuesFound.description : "Not Available";
              const severity = issuesFound ? issuesFound.severity : "Not Available";

              return (
                <TableRow hover key={ index } tabIndex={ -1 }>
                  <TableCell align="left" sx={ { fontSize: "13px" } }>
                    { row.test_case }
                  </TableCell>
                  <TableCell align="left" sx={ { fontSize: "13px" } }>
                    { description }
                  </TableCell>
                  <TableCell align="left" sx={ { fontSize: "13px" } }>
                    { severity }
                  </TableCell>
                  <TableCell align="left" sx={ { fontSize: "13px" } }>
                    { row.recommended_treatment }
                  </TableCell>
                </TableRow>
              );
            }) }
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={ [15, 30, 45] }
        component="div"
        count={ modelDetails.length }
        rowsPerPage={ rowsPerPage }
        page={ page }
        onPageChange={ handleChangePage }
        onRowsPerPageChange={ handleChangeRowsPerPage }
      />
    </TableContainer>
  );
}
