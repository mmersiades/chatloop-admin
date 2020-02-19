import React, { useReducer, useEffect, useState } from 'react';
import WithNavbar from '../../components/WithNavbar';
import usersContext from '../../contexts/usersContext';
import usersService from '../../services/usersService';
import { ILearner, IPartner, ITutor } from '../../@types/interfaces';
import {
  Tabs,
  Tab,
  Theme,
  makeStyles,
  createStyles,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  FormHelperText,
  Dialog,
  TableFooter,
  TablePagination
} from '@material-ui/core';
import { Formik, FormikProps, FieldProps, Form, Field } from 'formik';
import * as Yup from 'yup';
import { UserRoles } from '../../@types/enums';
import AssignTutorsDialog from './AssignTutorsDialog';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    tabs: {
      position: 'absolute',
      width: 'calc(100vw - 200px)',
      top: 48,

      backgroundColor: palette.common.white
    },
    tableContainer: {
      margin: spacing(4),
      maxHeight: 'calc(100vh - 160px)',
      overflow: 'none'
    },
    tableHead: {
      backgroundColor: palette.primary.main
    },
    tableCell: {
      color: palette.common.white
    },
    helperTextSpacer: {
      height: 20
    },
    tableBody: {
      // height: 500,
      // overflow: 'auto'
    }
  })
);

type usersState = {
  learners?: Array<ILearner>;
  partners?: Array<IPartner>;
  tutors?: Array<ITutor>;
};

type usersAction =
  | {
      type: 'SET_LEARNERS';
      payload?: Array<ILearner>;
    }
  | {
      type: 'SET_PARTNERS';
      payload?: Array<IPartner>;
    }
  | {
      type: 'SET_TUTORS';
      payload?: Array<ITutor>;
    };

interface IFormikValues {
  email: string;
  displayName: string;
}

/** An object of params passed to `tableGenerator` based on the role of Users the table is for */
interface IRoleParams {
  userRole: UserRoles;
  role: string;
  getUser: any;
  action: 'SET_LEARNERS' | 'SET_PARTNERS' | 'SET_TUTORS' | '';
  count: number;
  rows: Array<any>;
}

const usersReducerInitialState: usersState = {
  learners: [],
  partners: [],
  tutors: []
};

const usersReducer = (state: usersState, action: usersAction) => {
  switch (action.type) {
    case 'SET_LEARNERS':
      return { ...state, learners: action.payload };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    case 'SET_TUTORS':
      return { ...state, tutors: action.payload };
    default:
      return state;
  }
};

const UsersPage = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(usersReducer, usersReducerInitialState);
  const [tab, setTab] = React.useState(0);
  const [showAssignTutors, setShowAssignTutors] = useState(false);
  const [newLearnerEmail, setnewLearnerEmail] = useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchTutors = async () => {
    const tutors = await usersService.getTutors();
    dispatch({ type: 'SET_TUTORS', payload: tutors });
  };

  const fetchPartners = async () => {
    const partners = await usersService.getPartners();
    dispatch({ type: 'SET_PARTNERS', payload: partners });
  };

  const fetchLearners = async () => {
    const learners = await usersService.getLearners();
    dispatch({ type: 'SET_LEARNERS', payload: learners });
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    fetchTutors();
  }, []);

  const generateTable = () => {
    if (state.learners && state.partners && state.tutors) {
      const formikInitialValues: IFormikValues = {
        email: '',
        displayName: ''
      };

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

      let role: IRoleParams = {
        userRole: '' as UserRoles,
        role: '',
        getUser: () => {},
        action: '',
        count: 0,
        rows: []
      };
      switch (tab) {
        case 0:
          role = {
            userRole: UserRoles.learner,
            role: 'learner',
            getUser: usersService.getLearners,
            action: 'SET_LEARNERS',
            count: state.learners.length,
            rows:
              rowsPerPage > 0
                ? state.learners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : state.learners
          };
          break;
        case 1:
          role = {
            userRole: UserRoles.partner,
            role: 'partner',
            getUser: usersService.getPartners,
            action: 'SET_PARTNERS',
            count: state.partners.length,
            rows:
              rowsPerPage > 0
                ? state.partners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : state.partners
          };
          break;
        case 2:
          role = {
            userRole: UserRoles.tutor,
            role: 'tutor',
            getUser: usersService.getTutors,
            action: 'SET_TUTORS',
            count: state.tutors.length,
            rows:
              rowsPerPage > 0 ? state.tutors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : state.tutors
          };
          break;
        default:
          break;
      }

      const newUserSchema = Yup.object().shape({
        displayName: Yup.string()
          .min(3, 'displayName too short')
          .max(25, 'displayName too long')
          .required('DisplayName is required'),
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required')
      });

      return (
        <>
          <Dialog open={!!state.tutors && showAssignTutors}>
            <AssignTutorsDialog
              tutors={state.tutors}
              newLearnerEmail={newLearnerEmail}
              learners={state.learners}
              setShowAssignTutors={setShowAssignTutors}
              setnewLearnerEmail={setnewLearnerEmail}
            />
          </Dialog>
          <Formik
            initialValues={formikInitialValues}
            validationSchema={newUserSchema}
            onSubmit={async (values, actions) => {
              const newUser = {
                email: values.email,
                displayName: values.displayName,
                userRole: role.userRole as UserRoles
              };

              await usersService.createUser(newUser);

              const refreshedUsers = await role.getUser();
              // @ts-ignore
              dispatch({ type: role.action, payload: refreshedUsers });
              actions.resetForm();
              setnewLearnerEmail(values.email);
              role.userRole === UserRoles.learner && setShowAssignTutors(true);
            }}
          >
            {(props: FormikProps<IFormikValues>) => {
              const disableButton =
                props.isSubmitting ||
                !props.touched.displayName ||
                !props.touched.email ||
                !!props.errors.displayName ||
                !!props.errors.email;
              return (
                <Form>
                  <TableContainer classes={{ root: classes.tableContainer }} component={Paper}>
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
                          {tab === 2 && (
                            <TableCell classes={{ root: classes.tableCell }} align="center">
                              shift
                            </TableCell>
                          )}
                          <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody classes={{ root: classes.tableBody }}>
                        <TableRow>
                          <TableCell align="center">
                            <Button type="submit" variant="contained" color="secondary" disabled={disableButton}>
                              {`Add ${role.role}`}
                            </Button>
                            <div className={classes.helperTextSpacer} />
                          </TableCell>
                          <Field name="displayName" value="values.displayName">
                            {({ field }: FieldProps<IFormikValues>) => {
                              return (
                                <TableCell align="center">
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
                            {({ field }: FieldProps<IFormikValues>) => {
                              return (
                                <TableCell align="center">
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
                          {tab === 2 && <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>}
                          <TableCell classes={{ root: classes.tableCell }} align="center"></TableCell>
                        </TableRow>
                        {role.rows.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell align="center">{user.id}</TableCell>
                            <TableCell align="center">{user.displayName}</TableCell>
                            <TableCell align="center">{user.email}</TableCell>
                            {tab === 2 && <TableCell align="center">{user.shift}</TableCell>}
                            <TableCell align="center">
                              <Button
                                color="secondary"
                                onClick={() => handleDelete(user.id, role.userRole)}
                                data-test="add-user-button"
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
                            count={role.count}
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
    }
  };

  return (
    <usersContext.Provider value={state}>
      <div className={classes.tabs}>
        <Tabs
          value={tab}
          onChange={(event, newValue) => setTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Learners" />
          <Tab label="Partners" />
          <Tab label="Tutors" />
        </Tabs>
      </div>
      {state.learners && state.partners && state.tutors && generateTable()}
    </usersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
