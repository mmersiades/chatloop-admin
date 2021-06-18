import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';
import { ExtendedTutor } from '../../@types/interfaces';
import NewUserForm from './NewUserForm';

const useStyles = makeStyles(() =>
  createStyles({
    tutorsContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

interface TutorsPageProps {
  extendedUser: ExtendedTutor;
}

const Tutors: FC<TutorsPageProps> = ({ extendedUser }) => {
  const classes = useStyles();
  return (
    <div className={classes.tutorsContainer}>
      <UsersTable tableFor={UserRoles.tutor} />
      <UserDrawer drawerFor={UserRoles.tutor} extendedUser={extendedUser} />
      <NewUserForm formFor={UserRoles.tutor} />
    </div>
  );
};

export default Tutors;
