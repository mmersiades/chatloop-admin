import React, { FC, Dispatch, SetStateAction } from 'react';
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

const useStyles = makeStyles(({ mixins, palette }: Theme) =>
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

interface IMenuDrawerProps {
  showMenuDrawer: boolean;
  setShowMenuDrawer: Dispatch<SetStateAction<boolean>>;
}

const MenuDrawer: FC<IMenuDrawerProps> = ({ showMenuDrawer, setShowMenuDrawer }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  return (
    <Drawer classes={{ paper: classes.drawerPaper }} variant="persistent" anchor="left" open={showMenuDrawer}>
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setShowMenuDrawer(false)}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List dense>
        <ListItem
          classes={location.pathname === '/dashboard' ? { root: classes.selectedItem } : {}}
          button
          component={Link}
          to={{ pathname: '/dashboard', state: 'Dashboard' }}
        >
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          classes={location.pathname === '/users' ? { root: classes.selectedItem } : {}}
          button
          component={Link}
          to={{ pathname: '/users', state: 'Manage Users' }}
        >
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          classes={location.pathname === '/invites' ? { root: classes.selectedItem } : {}}
          button
          component={Link}
          to={{ pathname: '/invites', state: 'Manage Invites' }}
        >
          <ListItemText primary="Invites" />
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem
          classes={location.pathname === '/account-settings' ? { root: classes.selectedItem } : {}}
          button
          component={Link}
          to={{ pathname: '/account-settings', state: 'Account Settings' }}
        >
          <ListItemText primary="Account Settings" />
        </ListItem>
        <ListItem button component={Link} to={{ pathname: '/' }} onClick={(e: any) => authService.logout()}>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </Drawer>
  );
};
export default MenuDrawer;
