import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React from "react";
import axios from "axios";
import { Tooltip, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const TABLE_HEAD = [
  { id: "attackType", label: "Attack Type", alignRight: false },
  { id: "riskPosture", label: "Risk Posture", alignRight: false },
  { id: "defenceAvailable", label: "Defence Available", alignRight: false }
];

export async function checkFileExists(url: string, status: any) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      status(true);
    } else {
      status(false);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      status(false);
    } else {
      status(false);
    }
  }
}

function riskPosture(attackMap: any, name: any) {
  try {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        { attackMap[name].vulnerability.overview.Alert }
      </TableCell>
    );
  } catch (e) {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        NA
        <Tooltip title="Not Analyzed">
          <Icon
            sx={ {
              verticalAlign: "top", // Aligns the icon to the top
              fontSize: "14px",      // Adjust icon size
              marginLeft: "4px",     // Adds space between 'NA' and icon
              cursor: "pointer",
              color: "#607D8B"
            } }
          >
            <InfoOutlinedIcon />
          </Icon>
        </Tooltip>
      </TableCell>
    );
  }
}

function defenceAvailable(attackMap: any, name: any) {
  if (Object.values(attackMap[name].defence).length > 0) {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        Yes
      </TableCell>
    );
  } else {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        No
      </TableCell>
    );
  }
}

const AdversarialAttackSummary = ({ attackMap }: any) => {
  const attackName = ["Evasion", "Extraction", "Inference", "Data Poisoning"];

  return (
    <>
      <TableContainer sx={ { minHeight: '242px', position: 'relative', top: '-14px' } }>
        <Table sx={ { minHeight: '242px' } }>
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
            { attackName.map((nameOfAttack) => {
              return (
                <TableRow hover tabIndex={ -1 }>
                  <TableCell align="left" sx={ { fontSize: "18px" } }>
                    { nameOfAttack }
                  </TableCell>
                  { riskPosture(attackMap, nameOfAttack) }
                  { defenceAvailable(attackMap, nameOfAttack) }
                </TableRow>
              );
            }) }
          </TableBody>
        </Table>
      </TableContainer>
      <Typography component="div" pt={ 2 } pb={ 1 }>
        <Box
          display="flex"
          justifyContent="flex-end"
          sx={ { fontSize: "12px" } }
        >
          Powered by
          <a
            style={ {
              color: "grey",
              cursor: "pointer",
              marginLeft: "4px"
            } }
            href={ `https://www.boschaishield.com/` }
            title={ "Click to view boschaishield webpage" }
            target="_blank"
          >
            Bosch AIShield
          </a>
        </Box>
      </Typography>
    </>
  );
};

export default AdversarialAttackSummary;
