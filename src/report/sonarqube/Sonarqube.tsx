import React, { useState } from "react";

import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { applySortFilter, getComparator } from "../../ProjectOfInterestTrack";

const TABLE_HEAD = [
  { id: "Component", label: "Component", alignRight: false },
  { id: "Type", label: "Type", alignRight: false },
  { id: "Messaage", label: "Messaage", alignRight: false },
  { id: "Line", label: "Line", alignRight: false },
];

// Fixme: Code refactor

export default function Sonarqube({ data }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterName, setFilterName] = useState("");

  let sonarqubeData: any;
  if (data?.issues) sonarqubeData = data?.issues;
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
      <Container style={{ padding: "0px", marginTop: "12px" }}>
        <Card>
          <TableContainer sx={{ minWidth: 800, color: "red" }}>
            <Table>
              <TableHead>
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
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(
                    (
                      row: {
                        component: string;
                        type: string;
                        message: string;
                        line: string;
                      },
                      index: number
                    ) => {
                      const { component, type, message, line } = row;
                      return (
                        <TableRow hover key={index} tabIndex={-1}>
                          <TableCell
                            align="left"
                            sx={{ paddingLeft: "15px" }}
                            padding="none"
                          >
                            {component}
                          </TableCell>
                          <TableCell align="left">{type}</TableCell>
                          <TableCell align="left">{message}</TableCell>
                          <TableCell align="left">{line}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{
              ".MuiTablePagination-selectLabel": {
                margin: "auto",
              },
              ".MuiTablePagination-displayedRows": {
                margin: "auto",
              },
            }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sonarqubeData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
