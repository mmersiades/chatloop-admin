import React, { FC, useState } from 'react';
import clsx from 'clsx';
import {
  AppBar,
  Button,
  createStyles,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

import DeleteUserDialog from '../../components/dialogs/DeleteUserDialog';
import { ShowReplaceTutorDialog } from './Learners';
import { useAppNav } from '../../contexts/appNavContext';
import { useUsers } from '../../contexts/usersContext';
import { UserRole } from '../../@types/enums';
import {
  ExtendedUser,
  hasFirstLanguage,
  hasNumberOfActivities,
  Tutor,
} from '../../@types/interfaces';
import stringifyLanguages from '../../helpers/stringifyLanguages';
import {
  CURRENT_ACTIVITIES,
  CURRENT_LEARNERS,
  DELETE,
  DISPLAY_NAME,
  EMAIL,
  FIRST_LANGUAGE,
  INTERFACE_LANGUAGE,
  REPLACE_TUTOR,
  RESET_PASSWORD,
  SHIFT_ONE_TUTOR,
  SHIFT_TWO_TUTOR,
} from '../../config/textConstants';
import ResetPasswordDialog from '../../components/dialogs/ResetPasswordDialog';
import { useDrawerStyles } from '../styles';
import { convertPartnerToTutor } from '../../services/usersService';

const useStyles = makeStyles(() =>
  createStyles({
    docked: {
      top: 96,
      width: '30%',
      overflowY: 'unset',
      height: 'calc(100vh - 96px)',
    },
  })
);

interface UserDrawerProps {
  drawerFor: UserRole;
  extendedUser?: ExtendedUser;
  setShowDialog?: (params: ShowReplaceTutorDialog) => void;
}

const UserDrawer: FC<UserDrawerProps> = ({ extendedUser, setShowDialog }) => {
  const styles = useStyles();
  const drawerStyles = useDrawerStyles();

  // ----------------------------- Component state ------------------------------ //
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  // ----------------------------- Hooks ---------------------------------------- //
  const { showUserDrawer, setShowUserDrawer, showMenuDrawer } = useAppNav();
  const { tutors } = useUsers();

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

  const handleChangeRoleClick = async (partnerId: number) => {
    const success = await convertPartnerToTutor(partnerId);
    if (success) {
      alert("User's role changed to Tutor");
    }
  };

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Drawer
      classes={{
        paperAnchorDockedRight: clsx(styles.docked, {
          [drawerStyles.dockedWithMenuDrawer]: showMenuDrawer,
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
      {showResetPasswordDialog && extendedUser && (
        <ResetPasswordDialog
          open={showResetPasswordDialog}
          user={extendedUser}
          handleClose={() => setShowResetPasswordDialog(false)}
        />
      )}
      <AppBar classes={{ root: drawerStyles.appbar }} position="relative">
        <Toolbar classes={{ dense: drawerStyles.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowUserDrawer(null)}
            edge="start"
            className={drawerStyles.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>{!!extendedUser ? extendedUser.id : '...'}</Typography>
        </Toolbar>
      </AppBar>
      <List classes={{ root: drawerStyles.list }}>
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
        {extendedUser && hasFirstLanguage(extendedUser) && (
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
        )}
        <ListItem>
          <ListItemText
            primary={INTERFACE_LANGUAGE}
            secondary={extendedUser ? extendedUser.uiLanguage : '...'}
          />
        </ListItem>
        {!!extendedUser && hasNumberOfActivities(extendedUser) && (
          <ListItem>
            <ListItemText
              primary={CURRENT_ACTIVITIES}
              secondary={extendedUser ? extendedUser.numberOfActivities : '...'}
            />
          </ListItem>
        )}
        {!!extendedUser && extendedUser.userRole === UserRole.tutor && (
          <ListItem>
            <ListItemText
              primary={CURRENT_LEARNERS}
              secondary={extendedUser ? extendedUser.numberOfLearners : '...'}
            />
          </ListItem>
        )}
        {!!extendedUser &&
          extendedUser.userRole === UserRole.learner &&
          tutors && (
            <ListItem data-testid="shift-one-tutor-box">
              <ListItemText
                primary={<Typography>{SHIFT_ONE_TUTOR}</Typography>}
                disableTypography
                secondary={
                  !!extendedUser && !!extendedUser.shiftOneTutor ? (
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
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
          extendedUser.userRole === UserRole.learner &&
          tutors && (
            <ListItem data-testid="shift-two-tutor-box" divider>
              <ListItemText
                primary={<Typography>{SHIFT_TWO_TUTOR}</Typography>}
                disableTypography
                secondary={
                  !!extendedUser && !!extendedUser.shiftTwoTutor ? (
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
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
        {!!extendedUser && extendedUser.userRole.includes(UserRole.partner) && (
          <ListItem>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() =>
                !!extendedUser && handleChangeRoleClick(extendedUser.id)
              }
              // aria-label="Reset password button"
            >
              Change role to tutor
            </Button>
          </ListItem>
        )}
        {!!extendedUser && (
          <ListItem>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() => !!extendedUser && setShowResetPasswordDialog(true)}
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
              classes={{ root: drawerStyles.deleteButton }}
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
