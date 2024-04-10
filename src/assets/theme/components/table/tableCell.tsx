import borders from "../../base/borders";
import { colors } from "../../base/colors";

import pxToRem from "../../functions/pxToRem";

const { borderWidth } = borders;
const { light } = colors;

export default {
  styleOverrides: {
    root: {
      padding: `${pxToRem(4)} ${pxToRem(10)}`,
      borderBottom: `${borderWidth[1]} solid ${light.main}`
    },
  },
};
