import React, { FC } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { UserRole } from '../../@types/enums';
import UsersTable from './UsersTable';
import UserDrawer from './UserDrawer';
import { ExtendedOrgAdmin } from '../../@types/interfaces';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

interface Props {
  extendedUser: ExtendedOrgAdmin;
}

const OrgAdmins: FC<Props> = ({ extendedUser }) => {
  // -------------------------- Component functions ------------------------ //
  const classes = useStyles();

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={classes.container}>
      <UsersTable tableFor={UserRole.orgAdmin} />
      <UserDrawer drawerFor={UserRole.orgAdmin} extendedUser={extendedUser} />
    </div>
  );
};

export default OrgAdmins;
