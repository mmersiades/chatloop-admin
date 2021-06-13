import React, { useState } from 'react';
import clsx from 'clsx';
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik';
import {
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core';
import logo from '../../assets/splashLogo.svg';
import authService from '../../services/authServices';
import { useHistory } from 'react-router-dom';
import { LOGIN_ERROR } from '../../config/textConstants';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    // LAYOUT
    pageContainer: {
      height: '100%',
    },
    formContainer: {
      minWidth: spacing(30),
      width: '25vw',
      marginLeft: spacing(5),
    },
    contentHeight: {
      minHeight: spacing(20),
      height: '30vh',
    },
    // STYLING
  })
);

interface IFormikValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const classes = useStyles();
  const history = useHistory();

  const formikInitialValues: IFormikValues = {
    email: '',
    password: '',
  };

  return (
    <Grid
      classes={{ root: classes.pageContainer }}
      container
      alignItems="center"
      justify="center"
    >
      <img
        className={classes.contentHeight}
        src={logo}
        alt="The Chatloop logo"
      />
      <Formik
        initialValues={formikInitialValues}
        onSubmit={async (values, actions) => {
          const response = await authService.loginWithCredentials(
            values.email,
            values.password
          );

          if (!response.isAuthError) {
            actions.resetForm();
            history.push({
              pathname: '/dashboard',
              state: 'Dashboard',
            });
          } else {
            setErrors((prevState) => [...prevState, LOGIN_ERROR]);
          }
        }}
      >
        {({ isSubmitting }: FormikProps<IFormikValues>) => {
          return (
            <Form>
              <Grid
                classes={{
                  root: clsx(classes.formContainer, classes.contentHeight),
                }}
                container
                direction="column"
                justify="space-between"
                alignItems="flex-end"
              >
                {errors.length > 0 ? (
                  errors.map((error, index) => (
                    <FormHelperText
                      key={index + error}
                      error
                      style={{ alignSelf: 'center' }}
                    >
                      {error}
                    </FormHelperText>
                  ))
                ) : (
                  <FormHelperText> </FormHelperText>
                )}
                <Field name="email" value="values.email">
                  {({ field }: FieldProps<IFormikValues>) => {
                    return (
                      <TextField
                        {...field}
                        inputProps={{ 'aria-label': 'email field' }}
                        autoFocus
                        variant="outlined"
                        label="Email"
                        type="email"
                        fullWidth
                        onFocus={() => setErrors([])}
                      />
                    );
                  }}
                </Field>
                <Field name="password" value="values.password">
                  {({ field }: FieldProps<IFormikValues>) => {
                    return (
                      <TextField
                        {...field}
                        inputProps={{ 'aria-label': 'password field' }}
                        variant="outlined"
                        label="Password"
                        type="password"
                        fullWidth
                        onFocus={() => setErrors([])}
                      />
                    );
                  }}
                </Field>
                <Button
                  type="submit"
                  color="secondary"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  Log In
                </Button>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Grid>
  );
};

export default LoginPage;
