import React, { FC, useState } from 'react';
import clsx from 'clsx';
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
  Grid,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

import DeleteUserDialog from '../../components/dialogs/DeleteUserDialog';
import { ShowReplaceTutorDialog } from './Learners';
import { useAppNav } from '../../contexts/appNavContext';
import { useUsers } from '../../contexts/usersContext';
import { UserRoles } from '../../@types/enums';
import { Tutor, ExtendedUser } from '../../@types/interfaces';
import stringifyLanguages from '../../helpers/stringifyLanguages';
import {
  DISPLAY_NAME,
  EMAIL,
  FIRST_LANGUAGE,
  INTERFACE_LANGUAGE,
  CURRENT_ACTIVITIES,
  CURRENT_LEARNERS,
  SHIFT_ONE_TUTOR,
  REPLACE_TUTOR,
  SHIFT_TWO_TUTOR,
  RESET_PASSWORD,
  DELETE,
} from '../../config/textConstants';

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
  })
);

interface UserDrawerProps {
  drawerFor: UserRoles;
  extendedUser?: ExtendedUser;
  setShowDialog?: (params: ShowReplaceTutorDialog) => void;
}

const UserDrawer: FC<UserDrawerProps> = ({ extendedUser, setShowDialog }) => {
  const classes = useStyles();

  // ----------------------------- Component state ------------------------------ //
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);

  // ----------------------------- Hooks ---------------------------------------- //
  const { showUserDrawer, setShowUserDrawer, showMenuDrawer } = useAppNav();
  const { tutors, setEmailForPasswordReset } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const getTutor = (id: number) => {
    let tutor = {
      id: '...',
      displayName: '...',
      email: '...',
    };
    const tutorFromContext = tutors?.filter(
      (tutor: Tutor) => tutor.id === id
    )[0];

    if (!!tutorFromContext) {
      tutor.id = tutorFromContext.id.toString();
      tutor.displayName = tutorFromContext.displayName;
      tutor.email = tutorFromContext.email;
    }

    return tutor;
  };

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
      classes={{
        paperAnchorDockedRight: clsx(classes.docked, {
          [classes.dockedWithMenuDrawer]: showMenuDrawer,
        }),
      }}
      open={!!showUserDrawer}
      anchor="right"
      variant="persistent"
    >
      {showDeleteUserDialog && extendedUser && (
        <DeleteUserDialog
          open={showDeleteUserDialog}
          user={extendedUser}
          handleClose={() => setShowDeleteUserDialog(false)}
        />
      )}
      <AppBar classes={{ root: classes.appbar }} position="relative">
        <Toolbar classes={{ dense: classes.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowUserDrawer(null)}
            edge="start"
            className={classes.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{!!extendedUser ? extendedUser.id : '...'}</Typography>
        </Toolbar>
      </AppBar>
      <List classes={{ root: classes.list }}>
        <ListItem>
          <ListItemText
            primary={DISPLAY_NAME}
            secondary={extendedUser ? extendedUser.displayName : '...'}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={EMAIL}
            secondary={extendedUser ? extendedUser.email : '...'}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={FIRST_LANGUAGE}
            secondary={
              extendedUser
                ? stringifyLanguages(extendedUser.firstLanguages)
                : '...'
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={INTERFACE_LANGUAGE}
            secondary={extendedUser ? extendedUser.uiLanguage : '...'}
          />
        </ListItem>
        {!!extendedUser && extendedUser.userRole !== UserRoles.tutor && (
          <ListItem>
            <ListItemText
              primary={CURRENT_ACTIVITIES}
              secondary={extendedUser ? extendedUser.numberOfActivities : '...'}
            />
          </ListItem>
        )}
        {!!extendedUser && extendedUser.userRole === UserRoles.tutor && (
          <ListItem>
            <ListItemText
              primary={CURRENT_LEARNERS}
              secondary={extendedUser ? extendedUser.numberOfLearners : '...'}
            />
          </ListItem>
        )}
        {!!extendedUser &&
          extendedUser.userRole === UserRoles.learner &&
          tutors && (
            <ListItem data-testid="shift-one-tutor-box">
              <ListItemText
                primary={<Typography>{SHIFT_ONE_TUTOR}</Typography>}
                disableTypography
                secondary={
                  !!extendedUser && !!extendedUser.shiftOneTutor ? (
                    <Grid container direction="row" justify="space-between">
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftOneTutor).id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftOneTutor).displayName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftOneTutor).email}
                      </Typography>
                      <Button
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        onClick={() => {
                          setShowDialog &&
                            setShowDialog({
                              showDialog: true,
                              oldTutor: parseInt(
                                getTutor(extendedUser.shiftOneTutor).id
                              ),
                              learner: extendedUser.id,
                            });
                        }}
                        data-test="replace-tutor-button"
                      >
                        {REPLACE_TUTOR}
                      </Button>
                    </Grid>
                  ) : (
                    '...'
                  )
                }
              />
            </ListItem>
          )}
        {!!extendedUser &&
          extendedUser.userRole === UserRoles.learner &&
          tutors && (
            <ListItem data-testid="shift-two-tutor-box" divider>
              <ListItemText
                primary={<Typography>{SHIFT_TWO_TUTOR}</Typography>}
                disableTypography
                secondary={
                  !!extendedUser && !!extendedUser.shiftTwoTutor ? (
                    <Grid container direction="row" justify="space-between">
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftTwoTutor).id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftTwoTutor).displayName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getTutor(extendedUser.shiftTwoTutor).email}
                      </Typography>
                      <Button
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        onClick={() =>
                          setShowDialog &&
                          setShowDialog({
                            showDialog: true,
                            oldTutor: parseInt(
                              getTutor(extendedUser.shiftTwoTutor).id
                            ),
                            learner: extendedUser.id,
                          })
                        }
                        aria-label="Replace tutor button"
                      >
                        {REPLACE_TUTOR}
                      </Button>
                    </Grid>
                  ) : (
                    '...'
                  )
                }
              />
            </ListItem>
          )}
        {!!extendedUser && (
          <ListItem>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() =>
                !!extendedUser && setEmailForPasswordReset(extendedUser.email)
              }
              aria-label="Reset password button"
            >
              {RESET_PASSWORD}
            </Button>
          </ListItem>
        )}

        {!!extendedUser && (
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              classes={{ root: classes.deleteButton }}
              onClick={() => setShowDeleteUserDialog(true)}
              aria-label="Delete user button"
            >
              {DELETE}
            </Button>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default UserDrawer;
