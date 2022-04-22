import React, { FC } from 'react';
import { Organisation } from '../../@types/interfaces';
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { CloseRounded } from '@material-ui/icons';

import OrganisationForm from './OrganisationForm';
import { useAppNav } from '../../contexts/appNavContext';
import { CountriesProvider } from '../../contexts/countriesContext';
import { useDrawerStyles } from '../styles';

interface Props {
  org?: Organisation;
}

const OrganisationDrawer: FC<Props> = ({ org }) => {
  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer, showMenuDrawer, setShowOrgDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const styles = useDrawerStyles();

  // -------------------------- Render ------------------------------------- //
  return (
    <Drawer
      data-test="organisation-drawer"
      classes={{
        paperAnchorDockedRight: clsx(styles.docked, {
          [styles.dockedWithMenuDrawer]: showMenuDrawer,
        }),
      }}
      open={showOrgDrawer}
      anchor="right"
      variant="persistent"
    >
      <AppBar classes={{ root: styles.appbar }} position="relative">
        <Toolbar classes={{ dense: styles.toolbar }} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Close drawer button"
            onClick={() => setShowOrgDrawer(false)}
            edge="start"
            className={styles.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>
            {!!org ? org.officialName : 'New organisation'}
          </Typography>
        </Toolbar>
      </AppBar>
      <CountriesProvider>
        <OrganisationForm org={org} />
      </CountriesProvider>
    </Drawer>
  );
};

export default OrganisationDrawer;
