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

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface ResetPasswordDialogProps {
  open: boolean;
  email: string;
  handleClose: () => void;
  handleReset: () => void;
}

const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
  open,
  email,
  handleClose,
  handleReset,
}) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{RESET_PASSWORD_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to reset{' '}
          <span className={classes.highlightSpan}>{email}</span>
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
          onClick={handleReset}
        >
          {RESET}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
