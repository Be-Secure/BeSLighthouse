import * as React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { getStyles } from "../../../utils/styles";

const names = [
  "Web Development (TD-U-W)",
  "Artifical Intelligence / Machine Learning (TD-U-AI/ML)",
  "Database (TD-U-Db)",
  "Messaging (TD-U-Msg)",
  "API Development (TD-U-ApD)",
  "Mobile Application (TD-U-MoA)",
  "Desktop Application (TD-U-DkA)",
  "Data Analytics (TD-U-DAA)",
  "IoT (TD-U-IoT)",
  "Blockchain (TD-U-Bln)"
];

export function TechnologyDomain({ filter, setFilter }: any) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const handleChange1 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  if (personName?.[0] !== filter.TDU) {
    filter.TDU = personName?.[0];
    setFilter({ ...filter });
  }
  return (
    <div
      style={ {
        width: "100%",
        backgroundColor:
          !personName?.[0] ||
            personName?.[0] === "Technology Domain (Usage) (TD-U)"
            ? "white"
            : "lightgreen"
      } }
    >
      <FormControl sx={ { width: "100%" } }>
        <Select
          multiple={ false }
          displayEmpty
          value={ personName }
          onChange={ handleChange1 }
          input={ <OutlinedInput /> }
          renderValue={ (selected) => {
            if (selected.length === 0) {
              return <>Technology Domain (Usage) (TD-U)</>;
            }
            return selected.join(", ");
          } }
          style={ { height: "35px" } }
        >
          <MenuItem value="Technology Domain (Usage) (TD-U)">
            <>All</>
          </MenuItem>
          { names.map((name) => (
            <MenuItem
              key={ name }
              value={ name }
              style={ getStyles(name, personName, theme) }
            >
              { name }
            </MenuItem>
          )) }
        </Select>
      </FormControl>
    </div>
  );
}
