import React, { FC } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { useUsers } from '../../contexts/usersContext';
import { useAppNav } from '../../contexts/appNavContext';
import { convertPartnerToTutor } from '../../services/usersService';
import { ExtendedUser } from '../../@types/interfaces';
import {
  CANCEL,
  CANNOT_UNDO,
  CHANGE_ROLE_LABEL,
  changeRoleTitle,
} from '../../config/textConstants';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface Props {
  open: boolean;
  user: ExtendedUser;
  handleClose: () => void;
}

const PromotePartnerDialog: FC<Props> = ({ open, user, handleClose }) => {
  const classes = useStyles();

  // -------------------------- Hooks -------------------------------------- //
  const { fetchAllUsers } = useUsers();
  const { setShowUserDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const handleChangeRole = async () => {
    const success = await convertPartnerToTutor(user.id);
    if (success) {
      fetchAllUsers && fetchAllUsers();
      handleClose();
      setShowUserDrawer(null);
      alert("User's role changed to Tutor");
    }
  };

  // -------------------------- Render ------------------------------------- //
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{changeRoleTitle(user.displayName)}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to change{' '}
          <span className={classes.highlightSpan}>{user.displayName}</span>'s
          role to tutor?
        </Typography>
        <Typography>{CANNOT_UNDO}</Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel" onClick={handleClose}>
          {CANCEL}
        </Button>
        <Button
          aria-label="Confirm change role"
          color="secondary"
          variant="contained"
          onClick={handleChangeRole}
        >
          {CHANGE_ROLE_LABEL}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotePartnerDialog;
