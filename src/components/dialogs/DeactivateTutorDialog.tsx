import React, { FC, useState } from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { useUsers } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import { deactivateTutor } from '../../services/usersService';
import { ExtendedUser } from '../../@types/interfaces';
import {
  CANCEL,
  DEACTIVATE_LABEL,
  DEACTIVATE_TUTOR_TITLE,
  LEARNERS_WILL_BE_REASSIGNED,
} from '../../config/textConstants';
import { CONFIRM_DEACTIVATE_TUTOR_AL } from '../../config/constants';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface Props extends DialogProps {
  user: ExtendedUser;
  handleClose: () => void;
}

const DeactivateTutorDialog: FC<Props> = ({
  user,
  handleClose,
  ...dialogProps
}) => {
  const classes = useStyles();
  // -------------------------- Component state ---------------------------- //
  const [deactivating, setDeactivating] = useState(false);

  // -------------------------- Hooks -------------------------------------- //
  const { fetchAllUsers } = useUsers();
  const { setShowUserDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const handleDeactivate = async () => {
    setDeactivating(true);
    const success = await deactivateTutor(user.id);
    if (success) {
      fetchAllUsers && (await fetchAllUsers());
      handleClose();
      setShowUserDrawer(null);
      alert(`${user.displayName} deactivated`);
    }
    setDeactivating(false);
  };

  // -------------------------- Render ------------------------------------- //
  return (
    <Dialog onClose={handleClose} {...dialogProps}>
      <DialogTitle>{DEACTIVATE_TUTOR_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to deactivate{' '}
          <span className={classes.highlightSpan}>{user.displayName}</span>?
        </Typography>
        <Typography>{LEARNERS_WILL_BE_REASSIGNED}</Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel" onClick={handleClose}>
          {CANCEL}
        </Button>
        <Button
          aria-label={CONFIRM_DEACTIVATE_TUTOR_AL}
          color="secondary"
          variant="contained"
          onClick={handleDeactivate}
          style={{ width: '120px' }}
        >
          {deactivating ? (
            <CircularProgress size={'24px'} style={{ color: 'white' }} />
          ) : (
            DEACTIVATE_LABEL
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivateTutorDialog;
