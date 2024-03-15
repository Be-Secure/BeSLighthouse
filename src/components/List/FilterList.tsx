import * as React from 'react';
import { Box, type BoxProps, List, Typography } from "@mui/material";

export const FilterList = (props: FilterListProps) => {
  const { label, icon, children, ...rest }: any = props;
  return (
    <Box { ...rest }>
      <Box mt={ 2 } display="flex" alignItems="center">
        <Box mr={ 1 }>{ icon }</Box>
        <Typography variant="overline">{ label }</Typography>
      </Box>
      <List dense disablePadding>
        { children }
      </List>
    </Box>
  );
};

export interface FilterListProps extends BoxProps {
  label: string;
  icon?: React.ReactNode;
}
