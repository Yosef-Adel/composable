import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  IconButton,
  MenuItem,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  useTable,
  rowInPage,
  emptyRows,
  getComparator,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from './index';

// Sample data
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 88, align: 'right' },
];

const SAMPLE_DATA = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
  { id: '6', name: 'Diana Martinez', email: 'diana@example.com', role: 'User', status: 'Inactive' },
  { id: '7', name: 'Eve Davis', email: 'eve@example.com', role: 'Manager', status: 'Active' },
  { id: '8', name: 'Frank Garcia', email: 'frank@example.com', role: 'User', status: 'Active' },
];

// Table component
function UserTable() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [filterName, setFilterName] = useState('');

  const dataFiltered = SAMPLE_DATA.filter((row) =>
    row.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !dataFiltered.length && !!filterName;
  const canReset = !!filterName;

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
          action={
            <IconButton color="primary">
              <DeleteIcon />
            </IconButton>
          }
        />

        <TableContainer>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              headLabel={TABLE_HEAD}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <TableRow key={row.id} hover selected={table.selected.includes(row.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={table.selected.includes(row.id)}
                      onClick={() => table.onSelectRow(row.id)}
                    />
                  </TableCell>

                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.status}</TableCell>

                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              <TableEmptyRows
                height={table.dense ? 56 : 76}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

// Loading table component
function LoadingTable() {
  const table = useTable({ defaultRowsPerPage: 5 });

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeadCustom headLabel={TABLE_HEAD} />
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableSkeleton key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePaginationCustom
        page={0}
        count={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </Card>
  );
}

// Stories
const meta = {
  title: 'Components/Table',
  component: UserTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <UserTable />,
};

export const Loading: Story = {
  render: () => <LoadingTable />,
};

export const Empty: Story = {
  render: () => {
    return (
      <Card>
        <TableContainer>
          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              <TableNoData notFound={true} />
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  },
};
