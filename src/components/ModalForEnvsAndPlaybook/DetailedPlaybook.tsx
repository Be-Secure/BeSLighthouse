import React, { useState } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TableBody,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { ExpandMore} from "@mui/icons-material";
import PlaybookInformation from "./PlaybookInformation";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const DetailedPlaybook = ({environmentMetadata, envName, playbookMetadata}: any) => {
  // Find the selected environment
  const environment = environmentMetadata.environments.find(
    (env: any) => env.name === envName
  );

  // If environment is not found, return a message
  if (!environment) {
    return (
      <Typography variant="body2" color="error">
        Environment "{ envName }" not found.
      </Typography>
    );
  }

  // State for playbook details toggle
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});

  // Function to toggle row expansion
  const toggleRow = (name: string) => {
    setOpenRows((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <TableContainer component={ Paper } sx={ { maxHeight: "50vh", overflow: "auto" } }>
      <Table stickyHeader>
        <TableHead sx={ { display: "contents" } }>
          <TableRow>
            <TableCell
              sx={ { color: "#637381", backgroundColor: "#F4F6F8" } }
              align={ "left" }
            >
              <TableSortLabel
                hideSortIcon
                style={ {
                  position: "relative",
                  minWidth: "110px"
                } }
              >
                Playbook Name
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={ { color: "#637381", backgroundColor: "#F4F6F8" } }
              align={ "left" }
            >
              <TableSortLabel
                hideSortIcon
                style={ {
                  position: "relative",
                  minWidth: "110px"
                } }
              >
                Version
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={ { color: "#637381", backgroundColor: "#F4F6F8" } }
              align={ "left" }
            >
              <TableSortLabel
                hideSortIcon
                style={ {
                  position: "relative",
                  minWidth: "110px"
                } }
              >
                Details
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { environment.compatible_playbooks.map((playbook: any) => (
            <React.Fragment key={ playbook.name }>
              <TableRow>
                <TableCell>{ playbook.name }</TableCell>
                <TableCell>{ playbook.version.join(", ") }</TableCell>
                <TableCell>
                  <Button size="small" onClick={ () => toggleRow(playbook.name) } endIcon={ <ExpandMore /> }>
                    { openRows[playbook.name] ? "Hide" : "Show" }
                  </Button>
                </TableCell>
              </TableRow>
              { /* Collapsible Row for Details */ }
              <TableRow>
                <TableCell colSpan={ 3 } sx={ { paddingBottom: 0, paddingTop: 0 } }>
                  <Collapse in={ openRows[playbook.name] } timeout="auto" unmountOnExit>
                    <Box sx={ { margin: 1 } }>
                      <PlaybookInformation playbookMetadata={ playbookMetadata } playbookName={ playbook.name }/>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailedPlaybook;
