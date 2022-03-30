import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import {
  createStyles,
  useTheme,
  makeStyles,
  ListItemText,
  IconButton,
  InputAdornment,
  Grid,
  TextField,
  FormHelperText,
  Fade,
  Theme,
} from '@material-ui/core';
import {
  CheckRounded,
  CloseRounded,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { AxiosResponse } from 'axios';

import authService from '../../services/authServices';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    textField: {
      width: '100%',
      paddingTop: spacing(),
    },
    closeForm: { color: palette.grey[200] },
    listItem: {
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      backgroundColor: fade(palette.grey[50], 0.25),
    },
    listItemText: {
      marginTop: spacing(0.75),
    },
    formControlRoot: { display: 'block' },
  })
);

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please enter your current password'),
  newPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please enter a new password'),
  confirmPassword: Yup.string()
    .min(8, 'Passwords must be 8 characters or more')
    .required('Please re-enter your new password'),
});

interface ChangePasswordFormProps {
  closeForm: () => void;
  showForm: boolean;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultValues: FormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  showForm,
  closeForm,
}) => {
  // ----------------------------- Component state ------------------------------ //
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [noMatch, setNoMatch] = useState(false);

  // ----------------------------- 3rd party hooks ------------------------------- //
  const theme = useTheme();
  const classes = useStyles(theme);
  const {
    handleSubmit,
    formState: { isSubmitting, touchedFields, errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  // ----------------------------- Component functions ------------------------- //
  const toggleShowPassword = (type: string) => {
    if (type === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else if (type === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (type === 'currentPassword') {
      setShowCurrentPassword(!showCurrentPassword);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setNoMatch(true);
      return;
    }
    const response: AxiosResponse = await authService.updatePassword(
      data.currentPassword,
      data.newPassword,
      data.confirmPassword
    );
    if (response.status === 200) {
      reset();
      alert('Password changed');
    } else {
      alert('Password change failed');
      console.log('response', response);
    }
    closeForm();
  });

  const disableSubmit: boolean =
    noMatch ||
    isSubmitting ||
    !touchedFields.currentPassword ||
    !touchedFields.newPassword;

  // ----------------------------- Render ---------------------------------------- //
  const renderFormErrorMessage = (
    name: 'currentPassword' | 'newPassword' | 'confirmPassword'
  ) => {
    return (
      <FormHelperText error variant="outlined">
        {errors[name]?.message}
      </FormHelperText>
    );
  };

  const renderErrorMessage = (noMatch: boolean) => {
    if (noMatch) {
      return (
        <FormHelperText error variant="outlined">
          Confirmation password does not match
        </FormHelperText>
      );
    }
  };

  return (
    <Fade in={showForm}>
      <Grid className={classes.listItem} container>
        <Grid item xs={12}>
          <ListItemText
            classes={{ root: classes.listItemText }}
            primary="Password"
          />
        </Grid>
        <form onSubmit={onSubmit}>
          <Grid item xs={12}>
            <Grid container alignItems="center">
              {renderFormErrorMessage('currentPassword')}

              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Current password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={
                      errors.currentPassword && touchedFields.currentPassword
                    }
                    classes={{ root: classes.textField }}
                    InputProps={{
                      style: { height: 32, width: '100%' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() => {
                              toggleShowPassword(field.name);
                            }}
                          >
                            {showCurrentPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {renderFormErrorMessage('newPassword')}

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="New password"
                    type={showNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={errors.newPassword && touchedFields.newPassword}
                    classes={{ root: classes.textField }}
                    onFocus={() => setNoMatch(false)}
                    InputProps={{
                      style: { height: 32, width: '100%' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() => {
                              toggleShowPassword(field.name);
                            }}
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {renderFormErrorMessage('confirmPassword')}

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={
                      errors.confirmPassword && touchedFields.confirmPassword
                    }
                    onFocus={() => setNoMatch(false)}
                    classes={{ root: classes.textField }}
                    InputProps={{
                      style: { height: 32, width: '100%' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() => {
                              toggleShowPassword(field.name);
                            }}
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid
              container
              wrap="nowrap"
              justifyContent="flex-end"
              alignItems="center"
            >
              {renderErrorMessage(noMatch)}
              <IconButton aria-label="close-form-button" onClick={closeForm}>
                <CloseRounded className={classes.closeForm} />
              </IconButton>
              <IconButton
                type="submit"
                aria-label="submit-form-button"
                disabled={disableSubmit}
                color="secondary"
              >
                <CheckRounded />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Fade>
  );
};

export default ChangePasswordForm;
