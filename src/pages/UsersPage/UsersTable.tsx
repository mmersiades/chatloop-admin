import React, { FC, useState } from 'react';
import clsx from 'clsx';
import {
  TableContainer,
  Table,
  TableFooter,
  TableRow,
  TablePagination,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import AddUserFab from './AddUserFab';
import { useUsers } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import { UserRole } from '../../@types/enums';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    tableContainer: {
      height: 'calc(100vh - 96px)',
      borderRadius: '0px',
      width: '100%',
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    tableContainerShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
    tableHead: {
      backgroundColor: palette.primary.main,
    },
    tableBody: {
      height: 'calc(100vh - 184px)',
      display: 'block',
      overflow: 'auto',
    },
    tableRow: {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    },
    headerTableCell: {
      color: palette.common.white,
    },
  })
);

interface UsersTableProps {
  tableFor: UserRole;
}

// An object of params passed to `tableGenerator`
// based on the role of Users the table is for
interface RoleParams {
  count: number;
  rows: Array<any>;
}

const UsersTable: FC<UsersTableProps> = ({ tableFor }) => {
  const classes = useStyles();

  // ----------------------------- Component state ------------------------------ //
  // The current table page (for table pagination)
  const [page, setPage] = React.useState(0);

  // The number of rows per table page (for table pagination)
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ----------------------------- Hooks ---------------------------------------- //
  const {
    showUserDrawer,
    setShowUserDrawer,
    showNewUserForm,
    setShowNewUserForm,
  } = useAppNav();
  const { learners, partners, tutors } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleParams = (): RoleParams => {
    let roleParams: RoleParams = {
      count: 0,
      rows: [],
    };

    switch (tableFor) {
      case UserRole.learner:
        roleParams = {
          count: learners?.length || 0,
          rows:
            rowsPerPage > 0
              ? learners?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ) || []
              : learners || [],
        };
        break;
      case UserRole.partner:
        roleParams = {
          count: partners?.length || 0,
          rows:
            rowsPerPage > 0
              ? partners?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ) || []
              : partners || [],
        };
        break;
      case UserRole.tutor:
        roleParams = {
          count: tutors?.length || 0,
          rows:
            rowsPerPage > 0
              ? tutors?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ) || []
              : tutors || [],
        };
        break;
      default:
        break;
    }

    return roleParams;
  };

  const roleParams = getRoleParams();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <>
      <TableContainer
        classes={{
          root: clsx(classes.tableContainer, {
            [classes.tableContainerShift]: showUserDrawer || showNewUserForm,
          }),
        }}
        component={Paper}
      >
        <Table size="small">
          <TableHead classes={{ root: classes.tableHead }}>
            <TableRow classes={{ root: classes.tableRow }}>
              <TableCell classes={{ root: classes.headerTableCell }} align="center">
                id
              </TableCell>
              <TableCell classes={{ root: classes.headerTableCell }} align="center">
                displayName
              </TableCell>
              <TableCell classes={{ root: classes.headerTableCell }} align="center">
                email
              </TableCell>
              {tableFor === UserRole.tutor && (
                <TableCell classes={{ root: classes.headerTableCell }} align="center">
                  shift
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody classes={{ root: classes.tableBody }}>
            {roleParams.rows.map((user: any) => (
              <TableRow
                classes={{ root: classes.tableRow }}
                key={user.id}
                hover
                onClick={() => {
                  setShowNewUserForm(false);
                  setShowUserDrawer(user.id);
                }}
              >
                <TableCell align="center">{user.id}</TableCell>
                <TableCell align="center">{user.displayName}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                {tableFor === UserRole.tutor && (
                  <TableCell align="center">{user.shift}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={roleParams.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <AddUserFab
        fabFor={tableFor}
        handleClick={() => setShowNewUserForm(!showNewUserForm)}
      />
    </>
  );
};

export default UsersTable;
