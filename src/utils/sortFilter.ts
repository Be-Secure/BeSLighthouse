import { filter } from "lodash";

export function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    const search = query.trim();
    return filter(array, (_user: any) => {
      if (_user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        return true;
    });
  }
  return stabilizedThis.map((el: any) => el[0]);
}

function descendingComparator(
  a: Record<string, number>,
  b: Record<string, number>,
  orderBy: string
) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(orderBy: string, field: string) {
  return orderBy === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, field)
    : (a: any, b: any) => -descendingComparator(a, b, field);
}
