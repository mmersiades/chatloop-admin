/**
 * @module pages
 */

/**
 * This functional React component renders a Formik form
 * for changing a User's password.
 */

/** */
import React, { FC, useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  FieldProps,
} from 'formik';
import * as Yup from 'yup';

import {
  createStyles,
  useTheme,
  makeStyles,
  ListItemText,
  IconButton,
  InputAdornment,
  Grid,
  TextField,
  FormHelperText,
  Fade,
  Theme,
} from '@material-ui/core';
import {
  CheckRounded,
  CloseRounded,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import authService from '../../services/authServices';
import { AxiosResponse } from 'axios';

/** @ignore */
const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    textField: {
      width: '100%',
      paddingTop: spacing(),
    },
    closeForm: { color: palette.grey[200] },
    listItem: {
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      backgroundColor: fade(palette.grey[50], 0.25),
    },
    listItemText: {
      marginTop: spacing(0.75),
    },
    formControlRoot: { display: 'block' },
  })
);

/** Yup schema for validating the password fields */
const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please enter your current password'),
  newPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please enter a new password'),
  confirmPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please re-enter your new password'),
});

interface IChangePasswordFormProps {
  /**
   * Closes the form <br>
   * Passed in by parent component
   *  */
  closeForm: () => void;

  /**
   * Should the change password form be shown?
   * Used to trigger Fade transition <br>
   * Passed in by parent component
   *  */
  showForm: boolean;
}

interface IChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * This functional React component renders a Formik form
 * for changing a User's password, with three fields:
 * * current password
 * * new passoword
 * * confirm password
 */
const ChangePasswordForm: FC<IChangePasswordFormProps> = ({
  showForm,
  closeForm,
}) => {
  // -------------------------------- Setting up component state ------------------------------------------ //
  /** Should the current password be shown as text or masking dots? */
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);

  /** Should the new password be shown as text or masking dots? */
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  /** Should the confirmation password be shown as text or masking dots? */
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // -------------------------------- Setting up Material-UI styling ---------------------------------------- //
  const theme = useTheme();
  const classes = useStyles(theme);

  // ------------------------------------------- Component Functions ----------------------------------------- //
  /** Changes the component state values so passwords can be revealed as text rather than masking dots */
  const toggleShowPassword = (type: string) => {
    if (type === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else if (type === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (type === 'currentPassword') {
      setShowCurrentPassword(!showCurrentPassword);
    }
  };

  /** Renders JSX for error messages controlled by Formik */
  const renderFormikErrorMessage = (name: any) => {
    return (
      <ErrorMessage name={name}>
        {(msg) => {
          return (
            <FormHelperText error variant="outlined">
              {msg}
            </FormHelperText>
          );
        }}
      </ErrorMessage>
    );
  };

  /**
   * Renders JSX for error messages that are not controlled by Formik/Yup
   * TODO: add error message if servers returns a failure (eg wrong current password)
   * @param noMatch
   */
  const renderErrorMessage = (noMatch: boolean) => {
    if (noMatch) {
      return (
        <FormHelperText error variant="outlined">
          Confirmation password does not match
        </FormHelperText>
      );
    }
  };

  // --------------------------------------- Render component ---------------------------------------------- //
  return (
    <Fade in={showForm}>
      <Grid className={classes.listItem} container>
        <Grid item xs={12}>
          <ListItemText
            classes={{ root: classes.listItemText }}
            primary="Password"
          />
        </Grid>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          onSubmit={async (values: IChangePasswordFormValues) => {
            const response: AxiosResponse = await authService.updatePassword(
              values.currentPassword,
              values.newPassword,
              values.confirmPassword
            );
            if (response.status === 200) {
              alert('Password changed');
            } else {
              alert('Password change failed');
              console.log('response', response);
            }
            closeForm();
          }}
          validationSchema={validationSchema}
        >
          {(props: FormikProps<IChangePasswordFormValues>) => {
            let noMatch: boolean = false;
            if (props.touched.newPassword && props.touched.confirmPassword) {
              noMatch =
                props.values.newPassword !== props.values.confirmPassword;
            }

            const disableSubmit: boolean =
              noMatch ||
              props.values.currentPassword.length < 8 ||
              props.values.newPassword.length < 8 ||
              props.values.confirmPassword.length < 8;
            return (
              <React.Fragment>
                <Form style={{ width: '100%' }}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      {renderFormikErrorMessage('currentPassword')}
                      <Field name="currentPassword">
                        {({ field }: FieldProps<IChangePasswordFormValues>) => {
                          return (
                            <TextField
                              {...field}
                              placeholder="Current password"
                              type={showCurrentPassword ? 'text' : 'password'}
                              variant="outlined"
                              error={
                                !!props.errors.currentPassword &&
                                props.touched.currentPassword
                              }
                              classes={{ root: classes.textField }}
                              InputProps={{
                                style: { height: 32, width: '100%' },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="Toggle password visibility"
                                      onClick={() => {
                                        toggleShowPassword(field.name);
                                      }}
                                    >
                                      {showCurrentPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          );
                        }}
                      </Field>
                      {renderFormikErrorMessage('newPassword')}
                      <Field name="newPassword">
                        {({ field }: FieldProps<IChangePasswordFormValues>) => {
                          return (
                            <TextField
                              {...field}
                              placeholder="New password"
                              type={showNewPassword ? 'text' : 'password'}
                              variant="outlined"
                              error={
                                !!props.errors.newPassword &&
                                props.touched.newPassword
                              }
                              classes={{ root: classes.textField }}
                              InputProps={{
                                style: { height: 32, width: '100%' },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="Toggle password visibility"
                                      onClick={() => {
                                        toggleShowPassword(field.name);
                                      }}
                                    >
                                      {showNewPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          );
                        }}
                      </Field>
                      {renderFormikErrorMessage('confirmPassword')}
                      <Field name="confirmPassword">
                        {({ field }: FieldProps<IChangePasswordFormValues>) => {
                          return (
                            <TextField
                              {...field}
                              placeholder="Confirm password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              variant="outlined"
                              error={
                                !!props.errors.confirmPassword &&
                                props.touched.confirmPassword
                              }
                              classes={{ root: classes.textField }}
                              InputProps={{
                                style: { height: 32, width: '100%' },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="Toggle password visibility"
                                      onClick={() => {
                                        toggleShowPassword(field.name);
                                      }}
                                    >
                                      {showConfirmPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid item xs>
                    <Grid
                      container
                      wrap="nowrap"
                      justify="flex-end"
                      alignItems="center"
                    >
                      {renderErrorMessage(noMatch)}
                      <IconButton
                        aria-label="close-form-button"
                        onClick={closeForm}
                      >
                        <CloseRounded className={classes.closeForm} />
                      </IconButton>
                      <IconButton
                        aria-label="submit-form-button"
                        onClick={() => props.submitForm()}
                        disabled={disableSubmit}
                        color="secondary"
                      >
                        <CheckRounded />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Form>
              </React.Fragment>
            );
          }}
        </Formik>
      </Grid>
    </Fade>
  );
};

export default ChangePasswordForm;
