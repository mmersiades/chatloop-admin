import React from 'react';
import clsx from 'clsx';

import ReferralDrawer from './ReferralDrawer';
import ReferralsTable from './ReferralsTable';
import AddReferralFab from './AddReferralFab';
import NewReferralDrawer from './NewReferralDrawer';
import WithNavbar from '../../components/WithNavbar';
import { useAppNav } from '../../contexts/appNavContext';
import { usePageStyles } from '../styles';

const ReferralsPage = () => {
  // ----------------------------- Hooks ------------------------------------ //
  const { showReferralDrawer, showNewReferralForm } = useAppNav();

  // ----------------------------- Component functions ---------------------- //
  const styles = usePageStyles();

  // ----------------------------- Effects ---------------------------------- //
  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.innerContainer, {
          [styles.innerContainerShift]:
            showReferralDrawer || showNewReferralForm,
        })}
      >
        <ReferralsTable />
      </div>
      <ReferralDrawer />
      <NewReferralDrawer />
      <AddReferralFab />
    </div>
  );
};

export default WithNavbar(ReferralsPage);
