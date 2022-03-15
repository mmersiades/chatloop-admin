import React from 'react';
import clsx from 'clsx';
import {
  AppBar, Button,
  CircularProgress,
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons';

import ReferralForm from "./ReferralForm";
import {useAppNav} from '../../contexts/appNavContext';
import {useReferrals} from '../../contexts/referralsContext';

const useStyles = makeStyles(({spacing, palette}: Theme) =>
  createStyles({
    docked: {
      top: 48,
      width: '30%',
      overflowY: 'unset',
      height: 'calc(100vh - 48px)',
    },
    dockedWithMenuDrawer: {
      width: 'calc((100vw - 150px) * 0.3)',
    },
    closeButton: {
      marginRight: spacing(2),
    },
    appbar: {
      height: 36,
    },
    toolbar: {
      minHeight: 36,
    },
    spinnerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  })
);

const ReferralDrawer = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const {showReferralDrawer, showMenuDrawer, setShowReferralDrawer} =
    useAppNav();
  const {extendedReferral, fetchingReferral} = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

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
      <AppBar classes={{root: styles.appbar}} position="relative">
        <Toolbar classes={{dense: styles.toolbar}} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowReferralDrawer(null)}
            edge="start"
            className={styles.closeButton}
          >
            <CloseRounded/>
          </IconButton>
          <Typography>
            {!!extendedReferral ? extendedReferral.id : '...'}
          </Typography>
        </Toolbar>
      </AppBar>
      {fetchingReferral || !extendedReferral ? (
        <div className={styles.spinnerContainer}>
          <CircularProgress color="primary"/>
        </div>
      ) : (
        <ReferralForm type="edit" extendedReferral={extendedReferral}/>
      )}
    </Drawer>
  );
};

export default ReferralDrawer;
