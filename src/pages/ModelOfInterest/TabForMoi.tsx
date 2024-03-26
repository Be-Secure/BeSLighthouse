import * as React from "react";
import Tab from "@mui/material/Tab";
import { SecurityDomain } from "./filter/SecurityDomain";
import { ModelType } from "./filter/ModelType";

export function TabForMoi({ filter, setFilter }: any) {
  return (
    <>
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <ModelType filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <SecurityDomain filter={ filter } setFilter={ setFilter } /> }
      />
    </>
  );
}
