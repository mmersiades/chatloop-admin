import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRole } from '../../@types/enums';
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
      <UsersTable tableFor={UserRole.partner} />
      <UserDrawer drawerFor={UserRole.partner} extendedUser={extendedUser} />
      <NewUserForm formFor={UserRole.partner} />
    </div>
  );
};

export default Partners;
