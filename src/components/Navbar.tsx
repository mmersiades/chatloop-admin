import React, { FC } from 'react';
import { AppBar, Toolbar, Typography, makeStyles, createStyles, Theme, IconButton, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import connectedUrl from '../serverUrls';
import { useAppNav } from '../contexts/appNavContext';

const useStyles = makeStyles(({ palette, transitions, spacing }: Theme) =>
  createStyles({
    toolbar: {
      minHeight: 48,
    },
    appbar: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: 'unset',
      backgroundColor: palette.common.black,
      transition: transitions.create('left', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    appbarShift: {
      left: 150,
      transition: transitions.create('left', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: spacing(2),
    },
    hide: {
      display: 'none',
    },
  })
);

const Navbar: FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const { showMenuDrawer, setShowMenuDrawer } = useAppNav();
  const title = location.state ? (location.state as string) : 'Chatloop Admin';

  return (
    <>
      <AppBar
        position="absolute"
        classes={{
          positionAbsolute: clsx(classes.appbar, {
            [classes.appbarShift]: showMenuDrawer,
          }),
        }}
      >
        <Toolbar variant="dense">
          <Grid container justify="space-between" alignItems="center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setShowMenuDrawer(true)}
              edge="start"
              className={clsx(classes.menuButton, showMenuDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography>{title}</Typography>
            <Typography>{connectedUrl}</Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </>
  );
};

export default Navbar;
