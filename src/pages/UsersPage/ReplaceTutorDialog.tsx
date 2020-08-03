import React, { FC } from 'react';
import { DialogTitle, DialogContent, Dialog } from '@material-ui/core';

interface ReplaceTutorDialogProps {
  showDialog: 'NONE' | 'SHIFT_ONE' | 'SHIFT_TWO';
  setShowDialog: (show: 'NONE' | 'SHIFT_ONE' | 'SHIFT_TWO') => void;
}

const ReplaceTutorDialog: FC<ReplaceTutorDialogProps> = ({ showDialog, setShowDialog }) => {
  return (
    <Dialog open={showDialog === 'SHIFT_ONE' || showDialog === 'SHIFT_TWO'} onClose={() => setShowDialog('NONE')}>
      <DialogTitle>Replace Tutor</DialogTitle>
      <DialogContent>{showDialog}</DialogContent>
    </Dialog>
  );
};

export default ReplaceTutorDialog;
