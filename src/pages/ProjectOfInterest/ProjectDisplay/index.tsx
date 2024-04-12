import * as React from "react";

import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import { useState } from "react";

import { projectOfInterestData } from "../../../utils/ProjectOfInterestData";
import SearchPoiList from "../PoiTable/SearchPoiList";
import PoiListHead from "../PoiTable/PoiListHead";
import {
  Industry,
  OpenSourceProjectType,
  SecurityDomain,
  TechnologyDomain,
  TechnologyDomainComposition,
  filterCheck,
  tecStack
} from "../filter/references";
import { applySortFilter, getComparator } from "../../../utils/sortFilter";

const TABLE_HEAD = [
  { id: "id", label: "BeS Id", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "BeSTechStack", label: "BeS Tech Stack", alignRight: false },
  { id: "License", label: "License", alignRight: false }
];

function filterDataBasedOnUserSelecrtionOnTag(
  filterData: any[],
  getUSERLIST: any[]
): any {
  const filteredArray = getUSERLIST.filter((item) =>
    filterData.every((tag) => item.tags.includes(tag))
  );
  return filteredArray;
}

function filterDataBasedOnUserSelecrtionOnLanguage(
  languageName: string,
  getUSERLIST: any[]
): any {
  const filteredArray = getUSERLIST.filter((item) =>
    item.language[languageName]
  );
  return filteredArray;
}

function filterDataBasedOnUserSelecrtionOnTechStack(
  techStack: string,
  getUSERLIST: any[]
): any {
  const filteredArray = getUSERLIST.filter((item) =>
    item.bes_technology_stack.includes(techStack)
  );
  return filteredArray;
}

export default function ProjectDisplay({ selectedFilter }: any) {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(15);

  let getUSERLIST: any = [];
  if (projectOfInterestData.getPoiData("Project_of_interest")) {
    getUSERLIST = projectOfInterestData.getPoiData("Project_of_interest");
  }
  const filterData: any = [];
  if (
    selectedFilter?.BeSTecStack &&
    !filterCheck[selectedFilter?.BeSTecStack]
  ) {
    getUSERLIST = filterDataBasedOnUserSelecrtionOnTechStack(
      tecStack[selectedFilter?.BeSTecStack],
      getUSERLIST
    );
  }
  if (selectedFilter?.COM && !filterCheck[selectedFilter?.COM]) {
    filterData.push(OpenSourceProjectType[selectedFilter?.COM]);
  }
  if (selectedFilter?.IND && !filterCheck[selectedFilter?.IND]) {
    filterData.push(Industry[selectedFilter?.IND]);
  }
  if (selectedFilter?.SD && !filterCheck[selectedFilter?.SD]) {
    filterData.push(SecurityDomain[selectedFilter?.SD]);
  }
  if (selectedFilter?.TDC && !filterCheck[selectedFilter?.TDC]) {
    filterData.push(TechnologyDomainComposition[selectedFilter?.TDC]);
  }
  if (selectedFilter?.TDU && !filterCheck[selectedFilter?.TDU]) {
    filterData.push(TechnologyDomain[selectedFilter?.TDU]);
  }
  if (selectedFilter?.Languages && !filterCheck[selectedFilter?.Languages]) {
    getUSERLIST = filterDataBasedOnUserSelecrtionOnLanguage(
      selectedFilter?.Languages,
      getUSERLIST
    );
  }
  if (Object.values(filterData).length !== 0) {
    getUSERLIST = filterDataBasedOnUserSelecrtionOnTag(filterData, getUSERLIST);
  }

  const handleFilterByName: any = (event: any) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - getUSERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    getUSERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

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

  const openGithubLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <SearchPoiList
        placeholderName="Search project..."
        filterName={ filterName }
        onFilterName={ handleFilterByName }
      />
      <TableContainer>
        <Table>
          <PoiListHead
            order={ order }
            orderBy={ orderBy }
            headLabel={ TABLE_HEAD }
            rowCount={ getUSERLIST.length }
            onRequestSort={ handleRequestSort }
          />
          <TableBody>
            { filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (row: {
                  id: any;
                  name: string;
                  description: any;
                  bes_technology_stack: any;
                  html_url: string;
                  license: any;
                }) => {
                  const {
                    id,
                    name,
                    description,
                    bes_technology_stack,
                    license,
                    html_url
                  } = row;
                  let licenseName;
                  if (
                    license &&
                    !(license.name === "") &&
                    !(license === "null")
                  ) {
                    licenseName = license.name;
                  } else {
                    licenseName = "Not Available";
                  }
                  return (
                    <TableRow hover key={ id } tabIndex={ -1 }>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={ 2 }>
                          <Typography
                            sx={ {
                              position: "relative",
                              left: "16px"
                            } }
                            variant="subtitle2"
                            noWrap
                          >
                            <Button onClick={ () => { openGithubLink(html_url); } }>
                              { " " }
                              { id }{ " " }
                            </Button>
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <a
                          href={ `/BeSLighthouse/Project-Of-Interest/bes_version_history/:${id}/:${name}` }
                        >
                          { name }{ " " }
                        </a>
                      </TableCell>
                      <TableCell align="left">{ description }</TableCell>
                      <TableCell align="left">{ bes_technology_stack }</TableCell>
                      <TableCell align="left">{ licenseName }</TableCell>
                    </TableRow>
                  );
                }
              ) }
            { emptyRows > 0 && (
              <TableRow style={ { height: 53 * emptyRows } }>
                <TableCell colSpan={ 6 } />
              </TableRow>
            ) }
          </TableBody>
          { isNotFound && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={ 6 } sx={ { py: 3 } }>
                  <Paper
                    sx={ {
                      textAlign: "center",
                      boxShadow: "none"
                    } }
                  >
                    <Typography variant="h6" paragraph>
                      Not found
                    </Typography>

                    <Typography variant="body2">
                      No results found for &nbsp;
                      <strong>&quot;{ filterName }&quot;</strong>.
                      <br /> Try checking for typos or using complete words.
                    </Typography>
                  </Paper>
                </TableCell>
              </TableRow>
            </TableBody>
          ) }
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
          count={ getUSERLIST.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </TableContainer>
    </>
  );
}
