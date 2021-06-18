import React, { FC } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Grid,
  Typography,
  Dialog,
} from '@material-ui/core';
import { Learner } from '../../@types/interfaces';
import { TutorShifts } from '../../@types/enums';
import { useUsers } from '../../contexts/usersContext';
import { assignTutors } from '../../services/usersService';

interface AssignTutorValues {
  shiftOneTutor: number;
  shiftTwoTutor: number;
}

interface AssignTutorsDialogProps {
  open: boolean;
}

export const AssignTutorsDialog: FC<AssignTutorsDialogProps> = ({ open }) => {
  // From UsersContext
  const { learners, tutors } = useUsers();

  const newLearnerEmail = 'email';
  const setNewLearnerEmail = (arg: string) => {};

  // Gets arrays of shift one and shift two Tutors
  const shiftOneTutors =
    tutors && tutors.filter((tutor) => tutor.shift === TutorShifts.one);
  const shiftTwoTutors =
    tutors && tutors.filter((tutor) => tutor.shift === TutorShifts.two);

  // Get the Learner to assignthe Tutors to
  let learner: Learner;
  if (newLearnerEmail && learners) {
    learner = learners.filter(
      (learner) => learner.email.toLowerCase() === newLearnerEmail.toLowerCase()
    )[0];
  }

  const assignTutorsInitialValues: AssignTutorValues = {
    shiftOneTutor: shiftOneTutors ? shiftOneTutors[0].id : 999999,
    shiftTwoTutor: shiftTwoTutors ? shiftTwoTutors[0].id : 999999,
  };

  if (newLearnerEmail && learners) {
    return (
      <Formik
        initialValues={assignTutorsInitialValues}
        onSubmit={async (values, actions) => {
          const response = await assignTutors({
            shiftOneTutor: values.shiftOneTutor,
            shiftTwoTutor: values.shiftTwoTutor,
            learner: learner.id,
          });
          if (response && response.status === 200) {
            actions.resetForm();
            setNewLearnerEmail('');
          } else {
            console.log('response', response);
          }
        }}
      >
        {(props) => {
          return (
            <Dialog open={open}>
              <Form>
                <DialogTitle>{`Assign Tutors to ${
                  learner ? learner.displayName : 'Learner'
                }`}</DialogTitle>

                <DialogContent>
                  <Grid container direction="column">
                    <Field name="shiftOneTutor" value="values.shiftOneTutor">
                      {({ field }: FieldProps<AssignTutorValues>) => {
                        return (
                          <Select {...field} label="Shift One Tutor" fullWidth>
                            <MenuItem value="">Select</MenuItem>;
                            {shiftOneTutors &&
                              shiftOneTutors.map((tutor) => {
                                return (
                                  <MenuItem key={tutor.id} value={tutor.id}>
                                    {`${tutor.displayName} ${tutor.email}`}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        );
                      }}
                    </Field>
                    <Field name="shiftTwoTutor" value="values.shiftTwoTutor">
                      {({ field }: FieldProps<AssignTutorValues>) => {
                        return (
                          <Select {...field} label="Shift Two Tutor" fullWidth>
                            <MenuItem value="">Select</MenuItem>;
                            {shiftTwoTutors &&
                              shiftTwoTutors.map((tutor) => {
                                return (
                                  <MenuItem key={tutor.id} value={tutor.id}>
                                    {`${tutor.displayName} ${tutor.email}`}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        );
                      }}
                    </Field>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button type="submit" color="primary" variant="contained">
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            </Dialog>
          );
        }}
      </Formik>
    );
  } else {
    return <Typography>Error: no new learner found</Typography>;
  }
};

export default AssignTutorsDialog;
