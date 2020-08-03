import React, { FC, useEffect, useState, useCallback } from 'react';
import { UserRoles } from '../../@types/enums';
import {
  Drawer,
  makeStyles,
  createStyles,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Theme,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core';
import { useAppNav } from '../../contexts/appNavContext';
import { CloseRounded } from '@material-ui/icons';
import clsx from 'clsx';
import { useUsers } from '../../contexts/usersContext';
import {
  Learner,
  Partner,
  Tutor,
  ExtendedLearner,
  ExtendedPartner,
  ExtendedTutor,
  UserLanguageObject,
} from '../../@types/interfaces';
import usersService from '../../services/usersService';
import ReplaceTutorForm from './ReplaceTutorForm';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
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
    deleteButton: {
      color: palette.error.main,
    },
  })
);

interface UserDrawerProps {
  drawerFor: UserRoles;
}

const UserDrawer: FC<UserDrawerProps> = ({ drawerFor }) => {
  const [extendedUser, setExtendedUser] = useState<ExtendedLearner | ExtendedPartner | ExtendedTutor | undefined>();
  const classes = useStyles();
  const { showUserDrawer, setShowUserDrawer, showMenuDrawer } = useAppNav();
  const {
    learners,
    partners,
    tutors,
    setEmailForPasswordReset,
    fetchTutors,
    fetchPartners,
    fetchLearners,
  } = useUsers();

  const getExtendedUser = useCallback(async (user: Learner | Partner | Tutor) => {
    const response = await usersService.getUser(user);
    response.status === 200 && setExtendedUser({ ...user, ...response.data });
  }, []);

  useEffect(() => {
    let user: Learner | Partner | Tutor | undefined = undefined;
    if (showUserDrawer != null) {
      switch (drawerFor) {
        case UserRoles.learner:
          user = learners?.filter((learner) => learner.id === showUserDrawer)[0];
          break;
        case UserRoles.partner:
          user = partners?.filter((partner) => partner.id === showUserDrawer)[0];
          break;
        case UserRoles.tutor:
          user = tutors?.filter((tutor) => tutor.id === showUserDrawer)[0];
          break;
        default:
      }
    }
    !!user && getExtendedUser(user);
  }, [showUserDrawer, drawerFor, learners, partners, tutors, getExtendedUser]);

  const handleDelete = async (userId: number, userRole: UserRoles) => {
    const response = await usersService.deleteUser(userId);
    if (response && response.status === 200) {
      alert(response.data);
      setShowUserDrawer(null);
      switch (userRole) {
        case UserRoles.learner:
          fetchLearners();
          break;
        case UserRoles.partner:
          fetchPartners();
          break;
        case UserRoles.tutor:
          fetchTutors();
          break;
        default:
      }
    }
  };

  console.log('extendedUser', extendedUser);

  const stringifyLanguages = (languages: UserLanguageObject[]) => {
    const languagesArray = languages.map((language) => language.language);
    return languagesArray.join(', ');
  };

  return (
    <Drawer
      classes={{ paperAnchorDockedRight: clsx(classes.docked, { [classes.dockedWithMenuDrawer]: showMenuDrawer }) }}
      open={!!showUserDrawer}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: classes.appbar }} position="relative">
        <Toolbar classes={{ dense: classes.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setShowUserDrawer(null)}
            edge="start"
            className={classes.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{!!extendedUser ? extendedUser.id : '...'}</Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText primary="Display name" secondary={extendedUser ? extendedUser.displayName : '...'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Email" secondary={extendedUser ? extendedUser.email : '...'} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="First language"
            secondary={extendedUser ? stringifyLanguages(extendedUser.firstLanguages) : '...'}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Interface language" secondary={extendedUser ? extendedUser.uiLanguage : '...'} />
        </ListItem>
        {!!extendedUser && extendedUser.userRole !== UserRoles.tutor && (
          <ListItem>
            <ListItemText
              primary="Current Activities"
              secondary={extendedUser ? extendedUser.numberOfActivities : '...'}
            />
          </ListItem>
        )}
        {!!extendedUser && <ReplaceTutorForm />}
        {!!extendedUser && (
          <ListItem>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() => !!extendedUser && setEmailForPasswordReset(extendedUser.email)}
              data-test="reset-password-button"
            >
              RESET PASSWORD
            </Button>
          </ListItem>
        )}

        {!!extendedUser && (
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              classes={{ root: classes.deleteButton }}
              onClick={() => !!extendedUser && handleDelete(extendedUser.id, drawerFor)}
              data-test="add-user-button"
            >
              DELETE
            </Button>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default UserDrawer;
