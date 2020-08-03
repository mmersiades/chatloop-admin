import React, { FC, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';
import ReplaceTutorDialog from './ReplaceTutorDialog';

const useStyles = makeStyles(() =>
  createStyles({
    learnersContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

const Learners: FC = () => {
  const [showReplaceTutorDialog, setShowReplaceTutorDialog] = useState<'NONE' | 'SHIFT_ONE' | 'SHIFT_TWO'>('NONE');
  const classes = useStyles();

  return (
    <div className={classes.learnersContainer}>
      {showReplaceTutorDialog !== 'NONE' && (
        <ReplaceTutorDialog showDialog={showReplaceTutorDialog} setShowDialog={setShowReplaceTutorDialog} />
      )}
      <UsersTable tableFor={UserRoles.learner} />
      <UserDrawer drawerFor={UserRoles.learner} showDialog={setShowReplaceTutorDialog} />
    </div>
  );
};

export default Learners;
