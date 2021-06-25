import React, { FC } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';

import { useInviteStyles } from '../../pages/InvitesPage';
import { CANCEL, DELETE } from '../../config/textConstants';

interface ConfirmInviteDeleteDialogProps {
  isFetchingInvites: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  selectedInviteId?: number;
}

const ConfirmInviteDeleteDialog: FC<ConfirmInviteDeleteDialogProps> = ({
  isFetchingInvites,
  handleClose,
  handleDelete,
  selectedInviteId,
}) => {
  const classes = useInviteStyles();
  return (
    <Dialog open={!!selectedInviteId} onClose={handleClose}>
      <DialogContent>
        <Typography>{`Are you sure you want to delete invite ${
          !!selectedInviteId ? selectedInviteId : ''
        }?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{CANCEL}</Button>
        <Button
          className={classes.deleteButton}
          aria-label="confirm-delete-button"
          variant="outlined"
          onClick={handleDelete}
        >
          {isFetchingInvites ? (
            <CircularProgress
              className={classes.spinner}
              size="1rem"
              thickness={2.4}
            />
          ) : (
            DELETE
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmInviteDeleteDialog;
