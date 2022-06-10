import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactSelect, { OptionsType } from 'react-select';

import { useOrganisations } from '../../contexts/organisationsContext';
import { useCountries } from '../../contexts/countriesContext';
import regionsService, { RegionDTO } from '../../services/regionsService';
import { Organisation } from '../../@types/interfaces';
import chatloopTheme from '../../assets/chatloopTheme';
import { isEqual } from 'lodash';

type SelectOption = { label: string; value: string };

interface Props {
  setOrgIds: Dispatch<SetStateAction<number[]>>;
  orgIds: number[];
}

const reactSelectStyles = {
  container: (provided: any) => ({
    ...provided,
    width: '100%',
    fontFamily: ['"Lato"', '"Helvetica"', '"Arial"', '"sans-serif"'].join(', '),
    marginTop: 2,
    marginBottom: 2,
  }),
  control: (provided: any) => ({
    ...provided,
    borderColor: chatloopTheme.palette.grey['200'],
    boxShadow: 'none',
    '&:hover': {
      borderColor: chatloopTheme.palette.primary.main,
    },
    '&:focus-within': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: chatloopTheme.palette.text.primary,
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    width: 0,
  }),
  multiValue: (provided: any) => ({
    ...provided,
    fontFamily: ['"Lato"', '"Helvetica"', '"Arial"', '"sans-serif"'].join(', '),
    color: chatloopTheme.palette.common.white,
    backgroundColor: chatloopTheme.palette.secondary.main,
    borderRadius: 4,
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: chatloopTheme.palette.common.white,
  }),
};

const OrgFilters: FC<Props> = ({ orgIds, setOrgIds }) => {
  // -------------------------- Component state ---------------------------- //
  const [regions, setRegions] = useState<RegionDTO[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<SelectOption[]>([]);
  const [orgOptions, setOrgOptions] = useState<SelectOption[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<SelectOption[]>([]);

  // -------------------------- Hooks -------------------------------------- //
  const { organisations } = useOrganisations();
  const { countries } = useCountries();

  // -------------------------- Component functions ------------------------ //
  const handleSelectOrg = (value: OptionsType<SelectOption>) => {
    const values = value as SelectOption[];
    setSelectedOrgs(values);
  };

  const filterOrgsByRegion = useCallback(
    (org: Organisation): boolean => {
      if (selectedRegions.length > 0) {
        if (org.administrativeArea) {
          return selectedRegions
            .map((sr) => sr.value)
            .includes(org.administrativeArea);
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    [selectedRegions]
  );

  const getRegions = async () => {
    try {
      const { data } = await regionsService.getRegionsByCountry('au');
      setRegions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const convertOrgToOption = (org: Organisation): SelectOption => ({
    label: org.shortName || org.officialName,
    value: org.id.toString(),
  });

  const initialiseSelectedOrgs = useCallback(() => {
    let filteredOrgs = organisations.filter(filterOrgsByRegion);
    filteredOrgs = filteredOrgs.filter((org) => orgIds.includes(org.id));
    const options = filteredOrgs.map(convertOrgToOption);
    setSelectedOrgs(options);
  }, [organisations, filterOrgsByRegion, orgIds]);

  const updateOrgs = useCallback(() => {
    const selectedIds = selectedOrgs.map((opt) => parseInt(opt.value));
    if (!isEqual(selectedIds, orgIds)) {
      setOrgIds(selectedIds);
    }
  }, [selectedOrgs, orgIds, setOrgIds]);

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getRegions();
  }, []);

  useEffect(() => {
    selectedRegions && orgIds && initialiseSelectedOrgs();
  }, [selectedRegions, initialiseSelectedOrgs, orgIds]);

  useEffect(() => {
    selectedOrgs && updateOrgs();
  }, [selectedOrgs, updateOrgs]);

  useEffect(() => {
    const options = organisations
      .filter((org) => {
        if (selectedRegions.length > 0) {
          if (org.administrativeArea) {
            return selectedRegions
              .map((sr) => sr.value)
              .includes(org.administrativeArea);
          }
        }
        return true;
      })
      .map((option) => ({
        label: option.shortName || option.officialName,
        value: option.id.toString(),
      }));
    setOrgOptions(options);
  }, [organisations, selectedRegions]);

  // -------------------------- Render ------------------------------------- //
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ReactSelect
        value={{ label: 'Australia', value: 'AU' }}
        styles={reactSelectStyles}
        options={countries.map((country) => ({
          label: country.countryName,
          value: country.countryCode,
        }))}
        isDisabled
      />
      <ReactSelect
        value={selectedRegions}
        styles={reactSelectStyles}
        placeholder={'Select states'}
        options={regions.map((region) => ({
          label: region.subdivisionName,
          value: region.subdivisionName,
        }))}
        // @ts-ignore
        onChange={setSelectedRegions}
        isMulti
      />
      <ReactSelect
        value={selectedOrgs}
        placeholder={'Select organisations'}
        styles={reactSelectStyles}
        options={orgOptions}
        onChange={handleSelectOrg}
        isMulti
      />
    </div>
  );
};

export default OrgFilters;
