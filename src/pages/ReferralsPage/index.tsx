import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import React, { useState } from 'react';

import WithNavbar from '../../components/WithNavbar';
import { LEARNERS_TAB, PARTNERS_TAB } from '../../config/textConstants';
import { useAppNav } from '../../contexts/appNavContext';
import { useReferrals } from '../../contexts/referralsContext';
import ReferralsTable from './ReferralsTable';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    referralsContainer: {
      height: '100%',
      width: '100%',
    },
    tabs: {
      width: '100%',
      backgroundColor: palette.common.white,
    },
  })
);

const ReferralsPage = () => {
  // ----------------------------- Component state ------------------------------ //
  const [tab, setTab] = useState(0);

  // ----------------------------- Hooks ---------------------------------------- //
  const { showReferralDrawer, setShowReferralDrawer } = useAppNav();
  const { learnerReferrals, partnerReferrals } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  // ----------------------------- Effects ---------------------------------------- //
  return (
    <div className={styles.referralsContainer}>
      <div className={styles.tabs}>
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

        {tab === 0 && <ReferralsTable referrals={learnerReferrals} />}
        {tab === 1 && <ReferralsTable referrals={partnerReferrals} />}
      </div>
    </div>
  );
};

export default WithNavbar(ReferralsPage);
