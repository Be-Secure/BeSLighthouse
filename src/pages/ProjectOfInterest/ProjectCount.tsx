import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { fShortenNumber } from "../../utils/formatNumber";

// import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function ProjectCount({
  title,
  total,
  icon,
  color = "primary",
  sx,
  ...other
}) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx
      }}
      {...other}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5}>
          {icon && <Box>{icon}</Box>}
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography
            style={{
              color: "black",
              fontSize: "80px"
              // position: "relative",
              // top: "-19px"
            }}
            variant="h1"
          >
            {fShortenNumber(total)}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontSize: "20px",
              position: "relative",
              top: "-15px"
              // left: "-60px"
            }}
          >
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

ProjectCount.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number
};
