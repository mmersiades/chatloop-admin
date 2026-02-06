import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import countriesService, { CountryDTO } from '../services/countriesService';
import { Action } from '../@types/interfaces';

interface CountriesState {
  fetchingCountries: boolean;
  fetchingCountryByIp: boolean;
  countries: CountryDTO[];
  countryByIp: string;
}

const initialState: CountriesState = {
  fetchingCountries: false,
  fetchingCountryByIp: false,
  countries: [],
  countryByIp: 'AU',
};

type GetCountries = () => void;

interface CountriesContext extends CountriesState {}

const initialContext: CountriesContext = { ...initialState };

// eslint-disable-next-line
const CountriesContext = createContext<CountriesContext>(initialContext);

export const useCountries = () => useContext(CountriesContext);

interface GetCountriesRequest extends Action<'GET_COUNTRIES_REQUEST'> {}

interface GetCountriesSuccess extends Action<'GET_COUNTRIES_SUCCESS'> {
  countries: CountryDTO[];
}

interface GetCountriesFailure extends Action<'GET_COUNTRIES_FAILURE'> {}

interface GetCountryByIPRequest extends Action<'GET_COUNTRY_BY_IP_REQUEST'> {}

interface GetCountryByIPSuccess extends Action<'GET_COUNTRY_BY_IP_SUCCESS'> {
  country: string;
}

interface GetCountryByIPFailure extends Action<'GET_COUNTRY_BY_IP_FAILURE'> {}

type Actions =
  | GetCountriesRequest
  | GetCountriesSuccess
  | GetCountriesFailure
  | GetCountryByIPRequest
  | GetCountryByIPSuccess
  | GetCountryByIPFailure;

const countriesReducer = (
  state: CountriesState,
  action: Actions
): CountriesState => {
  switch (action.type) {
    case 'GET_COUNTRIES_REQUEST':
      return {
        ...state,
        fetchingCountries: true,
      };
    case 'GET_COUNTRIES_SUCCESS':
      return {
        ...state,
        countries: action.countries,
        fetchingCountries: false,
      };
    case 'GET_COUNTRIES_FAILURE':
      return {
        ...state,
        fetchingCountries: false,
      };
    case 'GET_COUNTRY_BY_IP_REQUEST':
      return {
        ...state,
        fetchingCountryByIp: true,
      };
    case 'GET_COUNTRY_BY_IP_SUCCESS':
      return {
        ...state,
        countryByIp: action.country,
        fetchingCountryByIp: false,
      };
    case 'GET_COUNTRY_BY_IP_FAILURE':
      return {
        ...state,
        fetchingCountryByIp: false,
      };
    default:
      return state;
  }
};

interface Props {}

export const CountriesProvider: FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  // ----------------------------- Component state ------------------------------ //
  const [state, dispatch] = useReducer(countriesReducer, initialState);

  // ----------------------------- Component functions ------------------------- //
  const getCountries: GetCountries = async () => {
    dispatch({ type: 'GET_COUNTRIES_REQUEST' });

    try {
      const { status, data } = await countriesService.getCountries();

      if (status === 200) {
        dispatch({ type: 'GET_COUNTRIES_SUCCESS', countries: data });
      } else {
        dispatch({ type: 'GET_COUNTRIES_FAILURE' });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_COUNTRIES_FAILURE' });
    }
  };

  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    getCountries();
    // noinspection JSIgnoredPromiseFromCall
  }, []);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <CountriesContext.Provider value={{ ...state }}>
      {children}
    </CountriesContext.Provider>
  );
};
