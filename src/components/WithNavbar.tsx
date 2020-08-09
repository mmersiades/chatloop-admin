import React from 'react';
import Navbar from './Navbar';
import MenuDrawer from './MenuDrawer';
import { Grid, createStyles, Theme, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppNav } from '../contexts/appNavContext';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    contentContainer: {
      backgroundColor: palette.grey[50],
      flexGrow: 1,
      position: 'absolute',
      top: 48,
      bottom: 0,
      left: 0,
      right: 0,
      width: 'unset',
      transition: transitions.create('left', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    contentContainerShift: {
      left: 150,
      transition: transitions.create('left', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })
);

interface WithNavbarProps {}

const withNavbar = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithNavbar = (props: WithNavbarProps) => {
    const classes = useStyles();
    const { showMenuDrawer } = useAppNav();

    return (
      <>
        <Navbar />
        <MenuDrawer />
        <Grid
          classes={{
            root: clsx(classes.contentContainer, {
              [classes.contentContainerShift]: showMenuDrawer,
            }),
          }}
          container
          alignItems="center"
          justify="center"
        >
          <WrappedComponent {...(props as P)} />
        </Grid>
      </>
    );
  };
  return WithNavbar;
};

export default withNavbar;
