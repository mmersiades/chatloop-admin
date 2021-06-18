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

import {
  RESET_PASSWORD_DIALOG_TITLE,
  CANCEL,
  RESET,
} from '../../config/textConstants';
import { ExtendedUser } from '../../@types/interfaces';
import { AxiosResponse } from 'axios';
import { resetPassword } from '../../services/usersService';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface ResetPasswordDialogProps {
  open: boolean;
  user: ExtendedUser;
  handleClose: () => void;
}

const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
  open,
  user,
  handleClose,
}) => {
  const classes = useStyles();

  // ----------------------------- Component functions ------------------------- //
  const handlePasswordReset = async () => {
    try {
      const response: AxiosResponse | undefined = await resetPassword(
        user.email
      );

      if (response && response.status === 200) {
        alert(`${response.data.status}. ${response.data.message}`);
      } else {
        alert('Password NOT reset. Something went wrong');
        console.warn('response', response);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      handleClose();
    }
  };

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{RESET_PASSWORD_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to reset{' '}
          <span className={classes.highlightSpan}>{user.email}</span>
          's password?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel button" onClick={handleClose}>
          {CANCEL}
        </Button>
        <Button
          aria-label="Reset button"
          color="secondary"
          variant="contained"
          onClick={handlePasswordReset}
        >
          {RESET}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
