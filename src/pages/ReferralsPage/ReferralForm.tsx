import React, {FC} from 'react';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ReactSelect, {OptionTypeBase} from 'react-select';
import {Controller, useForm} from 'react-hook-form';
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
  List
} from '@material-ui/core';

import {useLanguages} from '../../contexts/languagesContext';
import {useReferrals} from '../../contexts/referralsContext';
import {useAppNav} from "../../contexts/appNavContext";
import {PostReferralBody, PutReferralBody} from '../../services/referralsService';
import {UserRole} from '../../@types/enums';
import {ExtendedReferral} from "../../@types/interfaces";
import {getReadableRoles} from '../../helpers/getReadableRoles';
import {handleError} from '../../helpers/handleError';
import {
  EMAIL_FORM_HELPER,
  FIRST_LANG_FORM_HELPER,
  INTERFACE_LANGUAGE,
  NAME_FORM_HELPER,
  REFERRER_EMAIL,
  REFERRER_NAME,
} from '../../config/textConstants';

interface Props {
  type: "create" | "edit"
  extendedReferral?: ExtendedReferral
}

export interface FormValues {
  refereeName: string;
  refereeEmail: string;
  role: UserRole;
  firstLanguage: OptionTypeBase; // eg 'eng', 'ara', 'prs' ISO-639-3
}

const useStyles = makeStyles(({spacing, palette}) => {
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
        width: '100%'
      },
      deleteButton: {
        width: '100%',
        marginTop: spacing(2),
        color: palette.error.main,
      },
    })
  }
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

const ReferralForm: FC<Props> = ({type, extendedReferral}) => {
  // ----------------------------- 3rd party hooks ------------------------------- //
  const referralSchema = Yup.object().shape({
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

  // Falls back to default values if "create"
  const initialValues: FormValues = {
    refereeName: extendedReferral?.refereeName || defaultValues.refereeName,
    refereeEmail: extendedReferral?.email || defaultValues.refereeEmail,
    role: extendedReferral?.role || defaultValues.role,
    firstLanguage: extendedReferral?.firstLanguage ? {
      label: extendedReferral.firstLanguage.language,
      value: extendedReferral.firstLanguage.code
    } : defaultValues.firstLanguage
  }

  const {
    handleSubmit,
    formState: {errors, touchedFields, dirtyFields, isSubmitting},
    reset,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(referralSchema),
    defaultValues: initialValues,
  });

  // ----------------------------- Hooks ---------------------------------------- //
  const {languages} = useLanguages();
  const {setShowReferralDrawer} = useAppNav()
  const {fetchingReferral, postReferral, putReferral, deleteReferral} = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles(type);

  const disableButton = (): boolean => {
    if (type === 'create') {
      return isSubmitting ||
        !!errors.refereeName ||
        !!errors.refereeEmail ||
        !!errors.role ||
        !!errors.firstLanguage ||
        !touchedFields.refereeName ||
        !touchedFields.refereeEmail;
    } else {
      const somethingDirty = dirtyFields.refereeName ||
        dirtyFields.refereeEmail ||
        dirtyFields.role ||
        dirtyFields.firstLanguage

      if (isSubmitting ||
        !!errors.refereeName ||
        !!errors.refereeEmail ||
        !!errors.role ||
        !!errors.firstLanguage) {
        return true
      }

      return !somethingDirty;
    }
  }


  const onSubmit = handleSubmit(async (data) => {
    if (type === "create") {
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
    } else {
      const body: PutReferralBody = {
        ...data,
        firstLanguage: data.firstLanguage.value,
      };

      if (!!body && !!putReferral && !!extendedReferral) {
        try {
          const isSuccess = await putReferral({referralId: extendedReferral.id, body});
          if (isSuccess) {
            reset()
            setShowReferralDrawer(null)
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
      const isDeleted = await deleteReferral(extendedReferral.id)
      if (isDeleted) {
        alert(`Referral for ${extendedReferral.refereeName} has been deleted`)
        setShowReferralDrawer(null)
      }
    }
  }

  // ----------------------------- Render ---------------------------------------- //
  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={styles.fieldContainer}>
        <Controller
          name="refereeName"
          control={control}
          render={({field}) => (
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
          render={({field}) => (
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
          render={({field}) => (
            <FormControl fullWidth style={{marginTop: '8px'}}>
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
                <div className={styles.helperTextSpacer}/>
              )}
            </FormControl>
          )}
        />
      </div>

      <div className={styles.fieldContainer}>
        <Controller
          name="firstLanguage"
          control={control}
          render={({field}) => (
            <FormControl fullWidth style={{marginTop: '8px'}}>
              <ReactSelect
                {...field}
                id="first-language-select"
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: (provided) => ({...provided, zIndex: 10}),
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
      {type === "edit" && extendedReferral && (
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
        </List>
      )}
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        disabled={disableButton() || fetchingReferral}
        classes={{root: styles.button}}
      >
        {type === "create" ? "CREATE REFERRAL" : "SUBMIT CHANGES"}
      </Button>
      {type === "edit" && extendedReferral && (
        <Button
          classes={{root: styles.deleteButton}}
          variant="outlined"
          disabled={fetchingReferral}
          onClick={handleDelete}
        >
          DELETE REFERRAL
        </Button>
      )}
    </form>
  );
};

export default ReferralForm;
