import React, { useState, FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import AppRouter from '../routers/AppRouter';
import { AppNavContext } from '../contexts/appNavContext';

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
  const [showMenuDrawer, setShowMenuDrawer] = useState(true);
  const [showUserDrawer, setShowUserDrawer] = useState<number | null>(null);

  // ---------------------------------------- Setting up Material UI ----------------------------------------------- //
  const classes = useStyles();

  // ---------------------------------------- Rendering component ------------------------------------------------- //
  return (
    <div className={classes.appContainer}>
      <AppNavContext.Provider
        value={{
          showMenuDrawer,
          showUserDrawer,
          setShowMenuDrawer,
          setShowUserDrawer,
        }}
      >
        <AppRouter />
      </AppNavContext.Provider>
    </div>
  );
};

export default App;
