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
  TableBody
} from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    tabs: {
      position: 'absolute',
      width: '100%',
      top: 48,
      backgroundColor: palette.common.white
    },
    tableContainer: {
      margin: spacing(4)
    },
    tableHead: {
      backgroundColor: palette.primary.main
    },
    tableCell: {
      color: palette.common.white
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
    return (
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
          <TableBody>
            {tab === 0 &&
              state.learners &&
              state.learners.map((learners: ILearner) => (
                <TableRow>
                  <TableCell align="center">{learners.id}</TableCell>
                  <TableCell align="center">{learners.displayName}</TableCell>
                  <TableCell align="center">{learners.email}</TableCell>
                </TableRow>
              ))}
            {tab === 1 &&
              state.partners &&
              state.partners.map((partner: IPartner) => (
                <TableRow>
                  <TableCell align="center">{partner.id}</TableCell>
                  <TableCell align="center">{partner.displayName}</TableCell>
                  <TableCell align="center">{partner.email}</TableCell>
                </TableRow>
              ))}
            {tab === 2 &&
              state.tutors &&
              state.tutors.map((tutor: ITutor) => (
                <TableRow>
                  <TableCell align="center">{tutor.id}</TableCell>
                  <TableCell align="center">{tutor.displayName}</TableCell>
                  <TableCell align="center">{tutor.email}</TableCell>
                  <TableCell align="center">{tutor.shift}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  console.log('state', state);
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
