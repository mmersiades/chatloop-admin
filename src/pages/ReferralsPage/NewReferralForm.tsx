import React, { FC } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactSelect, { OptionTypeBase } from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import {
  makeStyles,
  createStyles,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';

import { useLanguages } from '../../contexts/languagesContext';
import { useReferrals } from '../../contexts/referralsContext';
import { PostReferralBody } from '../../services/referralsService';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { UserRole } from '../../@types/enums';
import { handleError } from '../../helpers/handleError';
import {
  EMAIL_FORM_HELPER,
  FIRST_LANG_FORM_HELPER,
  NAME_FORM_HELPER,
} from '../../config/textConstants';

interface FormValues {
  refereeName: string;
  refereeEmail: string;
  role: UserRole;
  firstLanguage: OptionTypeBase; // eg 'eng', 'ara', 'prs' ISO-639-3
}

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    formContainer: {
      padding: '12px',
      overflowY: 'auto',
      height: '100%',
    },
    helperTextSpacer: {
      height: 22,
    },
    fieldContainer: {
      marginBottom: spacing(2),
    },
  })
);

const defaultValues: FormValues = {
  refereeName: '',
  refereeEmail: '',
  role: UserRole.partner,
  firstLanguage: {
    label: 'English',
    value: 'eng',
  },
};

const NewReferralForm: FC = () => {
  // ----------------------------- 3rd party hooks ------------------------------- //
  const newReferralSchema = Yup.object().shape({
    refereeName: Yup.string()
      .min(2, 'Referee name too short')
      .max(25, 'Referee name too long')
      .required('Referee name is required'),
    refereeEmail: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    role: Yup.mixed<UserRole>().oneOf(Object.values(UserRole)),
    firstLanguage: Yup.object().shape({
      label: Yup.string().required(),
      value: Yup.string()
        .max(3, 'Use IS0639-3 code (usually 3 letters)')
        .min(2)
        .required(),
    }),
  });

  const {
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
    reset,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(newReferralSchema),
    defaultValues,
  });

  // ----------------------------- Hooks ---------------------------------------- //
  const { languages } = useLanguages();
  const { postReferral, postingReferral } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  const disableButton =
    isSubmitting ||
    !!errors.refereeName ||
    !!errors.refereeEmail ||
    !!errors.role ||
    !!errors.firstLanguage ||
    !touchedFields.refereeName ||
    !touchedFields.refereeEmail;

  const onSubmit = handleSubmit(async (data) => {
    const body: PostReferralBody = {
      ...data,
      firstLanguage: data.firstLanguage.value,
    };

    if (!!body && !!postReferral) {
      try {
        const isSuccess = await postReferral(body);
        if (isSuccess) {
          reset();
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      throw new Error('Submit called without values');
    }
  });

  // ----------------------------- Render ---------------------------------------- //
  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={styles.fieldContainer}>
        <Controller
          name="refereeName"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label="Name"
                margin="dense"
                variant="outlined"
                type="text"
                fullWidth
                error={touchedFields.refereeName && !!errors.refereeName}
              />
              {touchedFields.refereeName && errors.refereeName ? (
                <FormHelperText error>
                  {errors.refereeName.message}
                </FormHelperText>
              ) : (
                <FormHelperText>{NAME_FORM_HELPER}</FormHelperText>
              )}
            </>
          )}
        />
      </div>

      <div className={styles.fieldContainer}>
        <Controller
          name="refereeEmail"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label="Email"
                margin="dense"
                variant="outlined"
                type="email"
                fullWidth
                error={touchedFields.refereeEmail && !!errors.refereeEmail}
              />
              {touchedFields.refereeEmail && errors.refereeEmail ? (
                <FormHelperText error>
                  {errors.refereeEmail.message}
                </FormHelperText>
              ) : (
                <FormHelperText>{EMAIL_FORM_HELPER}</FormHelperText>
              )}
            </>
          )}
        />
      </div>

      <div className={styles.fieldContainer}>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginTop: '8px' }}>
              <InputLabel id="role-label-id" variant="outlined">
                Role
              </InputLabel>
              <Select
                {...field}
                labelId="role-label-id"
                variant="outlined"
                label="Role"
                error={touchedFields.role && !!errors.role}
              >
                <MenuItem key={UserRole.learner} value={UserRole.learner}>
                  {getReadableRoles(UserRole.learner)}
                </MenuItem>
                <MenuItem key={UserRole.partner} value={UserRole.partner}>
                  {getReadableRoles(UserRole.partner)}
                </MenuItem>
              </Select>
              {touchedFields.role && errors.role ? (
                <FormHelperText error>{errors.role.message}</FormHelperText>
              ) : (
                <div className={styles.helperTextSpacer} />
              )}
            </FormControl>
          )}
        />
      </div>

      <div className={styles.fieldContainer}>
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
                <FormHelperText>{FIRST_LANG_FORM_HELPER}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        disabled={disableButton || postingReferral}
      >
        SUBMIT
      </Button>
    </form>
  );
};

export default NewReferralForm;
