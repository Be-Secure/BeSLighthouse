import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@mui/material";
import { applySortFilter, getComparator } from "../../../utils/sortFilter";

const TABLE_HEAD = [
  { id: "descriiption", label: "Description", alignRight: false },
  { id: "ssl", label: "Severity", alignRight: false },
  { id: "environment", label: "Environment", alignRight: false },
  { id: "Message", label: "Message", alignRight: false },
  { id: "Path", label: "Path", alignRight: false },
  { id: "Start-Line", label: "Start Line", alignRight: false },
  { id: "End-Line", label: "End Line", alignRight: false }
];

// Fixme: Code refactor

export default function CodeQL({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // eslint-disable-next-line no-unused-vars
  const [filterName, setFilterName] = useState("");

  let codeQlData: any;
  if (data?.length) codeQlData = data;
  else codeQlData = [];
  const filteredUsers = applySortFilter(
    codeQlData,
    getComparator("desc", "name"),
    filterName
  );
  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead sx={ { display: "contents" } }>
            <TableRow>
              { TABLE_HEAD.map((headCell: any) => (
                <TableCell
                  sx={ { color: "#637381", backgroundColor: "#F4F6F8" } }
                  key={ headCell.id }
                  align={ headCell.alignRight ? "right" : "left" }
                >
                  <TableSortLabel
                    hideSortIcon
                    style={ {
                      position: "relative",
                      minWidth:
                        headCell.id === "Start-Line" ||
                          headCell.id === "End-Line"
                          ? "110px"
                          : ""
                    } }
                  >
                    { headCell.label }
                  </TableSortLabel>
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: number) => {
                return (
                  <TableRow hover key={ index } tabIndex={ -1 }>
                    <TableCell
                      align="center"
                      sx={ { paddingLeft: "10px" } }
                      padding="none"
                    >
                      { row.rule.description }
                    </TableCell>
                    <TableCell align="left">
                      { row.rule.security_severity_level }
                    </TableCell>
                    <TableCell align="left">
                      { row.most_recent_instance.environment }
                    </TableCell>
                    <TableCell align="left">
                      { row.most_recent_instance.message.text }
                    </TableCell>
                    <TableCell align="left">
                      { row.most_recent_instance.location.path }
                    </TableCell>
                    <TableCell align="left">
                      { row.most_recent_instance.location.start_line }
                    </TableCell>
                    <TableCell align="left">
                      { row.most_recent_instance.location.end_line }
                    </TableCell>
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
          count={ codeQlData.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </TableContainer>
    </>
  );
}
