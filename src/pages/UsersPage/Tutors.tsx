import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';

const useStyles = makeStyles(() =>
  createStyles({
    tutorsContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

const Tutors: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.tutorsContainer}>
      <UsersTable tableFor={UserRoles.tutor} />
    </div>
  );
};

export default Tutors;
