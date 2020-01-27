import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import LoginPage from "../pages/LoginPage";

const useStyles = makeStyles((theme: Theme) =>
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

function App() {
  const classes = useStyles();
  return (
    <div className={classes.appContainer}>
      <LoginPage />
    </div>
  );
}

export default App;
