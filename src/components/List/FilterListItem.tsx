import { type ListItemProps } from "@mui/material";
import { type ReactElement } from "react";

// export const FilterListItem = memo((props: FilterListItemProps) => {
//     // const {
//     //     label,
//     //     value,
//     //     icon,
//     //     isSelected: getIsSelected = DefaultIsSelected,
//     //     toggleFilter: userToggleFilter = DefaultToogleFilter,
//     //     ...rest
//     // }: any = props;
// })

export interface FilterListItemProps extends Omit<ListItemProps, 'value'> {
    label: string | ReactElement;
    value: any;
    icon?: ReactElement;
    toggleFilter?: (value: any, filter: any) => any;
    isSelected?: (value: any, filter: any)=> boolean
}
