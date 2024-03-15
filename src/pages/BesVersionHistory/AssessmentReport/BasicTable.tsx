import React from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

export function createData({ tableData }: any) {

  return [{ tableData }];

}

export function createHeading(tableHeading: string[]) {
  return tableHeading;
}

// Define props interface for the table component
interface TableProps {
  tableData: any[]; // Data to be displayed in the table
  tableHeading: string[]; // Column headers
  tableStyle: any
}

const BasicTable: React.FC<TableProps> = ({ tableData, tableHeading, tableStyle }: any) => {
  return (<>
    <TableContainer component={ Paper } style={ { margin: "10px 40px 50px 40px", borderRadius: "0", height: "80%" } }>
      <Table size="small" aria-label="a dense table" style={ { height: "100%" } }>
        <thead style={ { backgroundColor: "#8585ed", color: "white", position: "sticky", top: 0 } } >

          <tr>
            { tableHeading?.map((column: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
              <th style={ { fontWeight: "normal" } } key={ index }>{ column }</th>
            )) }
          </tr>
        </thead>
        <tbody>
          { tableData?.map((row: { [x: string]: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, rowIndex: any): any => (
            <tr style={ tableStyle }
              key={ rowIndex }
            >
              { tableHeading?.map((column: string | number, colIndex: React.Key | null | undefined) => (
                <td style={ { backgroundColor: rowIndex % 2 === 0 ? '' : '#eaefff' } } key={ colIndex }>{ row[column] }</td>
              )) }
            </tr>
          ))

          }
        </tbody>
      </Table>
    </TableContainer>
  </>
  );
};
export default BasicTable;
