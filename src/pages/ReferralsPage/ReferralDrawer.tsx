import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  CircularProgress,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

import ReferralForm from './ReferralForm';
import { useAppNav } from '../../contexts/appNavContext';
import { useReferrals } from '../../contexts/referralsContext';
import { useDrawerStyles } from '../styles';

const ReferralDrawer = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { showReferralDrawer, showMenuDrawer, setShowReferralDrawer } =
    useAppNav();
  const { extendedReferral, fetchingReferral } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useDrawerStyles();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
      data-test="referral-drawer"
      classes={{
        paperAnchorDockedRight: clsx(styles.docked, {
          [styles.dockedWithMenuDrawer]: showMenuDrawer,
        }),
      }}
      open={!!showReferralDrawer}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: styles.appbar }} position="relative">
        <Toolbar classes={{ dense: styles.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowReferralDrawer(null)}
            edge="start"
            className={styles.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>
            {!!extendedReferral ? extendedReferral.id : '...'}
          </Typography>
        </Toolbar>
      </AppBar>
      {fetchingReferral || !extendedReferral ? (
        <div className={styles.spinnerContainer}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <ReferralForm type="edit" extendedReferral={extendedReferral} />
      )}
    </Drawer>
  );
};

export default ReferralDrawer;
