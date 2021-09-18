import React, { useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core';

import authService from '../../services/authServices';
import logo from '../../assets/splashLogo.svg';
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

interface FormData {
  email: string;
  password: string;
}

const defaultValues: FormData = {
  email: '',
  password: '',
};

const LoginPage = () => {
  // ----------------------------- Component state ------------------------------ //
  const [authErrors, setAuthErrors] = useState<string[]>([]);

  // ----------------------------- 3rd party hooks ------------------------------- //
  const classes = useStyles();
  const history = useHistory();
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues,
  });

  // ----------------------------- Component functions ------------------------- //
  const onSubmit = handleSubmit(async (data: FormData) => {
    const response = await authService.loginWithCredentials(
      data.email,
      data.password
    );

    if (!response.isAuthError) {
      reset();
      history.push({
        pathname: '/dashboard',
        state: 'Dashboard',
      });
    } else {
      setAuthErrors((prevState) => [...prevState, LOGIN_ERROR]);
    }
  });

  // ----------------------------- Render ---------------------------------------- //

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
      <form onSubmit={onSubmit}>
        <Grid
          classes={{
            root: clsx(classes.formContainer, classes.contentHeight),
          }}
          container
          direction="column"
          justify="space-between"
          alignItems="flex-end"
        >
          {authErrors.length > 0 ? (
            authErrors.map((error, index) => (
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
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                inputProps={{ 'aria-label': 'email field' }}
                autoFocus
                variant="outlined"
                label="Email"
                type="email"
                fullWidth
                onFocus={() => setAuthErrors([])}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                inputProps={{ 'aria-label': 'password field' }}
                variant="outlined"
                label="Password"
                type="password"
                fullWidth
                onFocus={() => setAuthErrors([])}
              />
            )}
          />
          <Button
            type="submit"
            color="secondary"
            disabled={isSubmitting}
            variant="contained"
          >
            Log In
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default LoginPage;
