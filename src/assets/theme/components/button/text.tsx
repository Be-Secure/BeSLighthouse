import { colors } from "../../base/colors";
import typography from "../../base/typography";

import pxToRem from "../../functions/pxToRem";

const { text, info, secondary, transparent } = colors;
const { size } = typography;

export default {
  base: {
    backgroundColor: transparent.main,
    minHeight: pxToRem(40),
    color: text.main,
    boxShadow: "none",
    padding: `${pxToRem(10)} ${pxToRem(24)}`,

    "&:hover": {
      backgroundColor: transparent.main,
      boxShadow: "none",
    },

    "&:focus": {
      boxShadow: "none",
    },

    "&:active, &:active:focus, &:active:hover": {
      opacity: 0.85,
      boxShadow: "none",
    },

    "&:disabled": {
      boxShadow: "none",
    },

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    minHeight: pxToRem(32),
    padding: `${pxToRem(6)} ${pxToRem(16)}`,
    fontSize: size.xs,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    minHeight: pxToRem(47),
    padding: `${pxToRem(12)} ${pxToRem(28)}`,
    fontSize: size.sm,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    color: info.main,

    "&:hover": {
      color: info.main,
    },

    "&:focus:not(:hover)": {
      color: info.focus,
      boxShadow: "none",
    },
  },

  secondary: {
    color: secondary.main,

    "&:hover": {
      color: secondary.main,
    },

    "&:focus:not(:hover)": {
      color: secondary.focus,
      boxShadow: "none",
    },
  },
};
