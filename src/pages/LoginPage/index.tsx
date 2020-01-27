import React from "react";
import { makeStyles, Theme, createStyles, Grid } from "@material-ui/core";
import logo from "../../assets/splashLogo.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContainer: {
      height: "100%"
    }
  })
);

const LoginPage = () => {
  const classes = useStyles();
  return (
    <Grid
      classes={{ root: classes.pageContainer }}
      container
      alignItems="center"
      justify="center"
    >
      <img src={logo} />
    </Grid>
  );
};

export default LoginPage;
