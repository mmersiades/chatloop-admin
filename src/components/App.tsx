import React, { useReducer, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import AppRouter from '../routers/AppRouter';
import { AppPropertiesContext } from '../contexts/appPropertiesContext';
import { ExpiryInterval, appPropertiesState } from '../@types/interfaces';
import baseURL from '../serverUrls';
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

type appPropertiesAction = {
  type: 'SET_INVITE_EXPIRY_INTERVAL';
  payload: ExpiryInterval;
};

const appPropertiesReducerInitialState: appPropertiesState = {
  inviteExpiryInterval: {
    value: 3,
    unit: 'hours',
    ms: 10800000,
  },
};

const appPropertiesReducer = (
  state: appPropertiesState,
  action: appPropertiesAction
) => {
  switch (action.type) {
    case 'SET_INVITE_EXPIRY_INTERVAL':
      return { ...state, inviteExpiryInterval: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [showMenuDrawer, setShowMenuDrawer] = useState(true);
  const [showUserDrawer, setShowUserDrawer] = useState<number | null>(null);

  // ---------------------------------------- Setting up Material UI ----------------------------------------------- //
  const classes = useStyles();

  // ------------------------------- Setting up application properies context -------------------------------------- //
  const [state, dispatch] = useReducer(
    appPropertiesReducer,
    appPropertiesReducerInitialState
  );

  // These payloads will be hardcoded for now, until we have endpoints for fetching them from the back-end
  const setApplicationProperties = () => {
    // This if statement allows application properties for local and staging environments
    if (baseURL === 'https://api.chatloop.org') {
      // For production environment
      dispatch({
        type: 'SET_INVITE_EXPIRY_INTERVAL',
        payload: { value: 3, unit: 'hours', ms: 10800000 },
      });
    } else {
      // For local and staging environments
      dispatch({
        type: 'SET_INVITE_EXPIRY_INTERVAL',
        payload: { value: 20, unit: 'seconds', ms: 20000 },
      });
    }
  };

  useEffect(() => {
    setApplicationProperties();
  }, []);

  // ---------------------------------------- Rendering component ------------------------------------------------- //
  return (
    <div className={classes.appContainer}>
      <AppPropertiesContext.Provider
        value={{ inviteExpiryInterval: state.inviteExpiryInterval }}
      >
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
      </AppPropertiesContext.Provider>
    </div>
  );
};

export default App;
