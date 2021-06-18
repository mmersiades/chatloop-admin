import React, { useEffect, FC, useState, useCallback } from 'react';
import { Tabs, Tab, Theme, makeStyles, createStyles } from '@material-ui/core';
import { useUsers } from '../../contexts/usersContext';
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
import AssignTutorsDialog from '../../components/dialogs/AssignTutorsDialog';
import { getUser } from '../../services/usersService';
import {
  LEARNERS_TAB,
  PARTNERS_TAB,
  TUTORS_TAB,
} from '../../config/textConstants';

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

const UsersPage: FC = () => {
  const classes = useStyles();

  // ----------------------------- Component state ------------------------------ //
  const [tab, setTab] = useState(0);

  // The email address of a newly added Learner.
  // Used for adding Tutors to the new Learner.
  const [newLearnerEmail /*setNewLearnerEmail*/] = useState<string>('');

  // const [emailForPasswordReset, setEmailForPasswordReset] =
  //   useState<string>('');
  const [extendedUser, setExtendedUser] =
    useState<ExtendedLearner | ExtendedPartner | ExtendedTutor | undefined>();

  const { showUserDrawer, setShowUserDrawer } = useAppNav();

  // ----------------------------- Hooks ---------------------------------------- //
  const { learners, partners, tutors } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const refreshExtendedUser = async (userId: number) => {
    const response = await getUser(userId);
    response.status === 200 &&
      setExtendedUser({ ...extendedUser, ...response.data });
  };

  // ----------------------------- Effects ---------------------------------------- //
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
          user = learners?.filter(
            (learner) => learner.id === showUserDrawer
          )[0];
          break;
        case 1:
          user = partners?.filter(
            (partner) => partner.id === showUserDrawer
          )[0];
          break;
        case 2:
          user = tutors?.filter((tutor) => tutor.id === showUserDrawer)[0];
          break;
        default:
      }
      !!user && getExtendedUser(user);
    }
  }, [showUserDrawer, tab, learners, partners, tutors, getExtendedUser]);

  // ----------------------------- Render ---------------------------------------- //
  return (
    // <UsersContext.Provider
    //   value={{
    //     ...state,
    //     newLearnerEmail,
    //     emailForPasswordReset,
    //     usersDispatch: dispatch,
    //     fetchLearners,
    //     fetchPartners,
    //     fetchTutors,
    //     setNewLearnerEmail,
    //     setEmailForPasswordReset,
    //   }}
    // >
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
        <AssignTutorsDialog open={!!tutors && !!newLearnerEmail} />
      )}

      {tab === 0 && (
        <Learners
          extendedUser={extendedUser as ExtendedLearner}
          refreshExtendedUser={refreshExtendedUser}
        />
      )}
      {tab === 1 && <Partners extendedUser={extendedUser as ExtendedPartner} />}
      {tab === 2 && <Tutors extendedUser={extendedUser as ExtendedTutor} />}
    </div>
    // </UsersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
