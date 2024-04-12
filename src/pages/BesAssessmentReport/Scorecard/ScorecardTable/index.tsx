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
import { applySortFilter, getComparator } from "../../../../utils/sortFilter";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "score", label: "Score", alignRight: false },
  { id: "reason", label: "Reason", alignRight: false },
  { id: "details", label: "Details", alignRight: false }
];

// Fixme: Code refactor

export default function ScorecardTable({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // eslint-disable-next-line no-unused-vars
  const [filterName, setFilterName] = useState("");
  const scorecardData: any = data?.checks ?? [];
  const filteredUsers = applySortFilter(
    scorecardData,
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
                    score: any;
                    reason: any;
                    details: string[];
                  },
                  index: number
                ) => {
                  const { name, score, reason, details } = row;
                  return (
                    <TableRow hover key={ index } tabIndex={ -1 }>
                      <TableCell
                        align="center"
                        sx={ { paddingLeft: "10px" } }
                        padding="none"
                      >
                        { name }
                      </TableCell>
                      <TableCell align="left">{ score }</TableCell>
                      <TableCell align="left">{ reason }</TableCell>
                      <TableCell align="left">{ details }</TableCell>
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
          count={ scorecardData.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </TableContainer>
    </>
  );
}
