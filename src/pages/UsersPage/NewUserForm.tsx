import React, { FC } from 'react';
import * as Yup from 'yup';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
  FormikValues,
} from 'formik';
import {
  FormHelperText,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  createStyles,
  Button,
  FormControl,
  InputLabel,
} from '@material-ui/core';

import UserPageDrawer from './UserPageDrawer';
import { useAppNav } from '../../contexts/appNavContext';
import { useUsers } from '../../contexts/usersContext';
import { createUser } from '../../services/usersService';
import { TutorShifts, UserRoles } from '../../@types/enums';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { handleError } from '../../helpers/handleError';

interface NewUserFormProps {
  formFor: UserRoles;
}

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      padding: '12px',
    },
    helperTextSpacer: {
      height: 22,
    },
  })
);

const newUserFormInitialValues: FormikValues = {
  email: '',
  displayName: '',
  shift: '',
};

const NewUserForm: FC<NewUserFormProps> = ({ formFor }) => {
  const classes = useStyles();

  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewUserForm, setShowNewUserForm } = useAppNav();
  const { fetchUsersByUserRole } = useUsers();

  // ----------------------------- Component functions ------------------------- //
  const newUserSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(2, 'displayName too short')
      .max(25, 'displayName too long')
      .required('DisplayName is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    shift:
      formFor === UserRoles.tutor
        ? Yup.string()
            .oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift')
            .required('Shift must be selected')
        : Yup.string().oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift'),
  });

  // ----------------------------- Render ---------------------------------------- //
  return (
    <UserPageDrawer
      open={showNewUserForm}
      title={`Add ${getReadableRoles(formFor)}`}
      handleCloseDrawer={() => setShowNewUserForm(false)}
    >
      <Formik
        initialValues={newUserFormInitialValues}
        validationSchema={newUserSchema}
        onSubmit={async (values, actions) => {
          if (values.email && values.displayName) {
            const newUser = {
              email: values.email,
              displayName: values.displayName,
              userRole: formFor,
              shift: values.shift as TutorShifts,
            };

            try {
              const response = await createUser(newUser);
              if (!!fetchUsersByUserRole) fetchUsersByUserRole(formFor);
              console.log(`response`, response);
            } catch (error) {
              handleError(error);
            }
            actions.resetForm();
          } else {
            throw new Error('Submit called without values');
          }
        }}
      >
        {({ errors, values, isSubmitting }: FormikProps<FormikValues>) => {
          const disableButton =
            isSubmitting ||
            !!errors.displayName ||
            !!errors.email ||
            !!errors.shift ||
            !values.displayName ||
            !values.email ||
            (formFor === UserRoles.tutor && !values.shift);
          return (
            <Form className={classes.formContainer}>
              <Field name="displayName" value="values.displayName">
                {({ field }: FieldProps<FormikValues>) => {
                  return (
                    <>
                      <TextField
                        {...field}
                        label="Display name"
                        margin="dense"
                        variant="outlined"
                        type="text"
                        fullWidth
                        error={!!errors.displayName}
                      />
                      {errors.displayName ? (
                        <FormHelperText error>
                          {errors.displayName}
                        </FormHelperText>
                      ) : (
                        <div className={classes.helperTextSpacer} />
                      )}
                    </>
                  );
                }}
              </Field>
              <Field name="email" value="values.email">
                {({ field }: FieldProps<FormikValues>) => {
                  return (
                    <>
                      <TextField
                        {...field}
                        label="Email"
                        margin="dense"
                        variant="outlined"
                        type="text"
                        fullWidth
                        error={!!errors.email}
                      />
                      {errors.email ? (
                        <FormHelperText error>{errors.email}</FormHelperText>
                      ) : (
                        <div className={classes.helperTextSpacer} />
                      )}
                    </>
                  );
                }}
              </Field>
              {formFor === UserRoles.tutor && (
                <Field name="shift" value="values.shift">
                  {({ field }: FieldProps<FormikValues>) => {
                    return (
                      <FormControl fullWidth style={{ marginTop: '8px' }}>
                        <InputLabel
                          id="tutor-shift-label-id"
                          variant="outlined"
                        >
                          Tutor shift
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="tutor-shift-label-id"
                          variant="outlined"
                        >
                          <MenuItem value={TutorShifts.one}>Shift One</MenuItem>
                          <MenuItem value={TutorShifts.two}>Shift Two</MenuItem>
                        </Select>
                        {errors.shift ? (
                          <FormHelperText error>{errors.shift}</FormHelperText>
                        ) : (
                          <div className={classes.helperTextSpacer} />
                        )}
                      </FormControl>
                    );
                  }}
                </Field>
              )}
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={disableButton}
              >
                SUBMIT
              </Button>
            </Form>
          );
        }}
      </Formik>
    </UserPageDrawer>
  );
};

export default NewUserForm;
