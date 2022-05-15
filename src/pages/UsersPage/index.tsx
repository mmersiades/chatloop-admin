import React, { FC, useCallback, useEffect, useState } from 'react';
import { createStyles, makeStyles, Tab, Tabs } from '@material-ui/core';
import clsx from 'clsx';

import Learners from './Learners';
import Partners from './Partners';
import Tutors from './Tutors';
import WithNavbar from '../../components/WithNavbar';
import { useUsers } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import {
  ExtendedLearner,
  ExtendedOrgAdmin,
  ExtendedPartner,
  ExtendedReferrer,
  ExtendedTutor,
  Learner,
  OrgAdmin,
  Partner,
  Referrer,
  Tutor,
} from '../../@types/interfaces';
import { getUser } from '../../services/usersService';
import { usePageStyles } from '../styles';
import {
  LEARNERS_TAB,
  ORG_ADMINS_TAB,
  PARTNERS_TAB,
  REFERRERS_TAB,
  TUTORS_TAB,
} from '../../config/textConstants';
import OrgAdmins from './OrgAdmins';
import Referrers from './Referrers';
import { UserRole } from '../../@types/enums';

const useStyles = makeStyles(() =>
  createStyles({
    innerContainer: {
      height: 'unset',
    },
  })
);

const UsersPage: FC = () => {
  const pageStyles = usePageStyles();
  const styles = useStyles();

  // ----------------------------- Component state ------------------------------ //
  const [tab, setTab] = useState(0);

  const [extendedUser, setExtendedUser] = useState<
    | ExtendedLearner
    | ExtendedPartner
    | ExtendedTutor
    | ExtendedOrgAdmin
    | ExtendedReferrer
    | undefined
  >();

  const { showUserDrawer, setShowUserDrawer } = useAppNav();

  // ----------------------------- Hooks ---------------------------------------- //
  const { learners, partners, tutors, orgAdmins, referrers } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const refreshExtendedUser = async (userId: number) => {
    const response = await getUser(userId);
    response.status === 200 &&
      setExtendedUser({ ...extendedUser, ...response.data });
  };

  // ----------------------------- Effects ---------------------------------------- //
  const getExtendedUser = useCallback(
    async (user: Learner | Partner | Tutor | OrgAdmin | Referrer) => {
      const response = await getUser(user.id);
      response.status === 200 && setExtendedUser({ ...user, ...response.data });
    },
    []
  );

  useEffect(() => {
    let user: Learner | Partner | Tutor | OrgAdmin | Referrer | undefined =
      undefined;
    if (showUserDrawer != null) {
      switch (tab) {
        case 0:
          user = learners.filter((learner) => learner.id === showUserDrawer)[0];
          break;
        case 1:
          user = partners.filter((partner) => partner.id === showUserDrawer)[0];
          break;
        case 2:
          user = tutors.filter((tutor) => tutor.id === showUserDrawer)[0];
          break;
        case 3:
          user = orgAdmins.filter(
            (orgAdmin) => orgAdmin.id === showUserDrawer
          )[0];
          break;
        case 4:
          user = referrers.filter(
            (referrer) => referrer.id === showUserDrawer
          )[0];
          break;
        default:
      }
      !!user && getExtendedUser(user);
    }
  }, [
    showUserDrawer,
    tab,
    learners,
    partners,
    tutors,
    orgAdmins,
    referrers,
    getExtendedUser,
  ]);
  console.log('extendedUser', extendedUser);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <div className={pageStyles.container}>
      <div className={clsx(pageStyles.innerContainer, styles.innerContainer)}>
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
          <Tab label={ORG_ADMINS_TAB} />
          <Tab label={REFERRERS_TAB} />
        </Tabs>
      </div>

      {tab === 0 && (
        <Learners
          extendedUser={extendedUser as ExtendedLearner}
          refreshExtendedUser={refreshExtendedUser}
        />
      )}
      {tab === 1 && <Partners extendedUser={extendedUser as ExtendedPartner} />}
      {tab === 2 && <Tutors extendedUser={extendedUser as ExtendedTutor} />}
      {tab === 3 && (
        <OrgAdmins
          extendedUser={
            { ...extendedUser, userRole: UserRole.orgAdmin } as ExtendedOrgAdmin
          }
        />
      )}
      {tab === 4 && (
        <Referrers
          extendedUser={
            { ...extendedUser, userRole: UserRole.referrer } as ExtendedReferrer
          }
        />
      )}
    </div>
  );
};

export default WithNavbar(UsersPage);
