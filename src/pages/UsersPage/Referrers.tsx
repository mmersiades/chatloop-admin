import React, { FC } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { ExtendedLearner, ExtendedReferrer } from '../../@types/interfaces';
import { UserRole } from '../../@types/enums';
import UsersTable from './UsersTable';
import UserDrawer from './UserDrawer';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

interface Props {
  extendedUser: ExtendedReferrer;
}

const Referrers: FC<Props> = ({ extendedUser }) => {
  // -------------------------- Component state ---------------------------- //

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const classes = useStyles();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={classes.container}>
      <UsersTable tableFor={UserRole.referrer} />
      <UserDrawer drawerFor={UserRole.referrer} extendedUser={extendedUser} />
    </div>
  );
};

export default Referrers;
