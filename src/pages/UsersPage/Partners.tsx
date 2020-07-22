import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';

const useStyles = makeStyles(() =>
  createStyles({
    partnersContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

const Partners: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.partnersContainer}>
      <UsersTable tableFor={UserRoles.partner} />
      <UserDrawer drawerFor={UserRoles.partner} />
    </div>
  );
};

export default Partners;
