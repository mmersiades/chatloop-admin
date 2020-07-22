import React, { useReducer, useEffect, FC } from 'react';
import {
  Tabs,
  Tab,
  Theme,
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@material-ui/core';
import { UsersContext } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import Learners from './Learners';
import Partners from './Partners';
import Tutors from './Tutors';
import WithNavbar from '../../components/WithNavbar';
import { Learner, Partner, Tutor } from '../../@types/interfaces';
import usersService from '../../services/usersService';
import { AxiosResponse } from 'axios';
import AssignTutorsDialog from './AssignTutorsDialog';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    usersContainer: {
      height: '100%',
      width: '100%',
    },
    tabs: {
      width: '100%',
      backgroundColor: palette.common.white,
    },
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

type usersState = {
  learners?: Array<Learner>;
  partners?: Array<Partner>;
  tutors?: Array<Tutor>;
};

export type usersAction =
  | {
      type: 'SET_LEARNERS';
      payload?: Array<Learner>;
    }
  | {
      type: 'SET_PARTNERS';
      payload?: Array<Partner>;
    }
  | {
      type: 'SET_TUTORS';
      payload?: Array<Tutor>;
    };

const usersReducerInitialState: usersState = {
  learners: [],
  partners: [],
  tutors: [],
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

const UsersPage: FC = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(usersReducer, usersReducerInitialState);
  const [tab, setTab] = React.useState(0);
  // The email address of a newly added Learner. Used for adding Tutors to the new Learner
  const [newLearnerEmail, setNewLearnerEmail] = React.useState<string>('');

  const [emailForPasswordReset, setEmailForPasswordReset] = React.useState<string>('');

  const { setShowUserDrawer } = useAppNav();

  const fetchTutors = async () => {
    await usersService.getTutors(dispatch);
  };

  const fetchPartners = async () => {
    await usersService.getPartners(dispatch);
  };

  const fetchLearners = async () => {
    await usersService.getLearners(dispatch);
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

  return (
    <UsersContext.Provider
      value={{
        ...state,
        newLearnerEmail,
        emailForPasswordReset,
        usersDispatch: dispatch,
        fetchLearners,
        fetchPartners,
        fetchTutors,
        setNewLearnerEmail,
        setEmailForPasswordReset,
      }}
    >
      <div className={classes.usersContainer}>
        <div className={classes.tabs}>
          <Tabs
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue);
              setShowUserDrawer(null);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
            TabIndicatorProps={{
              style: { backgroundColor: '#45ecff', height: '8px' },
            }}
          >
            <Tab label="Learners" />
            <Tab label="Partners" />
            <Tab label="Tutors" />
          </Tabs>
        </div>
        {newLearnerEmail && (
          <Dialog open={!!state.tutors && !!newLearnerEmail}>
            <AssignTutorsDialog />
          </Dialog>
        )}
        {!!emailForPasswordReset && (
          <Dialog open={!!emailForPasswordReset} onClose={() => setEmailForPasswordReset('')}>
            <DialogTitle>Reset Password?</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to reset <span className={classes.highlightSpan}>{emailForPasswordReset}</span>
                's password?
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
        {tab === 0 && <Learners />}
        {tab === 1 && <Partners />}
        {tab === 2 && <Tutors />}
      </div>
    </UsersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
