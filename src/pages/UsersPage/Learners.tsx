import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';

const useStyles = makeStyles(() =>
  createStyles({
    learnersContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

const Learners: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.learnersContainer}>
      <UsersTable tableFor={UserRoles.learner} />
      <UserDrawer drawerFor={UserRoles.learner} />
    </div>
  );
};

export default Learners;
