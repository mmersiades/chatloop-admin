import React from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core';

import ReferralDrawer from './ReferralDrawer';
import ReferralsTable from './ReferralsTable';
import AddReferralFab from './AddReferralFab';
import NewReferralDrawer from './NewReferralDrawer';
import WithNavbar from '../../components/WithNavbar';
import {useAppNav} from '../../contexts/appNavContext';

const useStyles = makeStyles(({palette, transitions}: Theme) =>
  createStyles({
    referralsContainer: {
      height: '100%',
      width: '100%',
    },
    innerContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: palette.common.white,
    },
    innerContainerShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })
);

const ReferralsPage = () => {

  // ----------------------------- Hooks ---------------------------------------- //
  const {showReferralDrawer, showNewReferralForm} = useAppNav();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  // ----------------------------- Effects ---------------------------------------- //
  return (
    <div className={styles.referralsContainer}>
      <div
        className={clsx(styles.innerContainer, {
          [styles.innerContainerShift]: showReferralDrawer || showNewReferralForm,
        })}
      >
        <ReferralsTable/>
      </div>
      <ReferralDrawer/>
      <NewReferralDrawer/>
      <AddReferralFab/>
    </div>
  );
};

export default WithNavbar(ReferralsPage);
