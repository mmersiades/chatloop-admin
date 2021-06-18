import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';

import AppRouter from '../routers/AppRouter';

const useStyles = makeStyles(() =>
  createStyles({
    appContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
);

const App: FC = () => {
  const classes = useStyles();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <div className={classes.appContainer}>
      <AppRouter />
    </div>
  );
};

export default App;
