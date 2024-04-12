import * as React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { getStyles } from "../../../utils/styles";

const names = [
  "JavaScript",
  "Python",
  "C",
  "C++",
  "PHP",
  "Java",
  "Shell",
  "Swift",
  "Ruby",
  "TypeScript"
];

export function Languages({ filter, setFilter }: any) {
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
  if (personName?.[0] !== filter.Languages) {
    filter.Languages = personName?.[0];
    setFilter({ ...filter });
  }
  return (
    <div
      style={ {
        width: "100%",
        backgroundColor:
          !personName?.[0] || personName?.[0] === "Languages"
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
              return <>Languages</>;
            }
            return selected.join(", ");
          } }
          style={ { height: "35px" } }
        >
          <MenuItem value="Languages">
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
