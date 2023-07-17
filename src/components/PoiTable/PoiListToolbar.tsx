import * as React from "react";

import PropTypes from "prop-types";
// @mui
import { styled, alpha } from "@mui/material/styles";
import { Toolbar, OutlinedInput, InputAdornment } from "@mui/material";
import Iconify from "../iconify";
// component

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 0, 0, 0),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }: any) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": {
    width: 420,
    // boxShadow: theme?.customShadows?.z8,
  },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

PoiListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholderName: PropTypes.string
};

export default function PoiListToolbar({
  placeholderName,
  filterName,
  onFilterName,
}: any) {
  return (
    <StyledRoot>
      <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder={placeholderName}
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: "text.disabled", width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
    </StyledRoot>
  );
}
