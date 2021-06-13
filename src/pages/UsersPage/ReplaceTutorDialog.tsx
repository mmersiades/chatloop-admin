import React, { FC, useState, useEffect, FormEvent } from 'react';
import {
  DialogTitle,
  DialogContent,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
  Grid,
  Radio,
  CircularProgress,
} from '@material-ui/core';
import { Tutor, ExtendedTutor } from '../../@types/interfaces';
import { useUsers } from '../../contexts/usersContext';
import { TutorShifts } from '../../@types/enums';

import { ShowReplaceTutorDialog } from './Learners';
import stringifyLanguages from '../../helpers/stringifyLanguages';
import { getUser, replaceTutor } from '../../services/usersService';

const useStyles = makeStyles(({ palette, transitions, spacing }: Theme) =>
  createStyles({
    tableContainer: {
      height: 'calc(100vh - 96px)',
      borderRadius: '0px',
      width: '100%',
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    tableContainerShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
    tableHead: {
      backgroundColor: palette.primary.main,
    },
    tableBody: {
      maxHeight: '80vh',
      display: 'block',
      overflow: 'auto',
    },
    tableRow: {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    },
    tableCell: {
      color: palette.common.white,
    },
    helperTextSpacer: {
      height: 20,
    },
    deleteButton: {
      color: palette.error.main,
    },
    footerRoot: {
      height: spacing(8),
      '& button': {
        marginLeft: spacing(2),
      },
    },
    spinner: {
      color: '#fff',
      marginLeft: spacing(2.125),
      marginRight: spacing(2.25),
    },
  })
);

interface ReplaceTutorDialogProps {
  showDialog: ShowReplaceTutorDialog;
  setShowDialog: (param: ShowReplaceTutorDialog) => void;
  refreshExtendedUser: (id: number) => void;
}

const ReplaceTutorDialog: FC<ReplaceTutorDialogProps> = ({
  showDialog,
  setShowDialog,
  refreshExtendedUser,
}) => {
  const classes = useStyles();
  const [shiftTutors, setShiftTutors] = useState<Array<Tutor> | undefined>();
  const [selectedTutor, setSelectedTutor] =
    useState<ExtendedTutor | undefined>();
  const [oldTutor, setOldTutor] = useState<Tutor | undefined>();
  const [value, setValue] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tutors } = useUsers();

  useEffect(() => {
    if (!!tutors && !!oldTutor) {
      const filteredTutors = tutors.filter((tutor) => tutor.id !== oldTutor.id);
      oldTutor.shift === TutorShifts.one
        ? setShiftTutors(
            filteredTutors.filter((tutor) => tutor.shift === TutorShifts.one)
          )
        : setShiftTutors(
            filteredTutors.filter((tutor) => tutor.shift === TutorShifts.two)
          );
    }
  }, [tutors, showDialog, oldTutor]);

  useEffect(() => {
    if (!!tutors && !!showDialog.oldTutor) {
      setOldTutor(
        tutors.filter((tutor) => tutor.id === showDialog.oldTutor)[0]
      );
    }
  }, [tutors, showDialog.oldTutor]);

  const handleSelect = async (tutor: Tutor) => {
    setValue(tutor.id);
    const response = await getUser(tutor.id);
    response.status === 200 && setSelectedTutor({ ...tutor, ...response.data });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!!showDialog.oldTutor && !!showDialog.learner && !!value) {
      setIsSubmitting(true);
      const response = await replaceTutor(
        showDialog.oldTutor,
        value,
        showDialog.learner
      );
      if (response?.status === 200) {
        refreshExtendedUser(showDialog.learner);
        setShowDialog({
          showDialog: false,
          oldTutor: undefined,
          learner: undefined,
        });
      } else {
        alert('Tutor not replaced. Something went wrong');
        console.log('response', response);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={showDialog.showDialog}
      onClose={() =>
        setShowDialog({
          showDialog: false,
          oldTutor: undefined,
          learner: undefined,
        })
      }
    >
      {!!oldTutor && (
        <>
          <DialogTitle>{`Replace ${oldTutor.displayName}`}</DialogTitle>
          <DialogContent>
            <form onSubmit={(e) => !isSubmitting && handleSubmit(e)}>
              <TableContainer>
                <Table size="small">
                  <TableHead classes={{ root: classes.tableHead }}>
                    <TableRow classes={{ root: classes.tableRow }}>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        ID
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        Display name
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        Current learners
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        Max learners
                      </TableCell>
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        First language
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody classes={{ root: classes.tableBody }}>
                    {shiftTutors &&
                      shiftTutors.map((tutor) => (
                        <TableRow
                          key={tutor.id}
                          classes={{ root: classes.tableRow }}
                        >
                          <TableCell align="center">
                            <Radio
                              checked={value === tutor.id}
                              onChange={() => handleSelect(tutor)}
                              value={value}
                            />
                          </TableCell>
                          <TableCell align="center">{tutor.id}</TableCell>
                          <TableCell align="center">
                            {tutor.displayName}
                          </TableCell>
                          <TableCell align="center">
                            {selectedTutor && value === tutor.id
                              ? selectedTutor.numberOfLearners
                              : ''}
                          </TableCell>
                          <TableCell align="center">
                            {selectedTutor && value === tutor.id
                              ? selectedTutor.maxNumberOfLearners
                              : ''}
                          </TableCell>
                          <TableCell align="center">
                            {selectedTutor && value === tutor.id
                              ? stringifyLanguages(selectedTutor.firstLanguages)
                              : ''}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <Grid
                  classes={{ root: classes.footerRoot }}
                  container
                  justify="flex-end"
                  alignItems="center"
                >
                  {!!selectedTutor && (
                    <Typography>{`Replace ${oldTutor.displayName} with ${selectedTutor.displayName}?`}</Typography>
                  )}
                  <Button
                    onClick={() =>
                      setShowDialog({
                        showDialog: false,
                        oldTutor: undefined,
                        learner: undefined,
                      })
                    }
                  >
                    CANCEL
                  </Button>
                  <Button
                    aria-label="confirm-replace-button"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={!value || isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress
                        classes={{ root: classes.spinner }}
                        size={24}
                        thickness={3}
                      />
                    ) : (
                      'REPLACE'
                    )}
                  </Button>
                </Grid>
              </TableContainer>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default ReplaceTutorDialog;
