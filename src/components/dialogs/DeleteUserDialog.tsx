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
import { deleteUser } from '../../services/usersService';
import { ExtendedUser } from '../../@types/interfaces';
import {
  CANCEL,
  DELETE,
  DELETE_USER_DIALOG_TITLE,
} from '../../config/textConstants';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface DeleteUserDialogProps {
  open: boolean;
  user: ExtendedUser;
  handleClose: () => void;
}

const DeleteUserDialog: FC<DeleteUserDialogProps> = ({
  open,
  user,
  handleClose,
}) => {
  const classes = useStyles();

  // ----------------------------- Hooks ---------------------------------------- //
  const { setShowUserDrawer } = useAppNav();
  const { fetchUsersByUserRole } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const handleDelete = async () => {
    if (!!fetchUsersByUserRole) {
      try {
        const response = await deleteUser(user.id);
        if (response && response.status === 200) {
          alert(response.data);
          fetchUsersByUserRole(user.userRole);
          setShowUserDrawer(null);
          handleClose();
        }
      } catch (error) {
        console.error(error);
        handleClose();
      }
    }
  };

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{DELETE_USER_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete{' '}
          <span className={classes.highlightSpan}>{user.email}</span>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel button" onClick={handleClose}>
          {CANCEL}
        </Button>
        <Button
          aria-label="Confirm delete user button"
          color="secondary"
          variant="contained"
          onClick={handleDelete}
        >
          {DELETE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
