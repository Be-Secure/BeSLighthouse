import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const { modelName, llm_type } = useParams();
  const name = modelName?.slice(1) || "";
  const type = llm_type?.slice(1) || "";

  useEffect(() => {
    const fetchData = async () => {
      const url = `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-${type}-test-detailed-report.json`;
      verifyLink(url, setReport);
    };
    fetchData();
  }, [name, type]);

  const TABLE_HEAD = {
    mitre: [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "text", label: "Judge Response" },
      { id: "stop_reason", label: "Stop Reason" },
      { id: "mitre_category", label: "Mitre Category" }
    ],
    interpreter: [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "text", label: "Judge Response" },
      { id: "stop_reason", label: "Stop Reason" },
      { id: "attack_type", label: "Attack Type" }
    ],
    autocomplete: [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "cwe_identifier", label: "CWE Identifier" },
      { id: "language", label: "Language" },
      { id: "bleu_score", label: "BLEU Score" },
      { id: "icd_result", label: "ICD Result" }
    ],
    instruct: [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "cwe_identifier", label: "CWE Identifier" },
      { id: "language", label: "Language" },
      { id: "bleu_score", label: "BLEU Score" },
      { id: "icd_result", label: "ICD Result" }
    ],
    frr: [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "attack_type", label: "Attack Type" },
      { id: "judge_response", label: "Judge Response" }
    ],
    "prompt-injection": [
      { id: "test_case_prompt", label: "Test Case Prompt" },
      { id: "user_input", label: "User Input" },
      { id: "injection_type", label: "Injection Type" },
      { id: "risk_category", label: "Risk Category" },
      { id: "injection_variant", label: "Injection Variant" }
    ],
    "spear-phishing": [
      { id: "dialogue_history", label: "Dialogue History" },
      { id: "goal", label: "Goal" },
      { id: "is_success", label: "Success" }
    ]
  }[type] || [];

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderRowData = (row: any, index: number) => {
    const getValue = (key: string) => {
      if (key === "text" || key === "stop_reason") {
        return row.judge_response?.outputs?.[0]?.[key] || "Not Available";
      }
      return `${row[key]}` || "Not Available";
    };

    return (
      <TableRow hover key={ index } tabIndex={ -1 }>
        { TABLE_HEAD.map(({ id }) => (
          <TableCell key={ id } align="left" sx={ { fontSize: "13px" } }>
            { getValue(id) }
          </TableCell>
        )) }
      </TableRow>
    );
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
          { report.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(renderRowData) }
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
