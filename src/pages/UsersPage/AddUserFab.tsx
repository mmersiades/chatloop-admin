import { Fab, makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { UserRoles } from '../../@types/enums';
import { useAppNav } from '../../contexts/appNavContext';
import { getReadableRoles } from '../../helpers/getReadableRoles';

interface AddUserFabProps {
  fabFor: UserRoles;
  handleClick: () => void;
}

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 8,
      left: 8,
    },
  })
);

const AddUserFab: FC<AddUserFabProps> = ({ fabFor, handleClick }) => {
  const classes = useStyles();
  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewUserForm } = useAppNav();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Fab
      color="secondary"
      variant="extended"
      classes={{ root: classes.fab }}
      onClick={handleClick}
      disabled={showNewUserForm}
    >
      {`ADD ${getReadableRoles(fabFor).toUpperCase()}`}
    </Fab>
  );
};

export default AddUserFab;
