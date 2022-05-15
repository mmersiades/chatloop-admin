import React from 'react';
import { Fab } from '@material-ui/core';

import { useAppNav } from '../../contexts/appNavContext';
import { useFabStyles } from '../styles';
import { ADD_REFERRAL_BUTTON } from '../../config/textConstants';

const AddReferralFab = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewReferralForm, setShowNewReferralForm } = useAppNav();
  // ----------------------------- Component functions ------------------------- //
  const styles = useFabStyles();
  // ----------------------------- Render ---------------------------------------- //
  return (
    <Fab
      color="secondary"
      variant="extended"
      classes={{ root: styles.fab }}
      onClick={() => setShowNewReferralForm(true)}
      disabled={showNewReferralForm}
    >
      {ADD_REFERRAL_BUTTON}
    </Fab>
  );
};

export default AddReferralFab;
