import React, { FC } from 'react';
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
import LogoList from './LogoList';
import { useOrganisations } from '../../contexts/organisationsContext';

interface Props {}

const OrganisationDrawer: FC<Props> = () => {
  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer, showMenuDrawer, setShowOrgDrawer } = useAppNav();
  const { selectedOrganisation, selectOrg } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = useDrawerStyles();

  const handleClose = () => {
    selectOrg && selectOrg(undefined);
    setShowOrgDrawer(false);
  };

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
            onClick={handleClose}
            edge="start"
            className={styles.closeButton}
          >
            <CloseRounded />
          </IconButton>
          <Typography>
            {!!selectedOrganisation
              ? selectedOrganisation.officialName
              : 'New organisation'}
          </Typography>
        </Toolbar>
      </AppBar>
      <CountriesProvider>
        {selectedOrganisation && (
          <LogoList
            id={selectedOrganisation.id}
            logo={selectedOrganisation.logo}
            logoOrientation={selectedOrganisation.logoOrientation}
            logomark={selectedOrganisation.logomark}
            logomarkOrientation={selectedOrganisation.logomarkOrientation}
            wordmark={selectedOrganisation.wordmark}
          />
        )}
        <OrganisationForm org={selectedOrganisation} />
      </CountriesProvider>
    </Drawer>
  );
};

export default OrganisationDrawer;
