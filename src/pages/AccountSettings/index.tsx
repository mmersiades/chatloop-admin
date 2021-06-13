import React, { useState } from 'react';
import { Element, scroller } from 'react-scroll';
import {
  useTheme,
  makeStyles,
  createStyles,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Grid,
  Theme,
} from '@material-ui/core';
import { EditRounded } from '@material-ui/icons';
import WithNavbar from '../../components/WithNavbar';
import ChangePasswordForm from './ChangePasswordForm';
import { PASSWORD_LABEL } from '../../config/textConstants';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    listContainer: {
      width: '80%',
      backgroundColor: '#fff',
      border: `1px solid ${palette.grey[100]}`,
    },
    root: { width: '100%' },
    popover: {
      padding: spacing(2),
    },
    infoIcon: {
      color: palette.grey[300],
    },
  })
);

const AccountSettingsPage = () => {
  // -------------------------------- Setting up component state ------------------------------------------ //
  /** Should the form to change the User's password be displayed? */
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);

  // -------------------------------- Setting up Material-UI styling ---------------------------------------- //
  const theme = useTheme();
  const classes = useStyles(theme);

  // ------------------------------------------- Component Functions ----------------------------------------- //
  /**
   * Opens form for changing password,
   * scrolls form to near the top of the page
   */
  const handleOpenForm = (element: string) => {
    setShowPasswordForm(true);
    scroller.scrollTo(element, {
      duration: 300,
      delay: 50,
      smooth: true,
      offset: -130,
    });
  };

  // --------------------------------------- Render component ---------------------------------------------- //
  return (
    <div className={classes.listContainer}>
      <List className={classes.root}>
        <Grid container alignItems="center">
          <ListSubheader component="div">Account Settings</ListSubheader>
        </Grid>
        <Element name="password">
          {showPasswordForm ? (
            <ChangePasswordForm
              showForm={showPasswordForm}
              closeForm={() => setShowPasswordForm(false)}
            />
          ) : (
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={PASSWORD_LABEL}
                secondary={
                  <React.Fragment>
                    <Typography component={'span'} variant="h6">
                      ********
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="edit-password-button"
                  onClick={() => handleOpenForm('password')}
                >
                  <EditRounded />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </Element>
      </List>
    </div>
  );
};

export default WithNavbar(AccountSettingsPage);
