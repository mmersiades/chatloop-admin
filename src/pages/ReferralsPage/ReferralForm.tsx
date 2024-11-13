import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactSelect, { OptionTypeBase } from 'react-select';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
  ListItem,
  ListItemText,
  List,
} from '@material-ui/core';
import ReactPhoneInput from 'react-phone-input-material-ui';

import 'react-phone-input-material-ui/lib/style.css';

import { useLanguages } from '../../contexts/languagesContext';
import { useReferrals } from '../../contexts/referralsContext';
import { useAppNav } from '../../contexts/appNavContext';
import {
  PostReferralBody,
  PutReferralBody,
} from '../../services/referralsService';
import { UserRole } from '../../@types/enums';
import { ExtendedReferral } from '../../@types/interfaces';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { handleError } from '../../helpers/handleError';
import {
  EMAIL_FORM_HELPER,
  FIRST_LANG_FORM_HELPER,
  INTERFACE_LANGUAGE,
  INVITATION_LINK,
  NAME_FORM_HELPER,
  PHONE_FORM_HELPER,
  REFERRER_EMAIL,
  REFERRER_NAME,
} from '../../config/textConstants';
import locationService from '../../services/locationService';
import { removeLeadingZeroFromPhone } from '../../helpers/removeLeadingZeroFromPhone';
import { useOrganisations } from '../../contexts/organisationsContext';
import { useAuth } from '../../contexts/authContext';

interface Props {
  type: 'create' | 'edit';
  extendedReferral?: ExtendedReferral;
}

export interface FormValues {
  refereeName: string;
  refereeEmail: string | null;
  refereePhone: string | null;
  role: UserRole;
  firstLanguage: OptionTypeBase; // eg 'eng', 'ara', 'prs' ISO-639-3
  targetOrgId: number;
}

const useStyles = makeStyles(({ spacing, palette, typography }) => {
  return createStyles({
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
    button: {
      width: '100%',
    },
    deleteButton: {
      width: '100%',
      marginTop: spacing(2),
      color: palette.error.main,
    },
    countryList: {
      ...typography.body1,
    },
  });
});

const defaultValues: FormValues = {
  refereeName: '',
  refereeEmail: '',
  refereePhone: '',
  role: UserRole.orgAdmin, // Admins can only create referrals for ORG_ADMIN
  firstLanguage: {
    label: 'English',
    value: 'eng',
  },
  targetOrgId: 0,
};

const ReferralForm: FC<Props> = ({ type, extendedReferral }) => {
  const [countryCode, setCountryCode] = useState('au');
  const [dialCode, setDialCode] = useState('61');
  const [ownsReferral, setOwnsReferral] = useState(false);
  const { organisations } = useOrganisations();

  // ----------------------------- 3rd party hooks ------------------------------- //
  const referralSchema = Yup.object().shape(
    {
      refereeName: Yup.string()
        .min(2, 'Referee name too short')
        .max(25, 'Referee name too long')
        .required('Referee name is required'),
      refereeEmail: Yup.string().when('refereePhone', {
        is: '',
        then: Yup.string()
          .email('Invalid email')
          .required('At least one of email or phone is required'),
        otherwise: Yup.string().email('Invalid email'),
      }),
      refereePhone: Yup.string().when('refereeEmail', {
        is: '',
        then: Yup.string()
          .min(8)
          .max(16)
          .required('At least one of email or phone is required'),
        otherwise: Yup.string().when('refereePhone', {
          // Don't apply validation if phone is blank
          is: (refereePhone: string) =>
            !refereePhone || refereePhone.length === 0,
          then: Yup.string(),
          otherwise: Yup.string().min(8).max(16),
        }),
      }),
      role: Yup.mixed<UserRole>().oneOf(Object.values(UserRole)),
      firstLanguage: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string()
          .max(3, 'Use IS0639-3 code (usually 3 letters)')
          .min(2)
          .required(),
      }),
      targetOrgId: Yup.number().when('role', {
        is: UserRole.orgAdmin,
        then: Yup.number().required(
          'Organisation admins must be assigned to an organisation'
        ),
        otherwise: Yup.number(),
      }),
    },
    [
      ['refereePhone', 'refereeEmail'],
      ['targetOrgId', 'role'],
    ]
  );

  // Falls back to default values if "create"
  const initialValues: FormValues = {
    refereeName: extendedReferral?.refereeName || defaultValues.refereeName,
    refereeEmail: extendedReferral?.email || defaultValues.refereeEmail,
    refereePhone: extendedReferral?.phone || defaultValues.refereePhone,
    role: extendedReferral?.role || defaultValues.role,
    firstLanguage: extendedReferral?.firstLanguage
      ? {
          label: extendedReferral.firstLanguage.language,
          value: extendedReferral.firstLanguage.code,
        }
      : defaultValues.firstLanguage,
    targetOrgId: extendedReferral?.targetOrgId || 0,
  };

  const {
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields, isSubmitting },
    reset,
    control,
    resetField,
  } = useForm<FormValues>({
    resolver: yupResolver(referralSchema),
    defaultValues: initialValues,
  });

  const roleWatch = useWatch({ control, name: 'role' });

  // ----------------------------- Hooks ---------------------------------------- //
  const { languages } = useLanguages();
  const { setShowReferralDrawer } = useAppNav();
  const { userId } = useAuth();
  const {
    fetchingReferral,
    postReferral,
    putReferral,
    getReferral,
    deleteReferral,
  } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles(type);

  const disableButton = (): boolean => {
    if (!ownsReferral) {
      return true;
    }

    const phoneOrEmailTouched =
      touchedFields.refereeEmail || touchedFields.refereePhone;

    if (type === 'create') {
      return (
        isSubmitting ||
        !!errors.refereeName ||
        !!errors.refereeEmail ||
        !!errors.refereePhone ||
        !!errors.role ||
        !!errors.firstLanguage ||
        !!errors.targetOrgId ||
        !touchedFields.refereeName ||
        !phoneOrEmailTouched
      );
    } else {
      const somethingDirty =
        dirtyFields.refereeName ||
        dirtyFields.refereeEmail ||
        dirtyFields.refereePhone ||
        dirtyFields.targetOrgId ||
        dirtyFields.role ||
        dirtyFields.firstLanguage;

      if (
        isSubmitting ||
        !!errors.refereeName ||
        !!errors.refereeEmail ||
        !!errors.refereePhone ||
        !!errors.role ||
        !!errors.targetOrgId ||
        !!errors.firstLanguage
      ) {
        return true;
      }

      return !somethingDirty;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    let refereePhone: string | null = null;
    let refereeEmail: string | null = null;
    let targetOrgId: number | null = null;
    if (data.refereePhone && data.refereePhone !== dialCode) {
      refereePhone = removeLeadingZeroFromPhone({
        dialCode,
        wholeValue: data.refereePhone,
      });
    }

    const firstLanguage = data.firstLanguage.value;
    refereeEmail = data.refereeEmail === '' ? null : data.refereeEmail;
    targetOrgId = data.targetOrgId === 0 ? null : data.targetOrgId;

    if (type === 'create') {
      const body: PostReferralBody = {
        ...data,
        refereeEmail,
        refereePhone,
        firstLanguage,
        targetOrgId,
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
    } else {
      const body: PutReferralBody = {
        ...data,
        refereeEmail,
        refereePhone,
        firstLanguage,
        targetOrgId,
      };

      if (!!body && !!putReferral && !!extendedReferral) {
        try {
          const isSuccess = await putReferral({
            referralId: extendedReferral.id,
            body,
          });
          if (isSuccess) {
            getReferral && getReferral(extendedReferral.id);
          }
        } catch (error) {
          handleError(error);
        }
      } else {
        throw new Error('Submit called without values');
      }
    }
  });

  const getReferrer = (referrer: string, org?: string): string => {
    let str = referrer;
    if (org) {
      str += `, of ${org}`;
    }
    return str;
  };

  const handleDelete = async () => {
    if (extendedReferral && deleteReferral) {
      const isDeleted = await deleteReferral(extendedReferral.id);
      if (isDeleted) {
        alert(`Referral for ${extendedReferral.refereeName} has been deleted`);
        setShowReferralDrawer(null);
      }
    }
  };

  const getCountryCode = async (): Promise<void> => {
    const code = await locationService.getCountryCodeByIp();
    setCountryCode(code.toLowerCase());
  };

  useEffect(() => {
    getCountryCode();
  }, []);

  useEffect(() => {
    if (!extendedReferral) {
      setOwnsReferral(true);
      return;
    }

    if (userId) {
      setOwnsReferral(extendedReferral.referrerId === userId);
    } else {
      setOwnsReferral(false);
    }
  }, [userId, extendedReferral]);

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
                disabled={!ownsReferral}
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
                disabled={!ownsReferral}
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
          name="refereePhone"
          control={control}
          render={({ field }) => (
            <>
              <ReactPhoneInput
                {...field}
                // Using isValid to get dialCode when component mounts
                isValid={(value, country) => {
                  // @ts-ignore
                  if (country.dialCode !== dialCode)
                    // @ts-ignore
                    setDialCode(country.dialCode);
                  return true;
                }}
                country={field.value === '' ? countryCode : undefined}
                autoFormat={false}
                inputProps={{
                  variant: 'outlined',
                  margin: 'dense',
                  type: 'phone',
                  inputProps: {
                    style: { paddingLeft: '42px' },
                  },
                }}
                dropdownClass={styles.countryList}
                component={TextField}
                countryCodeEditable={false}
                enableSearch
                onFocus={() =>
                  errors.refereePhone && resetField('refereePhone')
                }
                disabled={!ownsReferral}
              />
              {touchedFields.refereePhone && errors.refereePhone ? (
                <FormHelperText error>
                  {errors.refereePhone.message}
                </FormHelperText>
              ) : (
                <FormHelperText>{PHONE_FORM_HELPER}</FormHelperText>
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
                disabled={true}
              >
                <MenuItem key={UserRole.learner} value={UserRole.learner}>
                  {getReadableRoles(UserRole.learner)}
                </MenuItem>
                <MenuItem key={UserRole.partner} value={UserRole.partner}>
                  {getReadableRoles(UserRole.partner)}
                </MenuItem>
                <MenuItem key={UserRole.referrer} value={UserRole.referrer}>
                  {getReadableRoles(UserRole.referrer)}
                </MenuItem>
                <MenuItem key={UserRole.orgAdmin} value={UserRole.orgAdmin}>
                  {getReadableRoles(UserRole.orgAdmin)}
                </MenuItem>
              </Select>
              {touchedFields.role && errors.role ? (
                <FormHelperText error>{errors.role.message}</FormHelperText>
              ) : (
                <FormHelperText>
                  Admins can create/edit referrals for org admins only
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>

      {roleWatch === UserRole.orgAdmin && (
        <div className={styles.fieldContainer}>
          <Controller
            name="targetOrgId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: '8px' }}>
                <InputLabel id="org-label-id" variant="outlined">
                  Organisation
                </InputLabel>
                <Select
                  {...field}
                  labelId="org-label-id"
                  variant="outlined"
                  label="Organisation"
                  error={!!errors.targetOrgId}
                  disabled={!ownsReferral}
                >
                  {organisations.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.shortName || org.officialName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.targetOrgId ? (
                  <FormHelperText error>
                    {errors.targetOrgId.message}
                  </FormHelperText>
                ) : (
                  <div className={styles.helperTextSpacer} />
                )}
              </FormControl>
            )}
          />
        </div>
      )}

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
                isDisabled={!ownsReferral}
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
      {type === 'edit' && extendedReferral && (
        <List>
          <ListItem disableGutters>
            <ListItemText
              primary={INTERFACE_LANGUAGE}
              secondary={extendedReferral.uiLanguage}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={REFERRER_NAME}
              secondary={getReferrer(
                extendedReferral.referrerName,
                extendedReferral.orgName
              )}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={REFERRER_EMAIL}
              secondary={extendedReferral.referrerEmail}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={INVITATION_LINK}
              secondary={extendedReferral.link}
            />
          </ListItem>
        </List>
      )}
      <Button
        aria-label={type === 'create' ? 'Create referral' : 'Submit changes'}
        type="submit"
        color="secondary"
        variant="contained"
        disabled={disableButton() || fetchingReferral}
        classes={{ root: styles.button }}
      >
        {type === 'create' ? 'CREATE REFERRAL' : 'SUBMIT CHANGES'}
      </Button>
      {type === 'edit' && extendedReferral && (
        <Button
          aria-label="Delete referral"
          classes={{ root: styles.deleteButton }}
          variant="outlined"
          disabled={fetchingReferral || !ownsReferral}
          onClick={handleDelete}
        >
          DELETE REFERRAL
        </Button>
      )}
    </form>
  );
};

export default ReferralForm;
