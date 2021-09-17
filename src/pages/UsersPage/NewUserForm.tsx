import React, { FC } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactSelect, { OptionTypeBase } from 'react-select';
import { useForm, Controller } from 'react-hook-form';
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
import { OperatingSystem, TutorShift, UserRole } from '../../@types/enums';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { handleError } from '../../helpers/handleError';
import { useLanguages } from '../../contexts/languagesContext';
import { getTutorsByShift } from '../../helpers/getTutorsByShift';

interface NewUserFormProps {
  formFor: UserRole;
}

interface NewUserFormValues {
  email: string;
  displayName: string;
  firstLanguage: OptionTypeBase;
  uiLanguage: string;
  os: OperatingSystem;
  shift?: TutorShift;
  shiftOneTutorId?: number;
  shiftTwoTutorId?: number;
}

export interface NewUserPayload extends NewUserFormValues {
  userRole: UserRole;
}

interface UiLanguageOption {
  code: string;
  language: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      padding: '12px',
      overflowY: 'auto',
      height: '100%',
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
  { code: 'kar', language: 'Karen' },
  { code: 'my', language: 'Burmese' },
];

const commonDefaultValues = {
  email: '',
  displayName: '',
  firstLanguage: {
    label: 'English',
    value: 'eng',
  },
  uiLanguage: 'en',
  os: OperatingSystem.android,
};

const getDefaultValues = (userRole: UserRole): NewUserFormValues => {
  switch (userRole) {
    case UserRole.learner:
      return {
        ...commonDefaultValues,

        shiftOneTutorId: 0,
        shiftTwoTutorId: 0,
      };
    case UserRole.partner:
      return commonDefaultValues;
    case UserRole.tutor:
      return {
        ...commonDefaultValues,

        shift: TutorShift.one,
      };
    default:
      return commonDefaultValues;
  }
};

const getPayload = (
  userRole: UserRole,
  {
    email,
    displayName,
    firstLanguage,
    uiLanguage,
    os,
    shiftOneTutorId,
    shiftTwoTutorId,
    shift,
  }: NewUserFormValues
): NewUserPayload | undefined => {
  if (email && displayName && firstLanguage && uiLanguage) {
    // Payload values common to all UserRoles
    const commonPayload = {
      email,
      displayName,
      firstLanguage: firstLanguage.value,
      uiLanguage,
      userRole,
      os,
    };

    switch (userRole) {
      case UserRole.learner:
        if (shiftOneTutorId && shiftTwoTutorId) {
          return {
            ...commonPayload,
            shiftOneTutorId,
            shiftTwoTutorId,
          };
        } else {
          return undefined;
        }
      case UserRole.partner:
        return commonPayload;
      case UserRole.tutor:
        if (shift) {
          return {
            ...commonPayload,
            shift,
          };
        } else {
          return undefined;
        }
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};

const NewUserForm: FC<NewUserFormProps> = ({ formFor }) => {
  const classes = useStyles();

  const newUserSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(2, 'displayName too short')
      .max(25, 'displayName too long')
      .required('DisplayName is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    shift:
      formFor === UserRole.tutor
        ? Yup.string()
            .oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift')
            .required('Shift must be selected')
        : Yup.string().oneOf(['SHIFT_ONE', 'SHIFT_TWO'], 'invalid shift'),
    firstLanguage: Yup.object().shape({
      label: Yup.string().required(),
      value: Yup.string()
        .max(3, 'Use IS0639-3 code (usually 3 letters)')
        .min(2)
        .required(),
    }),
    uiLanguage: Yup.string()
      .max(3, 'Use IS0639-1 code (usually 2 letters)')
      .min(2, 'Use IS0639-1 code (usually 2 letters)')
      .required(),
    shiftOneTutorId:
      formFor === UserRole.learner ? Yup.number().required() : Yup.number(),
    shiftTwoTutorId:
      formFor === UserRole.learner ? Yup.number().required() : Yup.number(),
  });

  // ----------------------------- 3rd party hooks ------------------------------- //
  const {
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
    reset,
    control,
  } = useForm<NewUserFormValues>({
    resolver: yupResolver(newUserSchema),
    defaultValues: getDefaultValues(formFor),
  });

  // ----------------------------- Hooks ---------------------------------------- //
  const { showNewUserForm, setShowNewUserForm } = useAppNav();
  const { fetchUsersByUserRole, tutors } = useUsers();
  const { languages } = useLanguages();

  // ----------------------------- Component functions ------------------------- //

  // Gets arrays of shift one and shift two Tutors
  const shiftOneTutors = getTutorsByShift(tutors, TutorShift.one);
  const shiftTwoTutors = getTutorsByShift(tutors, TutorShift.two);

  const disableButton =
    isSubmitting ||
    !!errors.displayName ||
    !!errors.email ||
    !!errors.shift ||
    !!errors.uiLanguage ||
    !!errors.firstLanguage ||
    !!errors.shiftOneTutorId ||
    !!errors.shiftTwoTutorId ||
    !touchedFields.displayName ||
    !touchedFields.email ||
    (formFor === UserRole.learner && !touchedFields.shiftOneTutorId) ||
    (formFor === UserRole.learner && !touchedFields.shiftTwoTutorId) ||
    (formFor === UserRole.tutor && !touchedFields.shift);

  const onSubmit = handleSubmit(async (data) => {
    console.log(`data`, data);
    const body = getPayload(formFor, data);
    console.log(`body`, body);

    if (!!body) {
      try {
        await createUser(body);
        if (!!fetchUsersByUserRole) fetchUsersByUserRole(formFor);
        reset();
      } catch (error) {
        handleError(error);
      }
    } else {
      throw new Error('Submit called without values');
    }
  });

  // ----------------------------- Render ---------------------------------------- //
  return (
    <UserPageDrawer
      open={showNewUserForm}
      title={`Add ${getReadableRoles(formFor)}`}
      handleCloseDrawer={() => setShowNewUserForm(false)}
    >
      <form className={classes.formContainer} onSubmit={onSubmit}>
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label="Display name"
                margin="dense"
                variant="outlined"
                type="text"
                fullWidth
                error={touchedFields.displayName && !!errors.displayName}
              />
              {touchedFields.displayName && errors.displayName ? (
                <FormHelperText error>
                  {errors.displayName.message}
                </FormHelperText>
              ) : (
                <div className={classes.helperTextSpacer} />
              )}
            </>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label="Email"
                margin="dense"
                variant="outlined"
                type="text"
                fullWidth
                error={touchedFields.email && !!errors.email}
              />
              {touchedFields.email && errors.email ? (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              ) : (
                <div className={classes.helperTextSpacer} />
              )}
            </>
          )}
        />

        <Controller
          name="uiLanguage"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginTop: '8px' }}>
              <InputLabel id="ui-language-label-id" variant="outlined">
                UI Language
              </InputLabel>
              <Select
                {...field}
                labelId="ui-language-label-id"
                variant="outlined"
                label="UI Language"
                error={touchedFields.uiLanguage && !!errors.uiLanguage}
              >
                {uiLanguageOptions.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.language}
                  </MenuItem>
                ))}
              </Select>
              {touchedFields.uiLanguage && errors.uiLanguage ? (
                <FormHelperText error>
                  {errors.uiLanguage.message}
                </FormHelperText>
              ) : (
                <div className={classes.helperTextSpacer} />
              )}
            </FormControl>
          )}
        />

        <Controller
          name="os"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginTop: '8px' }}>
              <InputLabel id="os-label-id" variant="outlined">
                Operating System
              </InputLabel>
              <Select
                {...field}
                labelId="os-label-id"
                variant="outlined"
                label="Operating System"
                error={touchedFields.os && !!errors.os}
              >
                <MenuItem
                  key={OperatingSystem.android}
                  value={OperatingSystem.android}
                >
                  {OperatingSystem.android.toLowerCase()}
                </MenuItem>
                <MenuItem key={OperatingSystem.ios} value={OperatingSystem.ios}>
                  {OperatingSystem.ios.toLowerCase()}
                </MenuItem>
              </Select>
              {touchedFields.os && errors.os ? (
                <FormHelperText error>{errors.os.message}</FormHelperText>
              ) : (
                <div className={classes.helperTextSpacer} />
              )}
            </FormControl>
          )}
        />

        <Controller
          name="firstLanguage"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginTop: '8px' }}>
              <ReactSelect
                {...field}
                id="first-language-select"
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: (provided) => ({ ...provided, zIndex: 10 }),
                }}
                options={languages.map((option) => ({
                  label: option.language,
                  value: option.code,
                }))}
              />

              {touchedFields.firstLanguage && errors.firstLanguage ? (
                <FormHelperText error>
                  {errors.firstLanguage.message}
                </FormHelperText>
              ) : (
                <div className={classes.helperTextSpacer} />
              )}
            </FormControl>
          )}
        />

        {formFor === UserRole.tutor && (
          <Controller
            name="shift"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: '8px' }}>
                <InputLabel id="tutor-shift-label-id" variant="outlined">
                  Tutor shift
                </InputLabel>
                <Select
                  {...field}
                  labelId="tutor-shift-label-id"
                  variant="outlined"
                  label="Tutor shift"
                >
                  <MenuItem value={TutorShift.one}>Shift One</MenuItem>
                  <MenuItem value={TutorShift.two}>Shift Two</MenuItem>
                </Select>
                {touchedFields.shift && errors.shift ? (
                  <FormHelperText error>{errors.shift.message}</FormHelperText>
                ) : (
                  <div className={classes.helperTextSpacer} />
                )}
              </FormControl>
            )}
          />
        )}

        {formFor === UserRole.learner && tutors.length > 0 && (
          <>
            <Controller
              name="shiftOneTutorId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth style={{ marginTop: '8px' }}>
                  <InputLabel id="shift-one-tutor-label-id" variant="outlined">
                    Shift one tutors
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="shift-one-tutor-label-id"
                    variant="outlined"
                    label="Shift one tutors"
                  >
                    <MenuItem value={0}>Select for shift one</MenuItem>
                    {shiftOneTutors.length > 0 &&
                      shiftOneTutors.map((tutor) => {
                        return (
                          <MenuItem key={tutor.id} value={tutor.id}>
                            {`${tutor.displayName} ${tutor.email}`}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {touchedFields.shiftOneTutorId && errors.shiftOneTutorId ? (
                    <FormHelperText error>
                      {errors.shiftOneTutorId.message}
                    </FormHelperText>
                  ) : (
                    <div className={classes.helperTextSpacer} />
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="shiftTwoTutorId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth style={{ marginTop: '8px' }}>
                  <InputLabel id="shift-two-tutor-label-id" variant="outlined">
                    Shift two tutors
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="shift-two-tutor-label-id"
                    variant="outlined"
                    label="Shift two tutors"
                  >
                    <MenuItem value={0}>Select for shift two</MenuItem>
                    {shiftTwoTutors.length > 0 &&
                      shiftTwoTutors.map((tutor) => {
                        return (
                          <MenuItem key={tutor.id} value={tutor.id}>
                            {`${tutor.displayName} ${tutor.email}`}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {touchedFields.shiftTwoTutorId && errors.shiftTwoTutorId ? (
                    <FormHelperText error>
                      {errors.shiftTwoTutorId.message}
                    </FormHelperText>
                  ) : (
                    <div className={classes.helperTextSpacer} />
                  )}
                </FormControl>
              )}
            />
          </>
        )}

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={disableButton}
        >
          SUBMIT
        </Button>
      </form>
    </UserPageDrawer>
  );
};

export default NewUserForm;
