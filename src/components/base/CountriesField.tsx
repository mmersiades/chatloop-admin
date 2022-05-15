import React, { FC } from 'react';
import {
  createStyles,
  FormHelperText,
  makeStyles,
  MenuItem,
  Select,
  SelectProps,
} from '@material-ui/core';

import { useCountries } from '../../contexts/countriesContext';

const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    helper: {
      paddingLeft: spacing(1.5),
      paddingRight: spacing(1.5),
    },
  });
});

interface Props extends SelectProps {
  errorMessage?: string;
  helperText?: string;
}

const CountriesField: FC<Props> = ({ errorMessage, helperText, ...props }) => {
  // -------------------------- Hooks -------------------------------------- //
  const { countries, fetchingCountries } = useCountries();

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  // -------------------------- Render ------------------------------------- //
  if (fetchingCountries) {
    return <p>loading</p>;
  }
  return (
    <>
      <Select autoWidth={false} native={false} variant="outlined" {...props}>
        {countries.map((c) => {
          return (
            <MenuItem key={c.countryCode} value={c.countryCode}>
              {c.countryName}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText error={!!errorMessage} classes={{ root: styles.helper }}>
        {errorMessage || helperText || ''}
      </FormHelperText>
    </>
  );
};

export default CountriesField;
