import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles(({ mixins }: Theme) =>
  createStyles({
    toolbar: { ...mixins.toolbar }
  })
);

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  // @ts-ignore
  const title = location.state ? location.state.title : "Chatloop Admin";
  return (
    <>
      <AppBar>
        <Toolbar>
          <Grid container alignItems="center">
            <Typography>{title}</Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </>
  );
};

export default Navbar;
