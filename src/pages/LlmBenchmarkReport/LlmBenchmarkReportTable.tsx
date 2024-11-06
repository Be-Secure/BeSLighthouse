import React, { useEffect, useState } from "react";
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
import { verifyLink } from "../../utils/verifyLink";

export default function LlmBenchmarkReportTable() {
  const [report, setReport] = useState([]);
  let { modelName, llm_type }: any = useParams();
  const name = modelName.slice(1);
  const type = llm_type.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      const links: any = `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-${type}-test-detailed-report.json`;
      verifyLink(links, setReport);
    };
    fetchData();
  }, [name, type]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  // Define TABLE_HEAD based on type
  const TABLE_HEAD =
    type === "mitre"
      ? [
        { id: "test_case_prompt", label: "Test Case Prompt", alignRight: false },
        { id: "text", label: "Text", alignRight: false },
        { id: "stop_reason", label: "Stop Reason", alignRight: false },
        { id: "mitre_category", label: "Mitre Category", alignRight: false }
      ]
      : type === "autocomplete" || type === "instruct"
        ? [
          { id: "test_case_prompt", label: "Test Case Prompt", alignRight: false },
          { id: "cwe_identifier", label: "CWE Identifier", alignRight: false },
          { id: "language", label: "Language", alignRight: false },
          { id: "bleu_score", label: "BLEU Score", alignRight: false },
          { id: "icd_result", label: "ICD Result", alignRight: false }
        ]
        : []; // Default to an empty array if no type matches

  const renderRowData = (row: any, index: any) => {
    if (type === "mitre") {
      const judgeOutput = row.judge_response?.outputs?.[0] || {};
      const text = judgeOutput.text || "Not Available";
      const stopReason = judgeOutput.stop_reason || "Not Available";

      return (
        <TableRow hover key={ index } tabIndex={ -1 }>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.test_case_prompt }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { text }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { stopReason }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.mitre_category }
          </TableCell>
        </TableRow>
      );
    } else if (type === "autocomplete" || type === "instruct") {
      return (
        <TableRow hover key={ index } tabIndex={ -1 }>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.test_case_prompt }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.cwe_identifier }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.language }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.bleu_score }
          </TableCell>
          <TableCell align="left" sx={ { fontSize: "13px" } }>
            { row.icd_result }
          </TableCell>
        </TableRow>
      );
    }
    return null; // If type doesn't match, return nothing
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
          { report
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => renderRowData(row, index)) }
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={ [15, 30, 45] }
        component="div"
        count={ report.length }
        rowsPerPage={ rowsPerPage }
        page={ page }
        onPageChange={ handleChangePage }
        onRowsPerPageChange={ handleChangeRowsPerPage }
      />
    </TableContainer>
  );
}
