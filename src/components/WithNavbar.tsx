import React, { useState } from 'react';
import Navbar from './Navbar';
import MenuDrawer from './MenuDrawer';
import { Grid, createStyles, Theme, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    contentContainer: {
      backgroundColor: palette.grey[50],
      flexGrow: 1,
      height: 'calc(100% - 48px)',
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    contentContainerShift: {
      width: `calc(100% - 150px)`,
      marginLeft: 150,
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })
);

interface IWithNavbarProps {}

const withNavbar = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithNavbar = (props: IWithNavbarProps) => {
    const classes = useStyles();
    const [showMenuDrawer, setShowMenuDrawer] = useState(true);

    return (
      <>
        <Navbar showMenuDrawer={showMenuDrawer} setShowMenuDrawer={setShowMenuDrawer} />
        <MenuDrawer showMenuDrawer={showMenuDrawer} setShowMenuDrawer={setShowMenuDrawer} />
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
