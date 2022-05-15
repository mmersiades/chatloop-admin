import React, { FC } from 'react';
import { Fab } from '@material-ui/core';

import { useAppNav } from '../../contexts/appNavContext';
import { UserRole } from '../../@types/enums';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { useFabStyles } from '../styles';

interface AddUserFabProps {
  fabFor: UserRole;
  handleClick: () => void;
}

const AddUserFab: FC<AddUserFabProps> = ({ fabFor, handleClick }) => {
  const styles = useFabStyles();
  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewUserForm } = useAppNav();

  // ----------------------------- Render ---------------------------------------- //
  return (
    <Fab
      color="secondary"
      variant="extended"
      classes={{ root: styles.fab }}
      onClick={handleClick}
      disabled={showNewUserForm}
    >
      {`ADD ${getReadableRoles(fabFor).toUpperCase()}`}
    </Fab>
  );
};

export default AddUserFab;
