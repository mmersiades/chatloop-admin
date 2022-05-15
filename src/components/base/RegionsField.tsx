import React, {
  ChangeEvent,
  FC,
  forwardRef,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { MenuItem, Select, SelectProps, Typography } from '@material-ui/core';

import { RegionDTO } from '../../services/regionsService';
import { CountryDTO } from '../../services/countriesService';

// Parent component is responsible for deciding which regions for which countries to use
interface Props extends SelectProps {
  countries: CountryDTO[];
  regions: RegionDTO[];
}

const RegionsField: FC<Props> = ({
  countries,
  regions,
  value,
  onChange,
  onBlur,
  ...props
}) => {
  // -------------------------- Component functions ------------------------ //
  const filterValuesByCountry = (values: string[], countryCode: string) => {
    const valuesAsRegions = regions.filter((r) => values.includes(r.code));

    return valuesAsRegions
      .filter((r) => r.countryCode === countryCode)
      .map((r) => r.code);
  };

  const handleChange = (
    event: ChangeEvent<{ name?: string; value: unknown }>,
    child: ReactNode,
    currentValues: string[],
    countryCode: string
  ) => {
    const regionsForCountry = regions
      .filter((r) => r.countryCode === countryCode)
      .map((r) => r.code);
    const selectedRegionCodesForCountry = event.target.value as string[];

    // Remove all regions for this country from the values
    let newValues = currentValues.filter(
      (cv) => !regionsForCountry.includes(cv)
    );

    // Then add back in the selected regions for the country
    newValues = [...newValues, ...selectedRegionCodesForCountry];

    // Overwrite event value
    event.target.value = newValues;

    // Then let react-hook-forms do the rest
    onChange && onChange(event, child);
  };

  // -------------------------- Render ------------------------------------- //
  return (
    <>
      {countries.map((country) => {
        return (
          <div style={{ marginBottom: '12px' }} key={country.countryCode}>
            <Typography variant="caption">{country.countryName}</Typography>
            <Select
              key={country.countryCode}
              autoWidth={false}
              multiple={true}
              native={false}
              variant="outlined"
              fullWidth
              value={filterValuesByCountry(
                value as string[],
                country.countryCode
              )}
              onBlur={onBlur}
              onChange={(e, child) =>
                handleChange(e, child, value as string[], country.countryCode)
              }
              {...props}
            >
              {regions
                .filter((region) => region.countryCode === country.countryCode)
                .map((r) => (
                  <MenuItem key={r.code} value={r.code}>
                    {r.subdivisionName}
                  </MenuItem>
                ))}
            </Select>
          </div>
        );
      })}
    </>
  );
};

export default forwardRef((props: PropsWithChildren<Props>, ref) => (
  <RegionsField {...props} ref={ref} />
));
