import * as React from "react";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { TabForMoi } from "./TabForMoi";

export default function ScrollableTabsButtonVisibleML({
  filter,
  setFilter
}: any) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={ {
        flexGrow: 1,
        maxWidth: "100%",
        mx: { xs: 2, lg: 3 }
      } }
      pt={ 1 }
    >
      <Tabs
        value={ value }
        onChange={ handleChange }
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={ {
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 }
          },
          height: "43px"
        } }
        style={ { backgroundColor: "white" } }
      >
        <TabForMoi filter={ filter } setFilter={ setFilter } />
      </Tabs>
    </Box>
  );
}
