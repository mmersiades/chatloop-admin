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
import { useLanguages } from '../../contexts/languagesContext';
import CustomMultiSelect from '../../components/CustomMultiSelect';

interface NewUserFormProps {
  formFor: UserRoles;
}

interface NewUserFormValues {
  email: string;
  displayName: string;
  firstLanguage: string;
  uiLanguage: string;
  shift?: TutorShifts;
  shiftOneTutorId?: number;
  shiftTwoTutorId?: number;
}

interface UiLanguageOption {
  code: string;
  language: string;
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

const uiLanguageOptions: UiLanguageOption[] = [
  { code: 'ar', language: 'Arabic' },
  { code: 'en', language: 'English' },
  { code: 'es', language: 'Spanish' },
  { code: 'fa', language: 'Persian' },
  { code: 'id', language: 'Indonesian' },
  { code: 'prs', language: 'Hazaragi' },
  { code: 'sw', language: 'Swahili' },
];

const commonInitialValues = {
  email: '',
  displayName: '',
  firstLanguage: '',
  uiLanguage: '',
};

const getInitialFormValues = (userRole: UserRoles): NewUserFormValues => {
  switch (userRole) {
    case UserRoles.learner:
      return {
        ...commonInitialValues,

        shiftOneTutorId: 0,
        shiftTwoTutorId: 0,
      };
    case UserRoles.partner:
      return commonInitialValues;
    case UserRoles.tutor:
      return {
        ...commonInitialValues,

        shift: TutorShifts.one,
      };
    default:
      return commonInitialValues;
  }
};

const NewUserForm: FC<NewUserFormProps> = ({ formFor }) => {
  const classes = useStyles();

  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewUserForm, setShowNewUserForm } = useAppNav();
  const { fetchUsersByUserRole } = useUsers();
  const { languages } = useLanguages();

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
    firstLanguage: Yup.string()
      .max(3, 'Use IS0639-3 code (usually 3 letters)')
      .min(2)
      .required(),
    uiLanguage: Yup.string()
      .max(3, 'Use IS0639-1 code (usually 2 letters)')
      .min(2, 'Use IS0639-1 code (usually 2 letters)')
      .required(),
    shiftOneTutorId:
      formFor === UserRoles.learner ? Yup.number().required() : Yup.number(),
    shiftTwoTutorId:
      formFor === UserRoles.learner ? Yup.number().required() : Yup.number(),
  });

  // ----------------------------- Render ---------------------------------------- //
  return (
    <UserPageDrawer
      open={showNewUserForm}
      title={`Add ${getReadableRoles(formFor)}`}
      handleCloseDrawer={() => setShowNewUserForm(false)}
    >
      <Formik
        initialValues={getInitialFormValues(formFor)}
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
        {({
          errors,
          values,
          touched,
          isSubmitting,
        }: FormikProps<FormikValues>) => {
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
                        error={touched.displayName && !!errors.displayName}
                      />
                      {touched.displayName && errors.displayName ? (
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
                        error={touched.email && !!errors.email}
                      />
                      {touched.email && errors.email ? (
                        <FormHelperText error>{errors.email}</FormHelperText>
                      ) : (
                        <div className={classes.helperTextSpacer} />
                      )}
                    </>
                  );
                }}
              </Field>
              <Field name="uiLanguage" value="values.uiLanguage">
                {({ field }: FieldProps<FormikValues>) => {
                  return (
                    <FormControl fullWidth style={{ marginTop: '8px' }}>
                      <InputLabel id="ui-language-label-id" variant="outlined">
                        UI Language
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="ui-language-label-id"
                        variant="outlined"
                        error={touched.uiLanguage && !!errors.uiLanguage}
                      >
                        {uiLanguageOptions.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.language}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.uiLanguage && errors.uiLanguage ? (
                        <FormHelperText error>
                          {errors.uiLanguage}
                        </FormHelperText>
                      ) : (
                        <div className={classes.helperTextSpacer} />
                      )}
                    </FormControl>
                  );
                }}
              </Field>
              <Field name="firstLanguage" value="values.firstLanguage">
                {({ field }: FieldProps<FormikValues>) => {
                  return (
                    <>
                      <Field
                        {...field}
                        name="firstLanguage"
                        options={languages.map((option) => ({
                          label: option.language,
                          value: option.code,
                        }))}
                        component={CustomMultiSelect}
                        isMulti={false}
                        error={touched.firstLanguage && !!errors.firstLanguage}
                      />
                      {touched.firstLanguage && errors.firstLanguage ? (
                        <FormHelperText error>
                          {errors.firstLanguage}
                        </FormHelperText>
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
                        {touched.shift && errors.shift ? (
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
