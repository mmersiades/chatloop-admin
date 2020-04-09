import React, { FC, Dispatch, SetStateAction } from 'react';
import { AppBar, Toolbar, Typography, makeStyles, createStyles, Theme, IconButton, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import connectedUrl from '../serverUrls';

const useStyles = makeStyles(({ palette, transitions, spacing }: Theme) =>
  createStyles({
    toolbar: {
      minHeight: 48,
    },
    appbar: {
      backgroundColor: palette.common.black,
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    appbarShift: {
      width: `calc(100% - 150px)`,
      marginLeft: 150,
      transition: transitions.create(['margin', 'width'], {
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

interface INavbarProps {
  showMenuDrawer: boolean;
  setShowMenuDrawer: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<INavbarProps> = ({ showMenuDrawer, setShowMenuDrawer }: INavbarProps) => {
  const classes = useStyles();
  const location = useLocation();
  // @ts-ignore
  const title = location.state ? location.state : 'Chatloop Admin';

  return (
    <>
      <AppBar
        classes={{
          root: clsx(classes.appbar, {
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
