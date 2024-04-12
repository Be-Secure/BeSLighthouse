import * as React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { getStyles } from "../../../utils/styles";

const names = [
  "Client Application (TD-C-CA)",
  "Server (TD-C-S)",
  "Web Application (TD-C-WA)",
  "API clients (TD-C-A)",
  "Database (TD-C-D)",
  "Messaging (TD-C-M)",
  "Distributed Application (TD-C-DA)",
  "Microservices (TD-C-Ms)",
  "Container (TD-C-C)",
  "Wallet App (TD-C-Wlt)"
];

export function TechnologyDomainComposition({ filter, setFilter }: any) {
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
  if (personName?.[0] !== filter.TDC) {
    filter.TDC = personName?.[0];
    setFilter({ ...filter });
  }
  return (
    <div
      style={ {
        width: "100%",
        backgroundColor:
          !personName?.[0] ||
            personName?.[0] === "Technology Domain Composition (TD-C)"
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
              return <>Technology Domain Composition (TD-C)</>;
            }
            return selected.join(", ");
          } }
          style={ { height: "35px" } }
        >
          <MenuItem value="Technology Domain Composition (TD-C)">
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
