import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { FormikValues, Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { UserRoles, TutorShifts } from '../../@types/enums';
import usersService from '../../services/usersService';
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
  Dialog,
  Paper,
  makeStyles,
  Theme,
  createStyles,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@material-ui/core';
import AssignTutorsDialog from './AssignTutorsDialog';
import { handleError } from '../../helpers/handleError';
import { AxiosResponse } from 'axios';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import clsx from 'clsx';
import { useAppNav } from '../../contexts/appNavContext';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    tableContainer: {
      maxHeight: 'calc(100vh - 160px)',
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
    tableCell: {
      color: palette.common.white,
    },
    helperTextSpacer: {
      height: 20,
    },
    deleteButton: {
      color: palette.error.main,
    },
    highlightSpan: {
      color: palette.secondary.main,
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
  // The email address of a newly added Learner. Used for adding Tutors to the new Learner
  const [newLearnerEmail, setnewLearnerEmail] = useState<string>('');

  // The current table page (for table pagination)
  const [page, setPage] = React.useState(0);

  // The number of rows per table page (for table pagination)
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [emailForPasswordReset, setEmailForPasswordReset] = useState<string>('');

  // From UsersContext
  const { fetchLearners, fetchPartners, fetchTutors, learners, partners, tutors, usersDispatch } = useUsers();

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (userId: number, userRole: UserRoles) => {
    const response = await usersService.deleteUser(userId);
    if (response && response.status === 200) {
      alert(response.data);
      switch (userRole) {
        case UserRoles.learner:
          fetchLearners();
          break;
        case UserRoles.partner:
          fetchPartners();
          break;
        case UserRoles.tutor:
          fetchTutors();
          break;
        default:
      }
    }
  };

  const handlePasswordReset = async (email: string) => {
    const response: AxiosResponse | undefined = await usersService.resetPassword(email);

    if (response && response.status === 200) {
      alert(`${response.data.status}. ${response.data.message}`);
    } else {
      alert('Password NOT reset. Something went wrong');
      console.log('response', response);
    }

    setEmailForPasswordReset('');
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
          getUser: () => usersService.getLearners(usersDispatch),
          action: 'SET_LEARNERS',
          count: learners?.length || 0,
          rows:
            rowsPerPage > 0
              ? learners?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || []
              : learners || [],
        };
        break;
      case UserRoles.partner:
        roleParams = {
          role: 'partner',
          getUser: () => usersService.getPartners(usersDispatch),
          action: 'SET_PARTNERS',
          count: partners?.length || 0,
          rows:
            rowsPerPage > 0
              ? partners?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || []
              : partners || [],
        };
        break;
      case UserRoles.tutor:
        roleParams = {
          role: 'tutor',
          getUser: () => usersService.getTutors(usersDispatch),
          action: 'SET_TUTORS',
          count: tutors?.length || 0,
          rows:
            rowsPerPage > 0 ? tutors?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [] : tutors || [],
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
        ? Yup.string().oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift').required('Shift must be selected')
        : Yup.string().oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift'),
  });

  return (
    <>
      {newLearnerEmail && (
        <Dialog open={!!tutors && !!newLearnerEmail}>
          <AssignTutorsDialog newLearnerEmail={newLearnerEmail} setnewLearnerEmail={setnewLearnerEmail} />
        </Dialog>
      )}
      {!!emailForPasswordReset && (
        <Dialog open={!!emailForPasswordReset} onClose={() => setEmailForPasswordReset('')}>
          <DialogTitle>Reset Password?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to reset <span className={classes.highlightSpan}>{emailForPasswordReset}</span>'s
              password?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmailForPasswordReset('')}>CANCEL</Button>
            <Button color="secondary" variant="contained" onClick={() => handlePasswordReset(emailForPasswordReset)}>
              RESET
            </Button>
          </DialogActions>
        </Dialog>
      )}
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
              await usersService.createUser(newUser);
            } catch (error) {
              handleError(error);
            }
            actions.resetForm();
            tableFor === UserRoles.learner && setnewLearnerEmail(values.email);
            await roleParams.getUser();
          } else {
            throw new Error('Submit called without values');
          }
        }}
      >
        {(props: FormikProps<FormikValues>) => {
          const disableButton =
            props.isSubmitting || !!props.errors.displayName || !!props.errors.email || !!props.errors.shift;
          return (
            <Form>
              <TableContainer
                classes={{ root: clsx(classes.tableContainer, { [classes.tableContainerShift]: showUserDrawer }) }}
                component={Paper}
              >
                <Table size="small">
                  <TableHead classes={{ root: classes.tableHead }}>
                    <TableRow>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        id
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        displayName
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        email
                      </TableCell>
                      {tableFor === UserRoles.tutor && (
                        <TableCell classes={{ root: classes.tableCell }} align="center">
                          shift
                        </TableCell>
                      )}
                      <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">
                        <div className={classes.helperTextSpacer} />
                        <Button type="submit" variant="contained" color="secondary" disabled={disableButton}>
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
                                <FormHelperText error>{props.errors.displayName}</FormHelperText>
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
                                <FormHelperText error>{props.errors.email}</FormHelperText>
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
                              <TableCell classes={{ root: classes.tableCell }} align="center">
                                <div className={classes.helperTextSpacer} />
                                <Select {...field} fullWidth variant="outlined">
                                  <MenuItem value={TutorShifts.one}>Shift One</MenuItem>
                                  <MenuItem value={TutorShifts.two}>Shift Two</MenuItem>
                                </Select>
                                {props.errors.shift ? (
                                  <FormHelperText error>{props.errors.shift}</FormHelperText>
                                ) : (
                                  <div className={classes.helperTextSpacer} />
                                )}
                              </TableCell>
                            )
                          );
                        }}
                      </Field>
                      <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                    </TableRow>
                    {roleParams.rows.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell align="center" onClick={() => setShowUserDrawer(user.id)}>
                          {user.id}
                        </TableCell>
                        <TableCell align="center" onClick={() => setShowUserDrawer(user.id)}>
                          {user.displayName}
                        </TableCell>
                        <TableCell align="center" onClick={() => setShowUserDrawer(user.id)}>
                          {user.email}
                        </TableCell>
                        {tableFor === UserRoles.tutor && <TableCell align="center">{user.shift}</TableCell>}
                        <TableCell align="center">
                          <Button
                            color="secondary"
                            onClick={() => setEmailForPasswordReset(user.email)}
                            data-test="reset-password-button"
                            size="small"
                          >
                            RESET PASSWORD
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            classes={{ root: classes.deleteButton }}
                            onClick={() => handleDelete(user.id, tableFor)}
                            data-test="add-user-button"
                            size="small"
                          >
                            DELETE
                          </Button>
                        </TableCell>
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
