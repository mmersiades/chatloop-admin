import React, { FC } from 'react';
import { UserRoles } from '../../@types/enums';
import { Drawer, makeStyles, createStyles, AppBar, Toolbar, IconButton, Typography, Theme } from '@material-ui/core';
import { useAppNav } from '../../contexts/appNavContext';
import { CloseRounded } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    docked: {
      top: 96,
      width: '30%',
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
  })
);

interface UserDrawerProps {
  drawerFor: UserRoles;
}

const UserDrawer: FC<UserDrawerProps> = ({ drawerFor }) => {
  const classes = useStyles();
  const { showUserDrawer, setShowUserDrawer, showMenuDrawer } = useAppNav();
  return (
    <Drawer
      classes={{ paperAnchorDockedRight: clsx(classes.docked, { [classes.dockedWithMenuDrawer]: showMenuDrawer }) }}
      open={showUserDrawer}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: classes.appbar }} position="relative">
        <Toolbar classes={{ dense: classes.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setShowUserDrawer(false)}
            edge="start"
            className={classes.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{drawerFor}</Typography>
        </Toolbar>
      </AppBar>
    </Drawer>
  );
};

export default UserDrawer;
