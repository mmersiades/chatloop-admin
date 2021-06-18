import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';
import { ExtendedPartner } from '../../@types/interfaces';
import NewUserForm from './NewUserForm';

const useStyles = makeStyles(() =>
  createStyles({
    partnersContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

interface PartnersPageProps {
  extendedUser: ExtendedPartner;
}

const Partners: FC<PartnersPageProps> = ({ extendedUser }) => {
  const classes = useStyles();
  return (
    <div className={classes.partnersContainer}>
      <UsersTable tableFor={UserRoles.partner} />
      <UserDrawer drawerFor={UserRoles.partner} extendedUser={extendedUser} />
      <NewUserForm formFor={UserRoles.partner} />
    </div>
  );
};

export default Partners;
