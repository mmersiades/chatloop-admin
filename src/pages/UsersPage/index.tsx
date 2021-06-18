import React, { useReducer, useEffect, FC, useState, useCallback } from 'react';
import {
  Tabs,
  Tab,
  Theme,
  makeStyles,
  createStyles,
  Dialog,
} from '@material-ui/core';
import { UsersContext } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import Learners from './Learners';
import Partners from './Partners';
import Tutors from './Tutors';
import WithNavbar from '../../components/WithNavbar';
import {
  Learner,
  Partner,
  Tutor,
  ExtendedLearner,
  ExtendedPartner,
  ExtendedTutor,
} from '../../@types/interfaces';
import { AxiosResponse } from 'axios';
import AssignTutorsDialog from '../../components/dialogs/AssignTutorsDialog';
import {
  getTutors,
  getPartners,
  getLearners,
  resetPassword,
  getUser,
} from '../../services/usersService';
import {
  LEARNERS_TAB,
  PARTNERS_TAB,
  TUTORS_TAB,
} from '../../config/textConstants';
import ResetPasswordDialog from '../../components/dialogs/ResetPasswordDialog';

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
  const [tab, setTab] = useState(0);
  // The email address of a newly added Learner. Used for adding Tutors to the new Learner
  const [newLearnerEmail, setNewLearnerEmail] = useState<string>('');

  const [emailForPasswordReset, setEmailForPasswordReset] =
    useState<string>('');
  const [extendedUser, setExtendedUser] =
    useState<ExtendedLearner | ExtendedPartner | ExtendedTutor | undefined>();

  const { showUserDrawer, setShowUserDrawer } = useAppNav();

  const fetchTutors = async () => {
    await getTutors(dispatch);
  };

  const fetchPartners = async () => {
    await getPartners(dispatch);
  };

  const fetchLearners = async () => {
    await getLearners(dispatch);
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

  const getExtendedUser = useCallback(
    async (user: Learner | Partner | Tutor) => {
      const response = await getUser(user.id);
      response.status === 200 && setExtendedUser({ ...user, ...response.data });
    },
    []
  );

  useEffect(() => {
    let user: Learner | Partner | Tutor | undefined = undefined;
    if (showUserDrawer != null) {
      switch (tab) {
        case 0:
          user = state.learners?.filter(
            (learner) => learner.id === showUserDrawer
          )[0];
          break;
        case 1:
          user = state.partners?.filter(
            (partner) => partner.id === showUserDrawer
          )[0];
          break;
        case 2:
          user = state.tutors?.filter(
            (tutor) => tutor.id === showUserDrawer
          )[0];
          break;
        default:
      }
      !!user && getExtendedUser(user);
    }
  }, [showUserDrawer, tab, state, getExtendedUser]);

  const handlePasswordReset = async (email: string) => {
    const response: AxiosResponse | undefined = await resetPassword(email);

    if (response && response.status === 200) {
      alert(`${response.data.status}. ${response.data.message}`);
    } else {
      alert('Password NOT reset. Something went wrong');
      console.log('response', response);
    }

    setEmailForPasswordReset('');
  };

  const refreshExtendedUser = async (userId: number) => {
    const response = await getUser(userId);
    response.status === 200 &&
      setExtendedUser({ ...extendedUser, ...response.data });
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
            <Tab label={LEARNERS_TAB} />
            <Tab label={PARTNERS_TAB} />
            <Tab label={TUTORS_TAB} />
          </Tabs>
        </div>
        {newLearnerEmail && (
          <Dialog open={!!state.tutors && !!newLearnerEmail}>
            <AssignTutorsDialog />
          </Dialog>
        )}
        {!!emailForPasswordReset && (
          <ResetPasswordDialog
            open={!!emailForPasswordReset}
            email={emailForPasswordReset}
            handleClose={() => setEmailForPasswordReset('')}
            handleReset={() => handlePasswordReset(emailForPasswordReset)}
          />
        )}
        {tab === 0 && (
          <Learners
            extendedUser={extendedUser as ExtendedLearner}
            refreshExtendedUser={refreshExtendedUser}
          />
        )}
        {tab === 1 && (
          <Partners extendedUser={extendedUser as ExtendedPartner} />
        )}
        {tab === 2 && <Tutors extendedUser={extendedUser as ExtendedTutor} />}
      </div>
    </UsersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
