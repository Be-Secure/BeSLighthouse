import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import { NavLink } from "react-router-dom";

const TABLE_HEAD = [
  { id: "type", label: "Type", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "organization", label: "Organization", alignRight: false },
  { id: "Created_date", label: "Created date", alignRight: false },
  { id: "size", label: "Size", alignRight: false },
  { id: "access", label: "Access", alignRight: false },
  { id: "license", label: "License", alignRight: false },
  { id: "dependencies", label: "Dependencies", alignRight: false }
];

export default function ModelTable({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    <>
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
            {filteredModel
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: number) => {
                return (
                  <TableRow hover key={index} tabIndex={-1}>
                    <TableCell
                      align="center"
                      sx={{ paddingLeft: "2px" }}
                      padding="none"
                    >
                      {row.type}
                    </TableCell>
                    <TableCell align="left">
                      <NavLink
                        to={{
                          pathname: `/BeSLighthouse/model_report/:${row.name}`,
                          search: ""
                        }}
                        state={{ selectedMenu: row }}
                        style={{ color: "#587f2f", cursor: "pointer" }}
                      >
                        {row.name}
                      </NavLink>
                      {/* </a> */}
                    </TableCell>
                    <TableCell align="left">{row.organization}</TableCell>
                    <TableCell align="left">{row.created_date.value}</TableCell>
                    <TableCell align="left">{row.size}</TableCell>
                    <TableCell align="left">{row.access}</TableCell>
                    <TableCell align="left">{row.license.value}</TableCell>
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}
