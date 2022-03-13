import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  CircularProgress,
  createStyles,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { useAppNav } from '../../contexts/appNavContext';
import { useReferrals } from '../../contexts/referralsContext';
import {
  FIRST_LANGUAGE,
  INTERFACE_LANGUAGE,
  REFEREE_NAME,
  REFERRER_EMAIL,
  REFERRER_NAME,
} from '../../config/textConstants';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    docked: {
      top: 48,
      width: '30%',
      overflowY: 'unset',
      height: 'calc(100vh - 30px)',
    },
    dockedWithMenuDrawer: {
      width: 'calc((100vw - 150px) * 0.3)',
    },
    list: {
      overflowY: 'auto',
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
    deleteButton: {
      color: palette.error.main,
    },
    spinnerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

const ReferralDrawer = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { showReferralDrawer, showMenuDrawer, setShowReferralDrawer } =
    useAppNav();
  const { extendedReferral, fetchingReferral } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();
  const getReferrer = (referrer: string, org?: string): string => {
    let str = referrer;
    if (org) {
      str += `, of ${org}`;
    }
    return str;
  };

    console.log(extendedReferral);

    // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
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
        <List classes={{ root: styles.list }}>
          <ListItem>
            <ListItemText
              primary={REFEREE_NAME}
              secondary={extendedReferral.refereeName}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={FIRST_LANGUAGE}
              secondary={extendedReferral.firstLanguage.language}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={INTERFACE_LANGUAGE}
              secondary={extendedReferral.uiLanguage}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={REFERRER_NAME}
              secondary={getReferrer(
                extendedReferral.referrerName,
                extendedReferral.orgName
              )}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={REFERRER_EMAIL}
              secondary={extendedReferral.referrerEmail}
            />
          </ListItem>
        </List>
      )}
    </Drawer>
  );
};

export default ReferralDrawer;
