
import typography from "../../base/typography";
import borders from "../../base/borders";
import { colors } from "../../base/colors";

import pxToRem from "../../functions/pxToRem";

const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;
const { dark } = colors;

export default {
  styleOverrides: {
    root: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      flex: "1 1 auto",
      textAlign: "center",
      maxWidth: "unset !important",
      minWidth: "120px",
      minHeight: "unset !important",
      fontSize: size.md,
      fontWeight: fontWeightRegular,
      textTransform: "none",
      lineHeight: "inherit",
      padding: pxToRem(4),
      borderRadius: borderRadius.lg,
      color: `${dark.main} !important`,
      opacity: "1 !important",

      "& .material-icons, .material-icons-round": {
        marginBottom: "0 !important",
        marginRight: pxToRem(6)
      },

      "& svg": {
        marginBottom: "0 !important",
        marginRight: pxToRem(6)
      },

      "& i.MuiTab-iconWrapper": {
        marginBottom: 0
      }
    },

    labelIcon: {
      paddingTop: pxToRem(4)
    }
  }
} as any;
