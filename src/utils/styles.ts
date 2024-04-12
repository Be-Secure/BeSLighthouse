import { type Theme } from "@mui/material/styles";

export function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      !personName.includes(name)
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}
