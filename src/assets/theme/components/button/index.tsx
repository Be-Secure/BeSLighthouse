import root from "../../components/button/root";
import contained from "../../components/button/contained";
import outlined from "../../components/button/outlined";
import text from "../../components/button/text";

export default {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: { ...root },
    contained: { ...contained.base },
    containedSizeSmall: { ...contained.small },
    containedSizeLarge: { ...contained.large },
    containedPrimary: { ...contained.primary },
    containedSecondary: { ...contained.secondary },
    outlined: { ...outlined.base },
    outlinedSizeSmall: { ...outlined.small },
    outlinedSizeLarge: { ...outlined.large },
    outlinedPrimary: { ...outlined.primary },
    outlinedSecondary: { ...outlined.secondary },
    text: { ...text.base },
    textSizeSmall: { ...text.small },
    textSizeLarge: { ...text.large },
    textPrimary: { ...text.primary },
    textSecondary: { ...text.secondary },
  },
};
