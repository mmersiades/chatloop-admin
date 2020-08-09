import React, { FC, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRoles } from '../../@types/enums';
import UserDrawer from './UserDrawer';
import ReplaceTutorDialog from './ReplaceTutorDialog';
import { ExtendedLearner } from '../../@types/interfaces';

const useStyles = makeStyles(() =>
  createStyles({
    learnersContainer: {
      width: '100%',
      height: 'calc(100% - 48px)',
    },
  })
);

export interface ShowReplaceTutorDialog {
  showDialog: boolean;
  oldTutor?: number;
  learner?: number;
}

interface LearnersPageProps {
  extendedUser: ExtendedLearner;
  refreshExtendedUser: (id: number) => void;
}

const Learners: FC<LearnersPageProps> = ({ extendedUser, refreshExtendedUser }) => {
  const [showReplaceTutorDialog, setShowReplaceTutorDialog] = useState<ShowReplaceTutorDialog>({ showDialog: false });
  const classes = useStyles();

  return (
    <div className={classes.learnersContainer}>
      {showReplaceTutorDialog.showDialog && (
        <ReplaceTutorDialog
          showDialog={showReplaceTutorDialog}
          setShowDialog={setShowReplaceTutorDialog}
          refreshExtendedUser={refreshExtendedUser}
        />
      )}
      <UsersTable tableFor={UserRoles.learner} />
      <UserDrawer drawerFor={UserRoles.learner} setShowDialog={setShowReplaceTutorDialog} extendedUser={extendedUser} />
    </div>
  );
};

export default Learners;
