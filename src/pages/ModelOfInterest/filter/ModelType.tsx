import * as React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { getStyles } from "../../../utils/styles";

const names = [
  "Classic",
  "LLM",
  "SLM"
];

export function ModelType({ filter, setFilter }: any) {
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
  if (personName?.[0] !== filter.ModelType) {
    filter.ModelType = personName?.[0];
    setFilter({ ...filter });
  }
  return (
    <div style={ { width: "100%", backgroundColor: (!personName?.[0] || personName?.[0] === 'Model Type') ? "white" : "lightgreen" } }>
      <FormControl sx={ { width: "100%" } }>
        <Select
          multiple={ false }
          displayEmpty
          value={ personName }
          onChange={ handleChange1 }
          input={ <OutlinedInput /> }
          renderValue={ (selected) => {
            if (selected.length === 0) {
              return <>Model Type</>;
            }
            return selected.join(", ");
          } }
          style={ { height: "35px" } }
        >
          <MenuItem value="Model Type">
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
