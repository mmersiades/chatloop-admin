import { FC, useState } from 'react';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';
import {
  createStyles,
  makeStyles,
  TextField,
  TextFieldProps,
  useTheme,
} from '@material-ui/core';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { FieldValues } from 'react-hook-form';

import { removeLeadingZeroFromPhone } from '../../helpers/removeLeadingZeroFromPhone';
import { PHONE_FIELD_AL } from '../../config/constants';

import 'react-phone-input-material-ui/lib/style.css';

const useStyles = makeStyles(({ spacing, shape }) => {
  return createStyles({
    inputLabel: {
      paddingLeft: 0,
    },
    input: {
      width: `calc(100% - ${spacing(8)}px)`,
      marginLeft: spacing(8),
    },
    innerInput: {
      borderRadius: `0 ${shape.borderRadius}px ${shape.borderRadius}px 0`,
    },
    helperText: {
      marginLeft: -spacing(6.25),
    },
  });
});

interface Props {
  inputProps: TextFieldProps;
  field: Partial<ControllerRenderProps<FieldValues, 'phone' | 'contactPhone'>>;
  handleDialCode: (value: string, dialCode: string) => void;
}

const IntlPhoneInput: FC<Props> = ({
  inputProps,
  field: { onChange, ...field },
  handleDialCode,
}) => {
  // -------------------------- Component state ---------------------------- //
  const [countryCode] = useState('au');

  // -------------------------- Hooks -------------------------------------- //
  const { palette, typography, shape, spacing } = useTheme();
  const styles = useStyles();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <ReactPhoneInput
      {...field}
      country={
        inputProps.value === '' || !inputProps.value ? countryCode : undefined
      }
      autoFormat={false}
      onChange={(value, country: CountryData) => {
        handleDialCode(value, country.dialCode);
        onChange &&
          onChange(
            removeLeadingZeroFromPhone({
              dialCode: country.dialCode,
              wholeValue: value,
            })
          );
      }}
      value={field.value}
      inputProps={{
        ...inputProps,
        type: 'phone',
        InputLabelProps: {
          classes: { root: styles.inputLabel },
        },
        InputProps: {
          classes: { root: styles.innerInput },
          inputProps: {
            'aria-label': PHONE_FIELD_AL,
          },
        },
        FormHelperTextProps: {
          classes: { root: styles.helperText },
        },
        classes: { root: styles.input },
      }}
      buttonStyle={{
        borderColor: 'rgba(43, 53, 99, 0.3)',
        borderWidth: 1,
        borderRightWidth: 0,
        borderStyle: 'solid',
        marginTop: spacing(1),
        maxHeight: spacing(5),
        borderRadius: `${shape.borderRadius}px 0 0 ${shape.borderRadius}px`,
        width: spacing(8),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      dropdownStyle={{
        ...typography.body1,
        backgroundColor: palette.grey['100'],
        color: palette.common.black,
      }}
      searchStyle={{
        ...typography.body1,
        backgroundColor: palette.grey['50'],
        color: palette.common.black,
      }}
      component={TextField}
      countryCodeEditable={false}
      enableSearch
    />
  );
};

export default IntlPhoneInput;
