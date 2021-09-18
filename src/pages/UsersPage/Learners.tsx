import React, { FC, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import UsersTable from './UsersTable';
import { UserRole } from '../../@types/enums';
import UserDrawer from './UserDrawer';
import ReplaceTutorDialog from '../../components/dialogs/ReplaceTutorDialog';
import { ExtendedLearner } from '../../@types/interfaces';
import NewUserForm from './NewUserForm';

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

const Learners: FC<LearnersPageProps> = ({
  extendedUser,
  refreshExtendedUser,
}) => {
  const classes = useStyles();

  // ----------------------------- Component state ------------------------------ //
  const [showReplaceTutorDialog, setShowReplaceTutorDialog] =
    useState<ShowReplaceTutorDialog>({ showDialog: false });

  // ----------------------------- Render ---------------------------------------- //
  return (
    <div className={classes.learnersContainer}>
      {showReplaceTutorDialog.showDialog && (
        <ReplaceTutorDialog
          showDialog={showReplaceTutorDialog}
          setShowDialog={setShowReplaceTutorDialog}
          refreshExtendedUser={refreshExtendedUser}
        />
      )}
      <UsersTable tableFor={UserRole.learner} />
      <UserDrawer
        drawerFor={UserRole.learner}
        setShowDialog={setShowReplaceTutorDialog}
        extendedUser={extendedUser}
      />
      <NewUserForm formFor={UserRole.learner} />
    </div>
  );
};

export default Learners;
