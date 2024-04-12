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
import { applySortFilter, getComparator } from "../../../utils/sortFilter";

const TABLE_HEAD = [
  { id: "Package Name", label: "Package Name", alignRight: false },
  { id: "Version", label: "Version", alignRight: false },
  { id: "Supplier", label: "Supplier", alignRight: false },
  { id: "Download Location", label: "Download Location", alignRight: false },
  { id: "License", label: "License", alignRight: false }
];

// Fixme: Code refactor

export default function Sbom({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // eslint-disable-next-line no-unused-vars
  const [filterName, setFilterName] = useState("");
  let sonarqubeData: any;
  if (data?.packages) sonarqubeData = data?.packages;
  else sonarqubeData = [];

  const filteredUsers = applySortFilter(
    sonarqubeData,
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
      <TableContainer sx={ { minWidth: 800, color: "red" } }>
        <Table>
          <TableHead sx={ { display: "contents" } }>
            <TableRow>
              { TABLE_HEAD.map((headCell: any) => (
                <TableCell
                  sx={ { color: "#637381", backgroundColor: "#F4F6F8" } }
                  key={ headCell.id }
                  align={ headCell.alignRight ? "right" : "left" }
                >
                  { headCell.label }
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (
                  row: {
                    name: string;
                    versionInfo: string;
                    supplier: string;
                    downloadLocation: string;
                    licenseDeclared: string;
                  },
                  index: number
                ) => {
                  const {
                    name,
                    versionInfo,
                    supplier,
                    downloadLocation,
                    licenseDeclared
                  } = row;
                  return (
                    <TableRow hover key={ index } tabIndex={ -1 }>
                      <TableCell
                        align="left"
                        sx={ { paddingLeft: "15px" } }
                        padding="none"
                      >
                        { name }
                      </TableCell>
                      <TableCell align="left">{ versionInfo }</TableCell>
                      <TableCell align="left">{ supplier }</TableCell>
                      <TableCell align="left">{ downloadLocation }</TableCell>
                      <TableCell align="left">{ licenseDeclared }</TableCell>
                    </TableRow>
                  );
                }
              ) }
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
          count={ sonarqubeData.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </TableContainer>
    </>
  );
}
