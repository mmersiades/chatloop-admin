import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const LoginPage = () => {
  const classes = useStyles();
  return <div>Login page</div>;
};

export default LoginPage;
