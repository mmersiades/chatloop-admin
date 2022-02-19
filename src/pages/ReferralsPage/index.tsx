import React, { useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';

import ReferralDrawer from './ReferralDrawer';
import ReferralsTable from './ReferralsTable';
import WithNavbar from '../../components/WithNavbar';
import { useAppNav } from '../../contexts/appNavContext';
import { useReferrals } from '../../contexts/referralsContext';
import { LEARNERS_TAB, PARTNERS_TAB } from '../../config/textConstants';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    referralsContainer: {
      height: '100%',
      width: '100%',
    },
    tabs: {
      width: '100%',
      backgroundColor: palette.common.white,
    },
    tabsShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })
);

const ReferralsPage = () => {
  // ----------------------------- Component state ------------------------------ //
  const [tab, setTab] = useState(0);

  // ----------------------------- Hooks ---------------------------------------- //
  const { showReferralDrawer, showNewReferralForm, setShowReferralDrawer } =
    useAppNav();
  const {
    fetchingLearners,
    fetchingPartners,
    learnerReferrals,
    partnerReferrals,
  } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  // ----------------------------- Effects ---------------------------------------- //
  return (
    <div className={styles.referralsContainer}>
      <div
        className={clsx(styles.tabs, {
          [styles.tabsShift]: showReferralDrawer || showNewReferralForm,
        })}
      >
        <Tabs
          value={tab}
          onChange={(event, newValue) => {
            setTab(newValue);
            setShowReferralDrawer(null);
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
        </Tabs>

        {tab === 0 && (
          <ReferralsTable
            referrals={learnerReferrals}
            loading={fetchingLearners}
          />
        )}
        {tab === 1 && (
          <ReferralsTable
            referrals={partnerReferrals}
            loading={fetchingPartners}
          />
        )}
      </div>
      <ReferralDrawer />
    </div>
  );
};

export default WithNavbar(ReferralsPage);
