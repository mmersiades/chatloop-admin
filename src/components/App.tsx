import React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import AppRouter from "../routers/AppRouter";

const useStyles = makeStyles(() =>
  createStyles({
    appContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  })
);

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.appContainer}>
      <AppRouter />
    </div>
  );
};

export default App;
