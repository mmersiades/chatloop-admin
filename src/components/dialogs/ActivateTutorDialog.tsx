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
import { activateTutor } from '../../services/usersService';
import { ExtendedUser } from '../../@types/interfaces';
import {
  ACTIVATE_LABEL,
  ACTIVATE_TUTOR_TITLE,
  CANCEL,
  LEARNERS_CAN_BE_ASSIGNED,
} from '../../config/textConstants';
import { CONFIRM_ACTIVATE_TUTOR_AL } from '../../config/constants';

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

const ActivateTutorDialog: FC<Props> = ({
  user,
  handleClose,
  ...dialogProps
}) => {
  const classes = useStyles();
  // -------------------------- Component state ---------------------------- //
  const [activating, setActivating] = useState(false);

  // -------------------------- Hooks -------------------------------------- //
  const { fetchAllUsers } = useUsers();
  const { setShowUserDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const handleActivate = async () => {
    setActivating(true);
    const success = await activateTutor(user.id);
    if (success) {
      fetchAllUsers && (await fetchAllUsers());
      handleClose();
      setShowUserDrawer(null);
      alert(`${user.displayName} deactivated`);
    }
    setActivating(false);
  };

  // -------------------------- Render ------------------------------------- //
  return (
    <Dialog onClose={handleClose} {...dialogProps}>
      <DialogTitle>{ACTIVATE_TUTOR_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to activate{' '}
          <span className={classes.highlightSpan}>{user.displayName}</span>?
        </Typography>
        <Typography>{LEARNERS_CAN_BE_ASSIGNED}</Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel" onClick={handleClose}>
          {CANCEL}
        </Button>
        <Button
          aria-label={CONFIRM_ACTIVATE_TUTOR_AL}
          color="secondary"
          variant="contained"
          onClick={handleActivate}
          style={{ width: '120px' }}
        >
          {activating ? (
            <CircularProgress size={'24px'} style={{ color: 'white' }} />
          ) : (
            ACTIVATE_LABEL
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivateTutorDialog;
