import React, { FC } from 'react';
import { Fab } from '@material-ui/core';
import { useAppNav } from '../../contexts/appNavContext';
import { ADD_ORG_BUTTON } from '../../config/textConstants';
import { useFabStyles } from '../styles';

interface Props {}

const AddOrganisationFab: FC<Props> = () => {
  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer, setShowOrgDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const styles = useFabStyles();

  // -------------------------- Render ------------------------------------- //
  return (
    <Fab
      color="secondary"
      variant="extended"
      classes={{ root: styles.fab }}
      onClick={() => setShowOrgDrawer(true)}
      disabled={showOrgDrawer}
    >
      {ADD_ORG_BUTTON}
    </Fab>
  );
};

export default AddOrganisationFab;
