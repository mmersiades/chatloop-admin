import React, { FC } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  Drawer,
  IconButton,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useLocation, Link } from 'react-router-dom';
import authService from '../services/authServices';
import { useAppNav } from '../contexts/appNavContext';
import {
  ACCOUNT_SETTINGS,
  DASHBOARD,
  INVITES,
  LOG_OUT,
  USERS,
} from '../config/textConstants';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    drawerPaper: {
      width: 150,
      flexShrink: 0,
    },
    menuNavbar: {
      backgroundColor: palette.common.white,
      color: palette.grey[600],
      shadow: 'none',
    },
    selectedItem: {
      color: palette.secondary.main,
    },
  })
);

const MenuDrawer: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const { showMenuDrawer, setShowMenuDrawer } = useAppNav();

  return (
    <Drawer
      classes={{ paper: classes.drawerPaper }}
      variant="persistent"
      anchor="left"
      open={showMenuDrawer}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setShowMenuDrawer(false)}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List dense>
        <ListItem
          classes={
            location.pathname === '/dashboard'
              ? { root: classes.selectedItem }
              : {}
          }
          button
          component={Link}
          to={{ pathname: '/dashboard' }}
        >
          <ListItemText primary={DASHBOARD} />
        </ListItem>
        <ListItem
          classes={
            location.pathname === '/users' ? { root: classes.selectedItem } : {}
          }
          button
          component={Link}
          to={{ pathname: '/users' }}
        >
          <ListItemText primary={USERS} />
        </ListItem>
        <ListItem
          classes={
            location.pathname === '/invites'
              ? { root: classes.selectedItem }
              : {}
          }
          button
          component={Link}
          to={{ pathname: '/invites' }}
        >
          <ListItemText primary={INVITES} />
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem
          classes={
            location.pathname === '/account-settings'
              ? { root: classes.selectedItem }
              : {}
          }
          button
          component={Link}
          to={{ pathname: '/account-settings' }}
        >
          <ListItemText primary={ACCOUNT_SETTINGS} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={{ pathname: '/' }}
          onClick={(e: any) => authService.logout()}
        >
          <ListItemText primary={LOG_OUT} />
        </ListItem>
      </List>
    </Drawer>
  );
};
export default MenuDrawer;
