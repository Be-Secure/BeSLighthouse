import React from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

// Define props interface for the table component
interface TableProps {
  tableData: Array<Record<string, React.ReactNode>>; // Array of objects representing each row of data
  tableHeading: string[]; // Column headers
  tableStyle?: React.CSSProperties; // Optional custom styles for table rows
}

const BasicTable: React.FC<TableProps> = ({ tableData, tableHeading, tableStyle }) => {
  return (
    <TableContainer component={ Paper } style={ { margin: '10px 40px 50px 40px', borderRadius: 0, height: '80%' } }>
      <Table size="small" aria-label="a dense table" style={ { height: '100%' } }>
        <thead style={ { backgroundColor: '#8585ed', color: 'white', position: 'sticky', top: 0 } }>
          <tr>
            { tableHeading.map((column, index) => (
              <th style={ { fontWeight: 'normal' } } key={ index }>
                { column }
              </th>
            )) }
          </tr>
        </thead>
        <tbody>
          { tableData.map((row, rowIndex) => (
            <tr key={ rowIndex } style={ tableStyle }>
              { tableHeading.map((column, colIndex) => (
                <td key={ colIndex } style={ { backgroundColor: rowIndex % 2 === 0 ? '' : '#eaefff' } }>
                  { row[column] }
                </td>
              )) }
            </tr>
          )) }
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;

// Utility functions (if needed)
export const createData = (data: Array<Record<string, React.ReactNode>>) => data;

export const createHeading = (tableHeading: string[]) => tableHeading;
