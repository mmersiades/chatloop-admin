import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Divider,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Control,
  Controller,
  FieldError,
  Path,
  useForm,
  useWatch,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import IntlPhoneInput from '../../components/base/IntlPhoneInput';
import CountriesField from '../../components/base/CountriesField';
import RegionsField from '../../components/base/RegionsField';
import { useAppNav } from '../../contexts/appNavContext';
import { useCountries } from '../../contexts/countriesContext';
import { useOrganisations } from '../../contexts/organisationsContext';
import { PostOrgBody, PutOrgBody } from '../../services/organisationsService';
import { CountryDTO } from '../../services/countriesService';
import regionsService, { RegionDTO } from '../../services/regionsService';
import { Organisation } from '../../@types/interfaces';
import { replaceNull } from '../../helpers/replaceNull';
import {
  CONTACT_EMAIL_HELPER,
  CONTACT_PHONE_HELPER,
  LOCALITY_HELPER,
  OFFICIAL_NAME_HELPER,
  OPERATIONAL_COUNTRIES_HELPER,
  POSTAL_CODE_HELPER,
  PREMISE_HELPER,
  SHORT_NAME_HELPER,
  STREET_ADDRESS_HELPER,
  SUBPREMISE_HELPER,
  WEBSITE_HELPER,
} from '../../config/textConstants';

const useStyles = makeStyles(({ spacing, palette, typography }) => {
  return createStyles({
    formContainer: {
      padding: '12px',
      overflowY: 'auto',
      height: '100%',
      paddingBottom: spacing(12),
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
    spinnerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
});

interface FormValues {
  officialName: string;
  operationalCountries: string[];
  operationalRegions: string[];
  onlineOrg: boolean;
  shortName: string | null;
  premise: string | null;
  subpremise: string | null;
  streetAddress: string | null;
  administrativeArea: string | null;
  locality: string | null;
  countryCode: string | null;
  postalCode: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  websiteUrl: string | null;
}

const defaultValues: FormValues = {
  officialName: '',
  shortName: '',
  premise: '',
  subpremise: '',
  streetAddress: '',
  administrativeArea: '',
  locality: '',
  countryCode: '',
  postalCode: '',
  operationalCountries: [],
  operationalRegions: [],
  onlineOrg: false,
  contactPhone: '',
  contactEmail: '',
  websiteUrl: '',
};

interface Props {
  org?: Organisation;
}

const OrganisationForm: FC<Props> = ({ org }) => {
  // -------------------------- Component state ---------------------------- //
  const [regions, setRegions] = useState<RegionDTO[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [addressRegions, setAddressRegions] = useState<RegionDTO[]>([]);
  const [loadingAddressRegions, setLoadingAddressRegions] = useState(false);

  // -------------------------- 3rd party hooks ---------------------------- //
  // @ts-ignore
  const schema: Yup.SchemaOf<FormValues> = Yup.object().shape({
    officialName: Yup.string().min(3).required('Please enter an official name'),
    operationalCountries: Yup.array().of(Yup.string().min(2).max(3)).required(),
    operationalRegions: Yup.array().of(Yup.string().min(2).max(7)).required(),
    onlineOrg: Yup.boolean().required(),
    shortName: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value))
      .min(3),
    premise: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    subpremise: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    streetAddress: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    administrativeArea: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    locality: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    country: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    countryCode: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value))
      .min(2)
      .max(3),
    postalCode: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value))
      .min(2)
      .max(11),
    contactPhone: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value))
      .min(6)
      .max(16),
    contactEmail: Yup.string()
      .email()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    websiteUrl: Yup.string()
      .url()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const countriesWatch = useWatch({ control, name: 'operationalCountries' });
  const regionsWatch = useWatch({ control, name: 'operationalRegions' });
  const onlineWatch = useWatch({ control, name: 'onlineOrg' });
  const countryWatch = useWatch({ control, name: 'countryCode' });

  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer } = useAppNav();
  const { countryByIp, countries } = useCountries();
  const { createOrganisation, creating, updateOrganisation, updating } =
    useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  const getRegions = async (countries: CountryDTO[]) => {
    setLoadingRegions(true);
    const responses = await Promise.all(
      countries.map(
        async (c) => await regionsService.getRegionsByCountry(c.countryCode)
      )
    );
    let newRegions: RegionDTO[] = [];
    responses.forEach(({ data }) => {
      newRegions = [...newRegions, ...data];
    });
    setRegions(newRegions);
    setLoadingRegions(false);
  };

  const getAddressRegions = async (countryCode: string) => {
    setLoadingAddressRegions(true);
    try {
      const { status, data } = await regionsService.getRegionsByCountry(
        countryCode
      );

      if (status === 200) {
        setAddressRegions(data);
      }

      setLoadingAddressRegions(false);
    } catch (error) {
      console.error(error);
      setLoadingAddressRegions(false);
    }
  };

  const getDefaultValues = useCallback(
    (): FormValues => ({
      ...defaultValues,
      operationalCountries: [countryByIp],
      countryCode: countryByIp,
    }),
    [countryByIp]
  );

  const getInitialValues = useCallback((): FormValues => {
    let orgWithNoNulls = {};
    let operationalCountries: string[] = [countryByIp];
    if (org) {
      orgWithNoNulls = replaceNull<Organisation>(org);

      // This check is needed in case the backend sends { countryCode: null, countryName: null }
      if (org.operationalCountries.length > 0) {
        const nullValue = org.operationalCountries.findIndex(
          (c) => c.countryCode === null || c.countryName === null
        );

        if (nullValue < 0) {
          operationalCountries = org.operationalCountries.map(
            (c) => c.countryCode
          );
        }
      }
    }
    return {
      ...defaultValues,
      ...orgWithNoNulls,
      operationalCountries,
      operationalRegions: org?.operationalRegions?.map((r) => r.code) || [],
      countryCode: org?.countryCode ?? countryByIp,
    };
  }, [org, countryByIp]);

  const createOrg = async (data: FormValues) => {
    if (createOrganisation && !creating) {
      const body: PostOrgBody = {
        ...data,
        country:
          countries.find((c) => c.countryCode === data.countryCode)
            ?.countryName || null,
      };

      const isSuccess = await createOrganisation(body);
      isSuccess && reset();
    }
  };

  const updateOrg = async (data: FormValues) => {
    if (!!org && updateOrganisation && !updating) {
      const body: PutOrgBody = {
        ...data,
        country:
          countries.find((c) => c.countryCode === data.countryCode)
            ?.countryName || null,
      };

      const isSuccess = await updateOrganisation({ body, orgId: org.id });
      isSuccess && alert('Organisation updated');
    }
  };

  const onSubmit = (data: FormValues) => {
    !!org ? updateOrg(data) : createOrg(data);
  };

  // Removes regions from operationalRegions values if the region's country is deselected
  const removeRegions = (countryCodes: string[]) => {
    const currentRegions = regions.filter((r) => regionsWatch.includes(r.code));
    const filteredRegions = currentRegions
      .filter((r) => countryCodes.includes(r.countryCode))
      .map((r) => r.code);
    setValue('operationalRegions', filteredRegions);
  };

  // -------------------------- Effects ------------------------------------ //
  // Drawer initially renders in closed state, so need to use effect + reset()
  // to populate values when it opens
  useEffect(() => {
    if (!!org) {
      reset(getInitialValues());
    } else {
      reset(getDefaultValues());
    }
  }, [getDefaultValues, reset, org, getInitialValues]);

  // Empty form when the drawer is closed
  useEffect(() => {
    !showOrgDrawer && reset(defaultValues);
  }, [showOrgDrawer, reset]);

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getRegions(countries.filter((c) => countriesWatch.includes(c.countryCode)));
  }, [countriesWatch, countries]);

  // Update address regions when address country changes
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    countryWatch && getAddressRegions(countryWatch);
  }, [countryWatch]);

  // -------------------------- Render ------------------------------------- //
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <p>Logo goes here</p>
      <Divider />
      <Typography variant="subtitle1">Contact info</Typography>
      <PlainTextField
        name="officialName"
        control={control}
        label="Official name"
        placeholder="Example International Ltd"
        helperText={OFFICIAL_NAME_HELPER}
        errors={errors.officialName}
      />
      <PlainTextField
        name="shortName"
        control={control}
        label="Name"
        placeholder="Example"
        helperText={SHORT_NAME_HELPER}
        errors={errors.shortName}
      />
      <div className={styles.fieldContainer}>
        <Controller
          name="contactPhone"
          control={control}
          render={({ field }) => (
            <IntlPhoneInput
              inputProps={{
                label: 'Contact phone',
                placeholder: 'Example',
                margin: 'dense',
                variant: 'outlined',
                type: 'text',
                fullWidth: true,
                helperText:
                  errors?.contactPhone?.message || CONTACT_PHONE_HELPER,
                error: !!errors.contactPhone,
              }}
              field={field}
              handleDialCode={() => {}}
            />
          )}
        />
      </div>
      <div className={styles.fieldContainer}>
        <Controller
          name="contactEmail"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contact email"
              placeholder="contact@example.org"
              margin="dense"
              variant="outlined"
              type="email"
              fullWidth
              helperText={errors?.contactEmail?.message || CONTACT_EMAIL_HELPER}
              error={!!errors.contactEmail}
            />
          )}
        />
      </div>
      <div className={styles.fieldContainer}>
        <Controller
          name="websiteUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Website"
              placeholder="https://www.example.org"
              margin="dense"
              variant="outlined"
              type="url"
              fullWidth
              helperText={errors?.websiteUrl?.message || WEBSITE_HELPER}
              error={!!errors.websiteUrl}
            />
          )}
        />
      </div>
      <Divider />
      <Typography variant="subtitle1" paragraph>
        Operational areas
      </Typography>
      <Typography variant="subtitle2" paragraph>
        Online
      </Typography>
      <div className={styles.fieldContainer}>
        <Controller
          name="onlineOrg"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} />}
              label="Organisation operates online only"
            />
          )}
        />
      </div>
      <Typography variant="subtitle2" paragraph>
        Countries
      </Typography>
      <div className={styles.fieldContainer}>
        <Controller
          name="operationalCountries"
          control={control}
          render={({ field, fieldState }) => (
            <CountriesField
              {...field}
              onChange={(event, child) => {
                removeRegions(event.target.value as string[]);
                field.onChange(event, child);
              }}
              ref={null}
              fullWidth={true}
              helperText={OPERATIONAL_COUNTRIES_HELPER}
              errorMessage={fieldState.error?.message}
              disabled={onlineWatch}
              multiple={true}
            />
          )}
        />
      </div>
      <Typography variant="subtitle2" paragraph>
        Regions
      </Typography>

      <div className={styles.fieldContainer}>
        {loadingRegions ? (
          <div className={styles.spinnerContainer}>
            <CircularProgress />
          </div>
        ) : (
          <Controller
            name="operationalRegions"
            control={control}
            render={({ field }) => (
              <RegionsField
                countries={countries.filter((c) =>
                  countriesWatch.includes(c.countryCode)
                )}
                {...field}
                regions={regions}
                ref={null}
                disabled={onlineWatch}
              />
            )}
          />
        )}
      </div>
      <Divider />
      <Typography variant="subtitle1" paragraph>
        Address
      </Typography>
      <PlainTextField
        name="subpremise"
        control={control}
        label="Sub-building"
        placeholder="Example Hall"
        helperText={SUBPREMISE_HELPER}
        errors={errors.subpremise}
      />
      <PlainTextField
        name="premise"
        control={control}
        label="Building"
        placeholder="Example Bldg"
        helperText={PREMISE_HELPER}
        errors={errors.premise}
      />
      <PlainTextField
        name="streetAddress"
        control={control}
        label="Street"
        placeholder="24 Example Road"
        helperText={STREET_ADDRESS_HELPER}
        errors={errors.streetAddress}
      />
      <PlainTextField
        name="locality"
        control={control}
        label="Suburb / Town"
        placeholder="Example Heights"
        helperText={LOCALITY_HELPER}
        errors={errors.locality}
      />
      <div className={styles.fieldContainer}>
        {loadingAddressRegions ? (
          <div className={styles.spinnerContainer}>
            <CircularProgress />
          </div>
        ) : (
          <Controller
            name="administrativeArea"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="State / Province"
                fullWidth
                variant="outlined"
                autoWidth={false}
                multiple={false}
                native={false}
              >
                {addressRegions.map((r) => (
                  <MenuItem key={r.code} value={r.subdivisionName}>
                    {r.subdivisionName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        )}
      </div>
      <div className={styles.fieldContainer}>
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => (
            <CountriesField
              {...field}
              ref={null}
              fullWidth={true}
              helperText=""
              errorMessage={errors?.countryCode?.message}
              multiple={false}
            />
          )}
        />
      </div>
      <PlainTextField
        name="postalCode"
        control={control}
        label="Postcode"
        placeholder="4515"
        helperText={POSTAL_CODE_HELPER}
        errors={errors.postalCode}
      />
      <Button
        aria-label={!!org ? 'Create organisation' : 'Submit changes'}
        type="submit"
        color="secondary"
        variant="contained"
        disabled={creating || updating}
        classes={{ root: styles.button }}
      >
        {!org ? 'CREATE ORGANISATION' : 'SUBMIT CHANGES'}
      </Button>
    </form>
  );
};

export default OrganisationForm;

interface PlainTextFieldProps<FieldValues> {
  name: Path<FieldValues>;
  control: Control<FieldValues>;
  label: string;
  placeholder: string;
  helperText: string;
  errors?: FieldError;
}
const PlainTextField: <FieldValues>(
  props: PlainTextFieldProps<FieldValues>
) => ReactElement<PlainTextFieldProps<FieldValues>> = ({
  placeholder,
  label,
  helperText,
  errors,
  ...rest
}) => {
  const styles = useStyles();
  return (
    <div className={styles.fieldContainer}>
      <Controller
        {...rest}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            placeholder={placeholder}
            margin="dense"
            variant="outlined"
            type="text"
            fullWidth
            helperText={errors?.message || helperText}
            error={!!errors}
          />
        )}
      />
    </div>
  );
};
