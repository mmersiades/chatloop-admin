import React, { FC } from 'react';
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
import { useAppNav } from '../../contexts/appNavContext';

export interface UserPageDrawerProps {
  open: boolean;
  title: string;
  children: JSX.Element | JSX.Element[];
  handleCloseDrawer: () => void;
}

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    docked: {
      top: 96,
      width: '30%',
      overflowY: 'unset',
      height: 'calc(100vh - 96px)',
    },
    dockedWithMenuDrawer: {
      width: 'calc((100vw - 150px) * 0.3)',
    },
    // list: {
    //   overflowY: 'auto',
    // },
    closeButton: {
      marginRight: spacing(2),
    },
    appbar: {
      height: 36,
    },
    toolbar: {
      minHeight: 36,
    },
    // deleteButton: {
    //   color: palette.error.main,
    // },
  })
);

const UserPageDrawer: FC<UserPageDrawerProps> = ({
  open,
  title,
  children,
  handleCloseDrawer,
}) => {
  const classes = useStyles();

  // ----------------------------- Hooks ---------------------------------------- //
  const { showMenuDrawer } = useAppNav();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
      classes={{
        paperAnchorDockedRight: clsx(classes.docked, {
          [classes.dockedWithMenuDrawer]: showMenuDrawer,
        }),
      }}
      open={open}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: classes.appbar }} position="relative">
        <Toolbar classes={{ dense: classes.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={handleCloseDrawer}
            edge="start"
            className={classes.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{title}</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Drawer>
  );
};

export default UserPageDrawer;
