import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import {
  FormikValues,
  Formik,
  Form,
  Field,
  FieldProps,
  FormikProps,
} from 'formik';
import { UserRoles, TutorShifts } from '../../@types/enums';
import { useUsers } from '../../contexts/usersContext';
import {
  TableContainer,
  Table,
  TableFooter,
  TableRow,
  TablePagination,
  TableBody,
  TableCell,
  Button,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  TableHead,
  Paper,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import { handleError } from '../../helpers/handleError';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import clsx from 'clsx';
import { useAppNav } from '../../contexts/appNavContext';
import { createUser } from '../../services/usersService';

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
    tableCell: {
      color: palette.common.white,
    },
    helperTextSpacer: {
      height: 20,
    },
    deleteButton: {
      color: palette.error.main,
    },
  })
);

const newUserFormInitialValues: FormikValues = {
  email: '',
  displayName: '',
  shift: '',
};

interface UsersTableProps {
  tableFor: UserRoles;
}

/** An object of params passed to `tableGenerator` based on the role of Users the table is for */
interface RoleParams {
  role: string;
  getUser: any;
  action: 'SET_LEARNERS' | 'SET_PARTNERS' | 'SET_TUTORS' | '';
  count: number;
  rows: Array<any>;
}

const UsersTable: FC<UsersTableProps> = ({ tableFor }) => {
  const classes = useStyles();
  const { showUserDrawer, setShowUserDrawer } = useAppNav();

  // The current table page (for table pagination)
  const [page, setPage] = React.useState(0);

  // The number of rows per table page (for table pagination)
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // From UsersContext
  const { learners, partners, tutors, fetchUsersByUserRole } = useUsers();

  const setNewLearnerEmail = (arg: string) => {};

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleParams = (): RoleParams => {
    let roleParams: RoleParams = {
      role: '',
      getUser: () => {},
      action: '',
      count: 0,
      rows: [],
    };

    switch (tableFor) {
      case UserRoles.learner:
        roleParams = {
          role: 'learner',
          getUser: () =>
            !!fetchUsersByUserRole && fetchUsersByUserRole(UserRoles.learner),
          action: 'SET_LEARNERS',
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
      case UserRoles.partner:
        roleParams = {
          role: 'partner',
          getUser: () =>
            !!fetchUsersByUserRole && fetchUsersByUserRole(UserRoles.partner),
          action: 'SET_PARTNERS',
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
      case UserRoles.tutor:
        roleParams = {
          role: 'tutor',
          getUser: () =>
            !!fetchUsersByUserRole && fetchUsersByUserRole(UserRoles.tutor),
          action: 'SET_TUTORS',
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

  const newUserSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(2, 'displayName too short')
      .max(25, 'displayName too long')
      .required('DisplayName is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    shift:
      tableFor === UserRoles.tutor
        ? Yup.string()
            .oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift')
            .required('Shift must be selected')
        : Yup.string().oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift'),
  });

  return (
    <>
      <Formik
        initialValues={newUserFormInitialValues}
        validationSchema={newUserSchema}
        onSubmit={async (values, actions) => {
          if (values.email && values.displayName) {
            const newUser = {
              email: values.email,
              displayName: values.displayName,
              userRole: tableFor,
              shift: values.shift as TutorShifts,
            };

            try {
              await createUser(newUser);
            } catch (error) {
              handleError(error);
            }
            actions.resetForm();
            tableFor === UserRoles.learner && setNewLearnerEmail(values.email);
            await roleParams.getUser();
          } else {
            throw new Error('Submit called without values');
          }
        }}
      >
        {(props: FormikProps<FormikValues>) => {
          const disableButton =
            props.isSubmitting ||
            !!props.errors.displayName ||
            !!props.errors.email ||
            !!props.errors.shift;
          return (
            <Form>
              <TableContainer
                classes={{
                  root: clsx(classes.tableContainer, {
                    [classes.tableContainerShift]: showUserDrawer,
                  }),
                }}
                component={Paper}
              >
                <Table size="small">
                  <TableHead classes={{ root: classes.tableHead }}>
                    <TableRow classes={{ root: classes.tableRow }}>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        id
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        displayName
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        email
                      </TableCell>
                      {tableFor === UserRoles.tutor && (
                        <TableCell
                          classes={{ root: classes.tableCell }}
                          align="center"
                        >
                          shift
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody classes={{ root: classes.tableBody }}>
                    <TableRow classes={{ root: classes.tableRow }}>
                      <TableCell align="center">
                        <div className={classes.helperTextSpacer} />
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          disabled={disableButton}
                        >
                          {`Add ${roleParams.role}`}
                        </Button>
                        <div className={classes.helperTextSpacer} />
                      </TableCell>
                      <Field name="displayName" value="values.displayName">
                        {({ field }: FieldProps<FormikValues>) => {
                          return (
                            <TableCell align="center">
                              <div className={classes.helperTextSpacer} />
                              <TextField
                                {...field}
                                margin="dense"
                                variant="outlined"
                                type="text"
                                fullWidth
                                error={!!props.errors.displayName}
                              />
                              {props.errors.displayName ? (
                                <FormHelperText error>
                                  {props.errors.displayName}
                                </FormHelperText>
                              ) : (
                                <div className={classes.helperTextSpacer} />
                              )}
                            </TableCell>
                          );
                        }}
                      </Field>
                      <Field name="email" value="values.email">
                        {({ field }: FieldProps<FormikValues>) => {
                          return (
                            <TableCell align="center">
                              <div className={classes.helperTextSpacer} />
                              <TextField
                                {...field}
                                margin="dense"
                                variant="outlined"
                                type="text"
                                fullWidth
                                error={!!props.errors.email}
                              />
                              {props.errors.email ? (
                                <FormHelperText error>
                                  {props.errors.email}
                                </FormHelperText>
                              ) : (
                                <div className={classes.helperTextSpacer} />
                              )}
                            </TableCell>
                          );
                        }}
                      </Field>
                      <Field name="shift" value="values.shift">
                        {({ field }: FieldProps<FormikValues>) => {
                          return (
                            tableFor === UserRoles.tutor && (
                              <TableCell
                                classes={{ root: classes.tableCell }}
                                align="center"
                              >
                                <div className={classes.helperTextSpacer} />
                                <Select {...field} fullWidth variant="outlined">
                                  <MenuItem value={TutorShifts.one}>
                                    Shift One
                                  </MenuItem>
                                  <MenuItem value={TutorShifts.two}>
                                    Shift Two
                                  </MenuItem>
                                </Select>
                                {props.errors.shift ? (
                                  <FormHelperText error>
                                    {props.errors.shift}
                                  </FormHelperText>
                                ) : (
                                  <div className={classes.helperTextSpacer} />
                                )}
                              </TableCell>
                            )
                          );
                        }}
                      </Field>
                    </TableRow>
                    {roleParams.rows.map((user: any) => (
                      <TableRow
                        classes={{ root: classes.tableRow }}
                        key={user.id}
                        hover
                        onClick={() => setShowUserDrawer(user.id)}
                      >
                        <TableCell align="center">{user.id}</TableCell>
                        <TableCell align="center">{user.displayName}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        {tableFor === UserRoles.tutor && (
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
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default UsersTable;
