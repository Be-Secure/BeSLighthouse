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
import { NavLink } from "react-router-dom";

const TABLE_HEAD = [
  { id: "id", label: "Id", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "type", label: "Type", alignRight: false },
  { id: "organization", label: "Organization", alignRight: false },
  { id: "quality_control", label: "Risk Analysis", alignRight: false },
  { id: "created_date", label: "Created On", alignRight: false },
  { id: "dependencies", label: "Dependencies", alignRight: false }
];

export default function ModelTable({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const filteredModel = data;

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
                    minWidth: headCell.id === "type" ? "134px" : ""
                  } }
                >
                  { headCell.label }
                </TableSortLabel>
              </TableCell>
            )) }
          </TableRow>
        </TableHead>
        <TableBody>
          { filteredModel
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: { name: string, type: any, id: number, organization: string, quality_control: any, created_date: any, dependencies: any }, index: number) => {
              return (
                <TableRow hover key={ index } tabIndex={ -1 }>
                  <TableCell align="left">{ row.id }</TableCell>
                  <TableCell align="left">
                    <NavLink
                      to={ {
                        pathname: `/BeSLighthouse/model_report/:${row.name}`,
                        search: `?type=${row.type}`
                      } }
                      state={ { selectedMenu: row } }
                      style={ { color: "#587f2f", cursor: "pointer" } }
                    >
                      { row.name }
                    </NavLink>
                  </TableCell>
                  <TableCell align="left">{ row.type }</TableCell>
                  <TableCell align="left">{ row.organization }</TableCell>
                  <TableCell align="left" style={ { color: "red" } }>
                    { row.quality_control.join(" | ") }
                  </TableCell>
                  <TableCell align="left">{ row.created_date }</TableCell>
                  <TableCell align="left">
                    { row.dependencies.length === 0
                      ? "None"
                      : row.dependencies.join(" | ") }
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
        count={ data.length }
        rowsPerPage={ rowsPerPage }
        page={ page }
        onPageChange={ handleChangePage }
        onRowsPerPageChange={ handleChangeRowsPerPage }
      />
    </TableContainer>
  );
}
