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

export default function ModelIntegritySuiteTable() {
  const [report, setReport]: any = useState({});
  let { modelName, modelIntegrityType }: any = useParams();
  const name = modelName.slice(1);
  const modelIntegrity = modelIntegrityType.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      const links = `${besecureMlAssessmentDataStore}/${name}/model-integrity-suite/${name}-model-integrity-suite-detailed-report.json`;
      verifyLink(links, setReport);
    };
    fetchData();
  }, [name]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const TABLE_HEAD = [
    { id: `${modelIntegrity}`, label: `${modelIntegrity}`, alignRight: false },
    { id: "Severity", label: "Severity", alignRight: false },
    { id: "Description", label: "Description", alignRight: false }
  ];

  let count = 1;

  const extractRows = (data: any) => {
    const rows: any = [];
    if (!data || Object.entries(data).length === 0) return rows;

    for (const [severity, descriptions] of Object.entries(data)) {
      if (Array.isArray(descriptions)) {
        descriptions.forEach((description: any) => {
          rows.push({
            detector: count++,
            severity: severity,
            description: description
          });
        });
      }
    }

    return rows;
  };
  // Extract rows only for the specific `modelIntegrity` key in the report
  const rows = report[modelIntegrity] ? extractRows(report[modelIntegrity]) : [];


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
          { rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: { detector: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; severity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
            <TableRow hover key={ index } tabIndex={ -1 }>
              <TableCell align="left" sx={ { fontSize: "13px" } }>{ row.detector }</TableCell>
              <TableCell align="left" sx={ { fontSize: "13px" } }>{ row.severity }</TableCell>
              <TableCell align="left" sx={ { fontSize: "13px" } }>{ row.description }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={ [15, 30, 45] }
        component="div"
        count={ rows.length }
        rowsPerPage={ rowsPerPage }
        page={ page }
        onPageChange={ handleChangePage }
        onRowsPerPageChange={ handleChangeRowsPerPage }
      />
    </TableContainer>
  );
}
