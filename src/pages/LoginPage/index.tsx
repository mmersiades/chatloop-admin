import React from "react";
import clsx from "clsx";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import {
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
  Button
} from "@material-ui/core";
import logo from "../../assets/splashLogo.svg";
import authService from "../../services/authServices";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    // LAYOUT
    pageContainer: {
      height: "100%"
    },
    formContainer: {
      minWidth: spacing(30),
      width: "25vw",
      marginLeft: spacing(5)
    },
    contentHeight: {
      minHeight: spacing(20),
      height: "20vh"
    }
    // STYLING
  })
);

interface IFormikValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const formikInitialValues: IFormikValues = {
    email: "",
    password: ""
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
          const response = await authService.login(
            values.email,
            values.password
          );
          actions.resetForm();
          console.log("response", response);
          if (!response.isAuthError) {
            history.push({
              pathname: "/dashboard",
              state: "Dashboard"
            });
          }
        }}
      >
        {({ isSubmitting }: FormikProps<IFormikValues>) => {
          return (
            <Form>
              <Grid
                classes={{
                  root: clsx(classes.formContainer, classes.contentHeight)
                }}
                container
                direction="column"
                justify="space-between"
                alignItems="flex-end"
              >
                <Field name="email" value="values.email">
                  {({ field }: FieldProps<IFormikValues>) => {
                    return (
                      <TextField
                        {...field}
                        autoFocus
                        variant="outlined"
                        label="Email"
                        type="email"
                        fullWidth
                      />
                    );
                  }}
                </Field>
                <Field name="password" value="values.password">
                  {({ field }: FieldProps<IFormikValues>) => {
                    return (
                      <TextField
                        {...field}
                        autoFocus
                        variant="outlined"
                        label="Password"
                        type="password"
                        fullWidth
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
