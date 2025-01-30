/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Fade,
  Box,
  Backdrop,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TextField,
  TableSortLabel,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { verifyLink } from "../../utils/verifyLink";
import { besecureEnvironmentMetadata, besecurePlaybookMetadata } from "../../dataStore";
import DetailedEnvironment from "./DetailedEnvironment";
import DetailedPlaybook from "./DetailedPlaybook";

const envPlaybookModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

const ModalForEnvsAndPlaybook = ({ product }: any) => {
  const [open, setOpen] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<{ [key: number]: boolean }>({});
  const [expandedPlaybooks, setExpandedPlaybooks] = useState<{ [key: number]: boolean }>({});
  const [environmentMetadata, setEnvironmentMetadata] = useState<any>({});
  const [playbookMetadata, setPlaybookMetadata] = useState<any>({});

  const [search, setSearch] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchData = async () => {
      await verifyLink(besecureEnvironmentMetadata, setEnvironmentMetadata);
      await verifyLink(besecurePlaybookMetadata, setPlaybookMetadata);
    };
    fetchData();
  }, [product]);
  const toggleExpandDetails = (id: number) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only for the clicked row
    }));
  };

  const toggleExpandPlaybooks = (id: number) => {
    setExpandedPlaybooks((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only for the clicked row
    }));
  };

  const compatibleEnvironments = product?.compatible_environments || [];

  const filteredEnvironments = compatibleEnvironments.filter((env: { name: string }) =>
    env.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Button onClick={ handleOpen } disabled={ filteredEnvironments.length === 0 } size="small" sx={ { fontSize: "15px", color: "black", padding: 0 } }>
        BeS Envs and Playbooks
      </Button>
      <Modal
        open={ open }
        onClose={ handleClose }
        closeAfterTransition
        slots={ { backdrop: Backdrop } }
        slotProps={ { backdrop: { timeout: 500 } } }
      >
        <Fade in={ open }>
          <Box sx={ envPlaybookModalStyle }>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Compatible Environments & Playbooks
            </Typography>
            <TextField
              label="Search Environment"
              variant="outlined"
              fullWidth
              margin="normal"
              value={ search }
              onChange={ (e) => setSearch(e.target.value) }
            />
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
                        Environment
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
                        Environment
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
                        Compatible Playbooks
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { filteredEnvironments.map(
                    (env: { name: string; version: any[]; playbooks: string[] }, index: number) => (
                      <React.Fragment key={ index }>
                        <TableRow>
                          <TableCell sx={ { width: "30%" } } align="left">
                            { env.name }
                          </TableCell>
                          <TableCell sx={ { width: "15%" } } align="left">
                            { env.version.join(", ") }
                          </TableCell>
                          <TableCell sx={ { width: "20%" } } align="left">
                            <Button onClick={ () => toggleExpandDetails(index) } endIcon={ <ExpandMore /> }>
                              { expandedDetails[index] ? "Hide" : "Show" }
                            </Button>
                          </TableCell>
                          <TableCell sx={ { width: "35%" } } align="left">
                            <Button onClick={ () => toggleExpandPlaybooks(index) } endIcon={ <ExpandMore /> }>
                              { expandedPlaybooks[index] ? "Hide" : "Show" }
                            </Button>
                          </TableCell>
                        </TableRow>
                        { /* Details Section */ }
                        { expandedDetails[index] && (
                          <TableRow>
                            <TableCell colSpan={ 4 }>
                              <DetailedEnvironment environmentMetadata={ environmentMetadata } envName={ env.name } />
                            </TableCell>
                          </TableRow>
                        ) }
                        { /* Playbooks Section */ }
                        { expandedPlaybooks[index] && (
                          <TableRow>
                            <TableCell colSpan={ 4 }>
                              <Collapse in={ expandedPlaybooks[index] } timeout="auto" unmountOnExit>
                                <DetailedPlaybook environmentMetadata={ environmentMetadata } envName={ env.name } playbookMetadata={ playbookMetadata } />
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        ) }
                      </React.Fragment>
                    )
                  ) }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalForEnvsAndPlaybook;
