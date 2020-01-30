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
      width: '100%',
      top: 48,

      backgroundColor: palette.common.white
    },
    tableContainer: {
      margin: spacing(4),
      maxHeight: 'calc(100vh - 144px)'
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
  const [tab, setTab] = useState(0);
  const [showAssignTutors, setShowAssignTutors] = useState(false);
  const [newLearnerEmail, setnewLearnerEmail] = useState();
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    const fetchLearners = async () => {
      const learners = await usersService.getLearners();
      dispatch({ type: 'SET_LEARNERS', payload: learners });
    };

    fetchLearners();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      const partners = await usersService.getPartners();
      dispatch({ type: 'SET_PARTNERS', payload: partners });
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await usersService.getTutors();
      dispatch({ type: 'SET_TUTORS', payload: tutors });
    };

    fetchTutors();
  }, []);

  const generateTable = () => {
    const formikInitialValues: IFormikValues = {
      email: '',
      displayName: ''
    };

    const handleChangePage = (event: any, newPage: any) => {
      setPage(newPage);
    };

    let role = { userRole: '', role: '', getUser: () => {}, action: '', count: 0 };
    switch (tab) {
      case 0:
        role = {
          userRole: UserRoles.learner,
          role: 'learner',
          getUser: usersService.getLearners,
          action: 'SET_LEARNERS',
          count: state.learners ? state.learners.length : 0
        };
        break;
      case 1:
        role = {
          userRole: UserRoles.partner,
          role: 'partner',
          getUser: usersService.getPartners,
          action: 'SET_PARTNERS',
          count: state.partners ? state.partners.length : 0
        };
        break;
      case 2:
        role = {
          userRole: UserRoles.tutor,
          role: 'tutor',
          getUser: usersService.getTutors,
          action: 'SET_TUTORS',
          count: state.tutors ? state.tutors.length : 0
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
          <AssignTutorsDialog tutors={state.tutors} newLearnerEmail={newLearnerEmail} learners={state.learners} />
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

            const response = await usersService.createUser(newUser);
            console.log('response', response);
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
                      </TableRow>
                      {tab === 0 &&
                        state.learners &&
                        state.learners.map((learner: ILearner) => (
                          <TableRow key={learner.id}>
                            <TableCell align="center">{learner.id}</TableCell>
                            <TableCell align="center">{learner.displayName}</TableCell>
                            <TableCell align="center">{learner.email}</TableCell>
                          </TableRow>
                        ))}
                      {tab === 1 &&
                        state.partners &&
                        state.partners.map((partner: IPartner) => (
                          <TableRow key={partner.id}>
                            <TableCell align="center">{partner.id}</TableCell>
                            <TableCell align="center">{partner.displayName}</TableCell>
                            <TableCell align="center">{partner.email}</TableCell>
                          </TableRow>
                        ))}
                      {tab === 2 &&
                        state.tutors &&
                        state.tutors.map((tutor: ITutor) => (
                          <TableRow key={tutor.id}>
                            <TableCell align="center">{tutor.id}</TableCell>
                            <TableCell align="center">{tutor.displayName}</TableCell>
                            <TableCell align="center">{tutor.email}</TableCell>
                            <TableCell align="center">{tutor.shift}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={role.count}
                          rowsPerPage={10}
                          onChangePage={handleChangePage}
                          page={page}
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
      {generateTable()}
    </usersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
