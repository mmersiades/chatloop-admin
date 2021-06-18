import React, { FC } from 'react';
import { UserRoles } from '../../@types/enums';
import { useAppNav } from '../../contexts/appNavContext';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import UserPageDrawer from './UserPageDrawer';

interface NewUserFormProps {
  formFor: UserRoles;
}

const NewUserForm: FC<NewUserFormProps> = ({ formFor }) => {
  const { showNewUserForm, setShowNewUserForm } = useAppNav();

  return (
    <UserPageDrawer
      open={showNewUserForm}
      title={`Add ${getReadableRoles(formFor)}`}
      handleCloseDrawer={() => setShowNewUserForm(false)}
    >
      <p>hello</p>
    </UserPageDrawer>
  );
};

export default NewUserForm;
