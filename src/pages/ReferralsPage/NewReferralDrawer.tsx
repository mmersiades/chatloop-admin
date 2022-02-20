import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

import NewReferralForm from './NewReferralForm';
import { NEW_REFERRAL_TITLE } from '../../config/textConstants';
import { useAppNav } from '../../contexts/appNavContext';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
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
      height: 48,
    },
    toolbar: {
      minHeight: 48,
    },
  })
);

const NewReferralDrawer = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { showMenuDrawer, showNewReferralForm, setShowNewReferralForm } =
    useAppNav();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
      classes={{
        paperAnchorDockedRight: clsx(styles.docked, {
          [styles.dockedWithMenuDrawer]: showMenuDrawer,
        }),
      }}
      open={showNewReferralForm}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: styles.appbar }} position="relative">
        <Toolbar classes={{ dense: styles.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowNewReferralForm(false)}
            edge="start"
            className={styles.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{NEW_REFERRAL_TITLE}</Typography>
        </Toolbar>
      </AppBar>
      <NewReferralForm />
    </Drawer>
  );
};

export default NewReferralDrawer;
