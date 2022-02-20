import React from 'react';
import { makeStyles, createStyles, Theme, Fab } from '@material-ui/core';

import { useAppNav } from '../../contexts/appNavContext';
import { ADD_REFERRAL_BUTTON } from '../../config/textConstants';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 8,
      left: 8,
    },
  })
);

const AddReferralFab = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewReferralForm, setShowNewReferralForm } = useAppNav();
  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();
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
