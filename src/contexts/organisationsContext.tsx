import { Action, Organisation } from '../@types/interfaces';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import organisationsService from '../services/organisationsService';

export interface OrganisationsState {
  fetchingOrganisations: boolean;
  fetchingOrganisation: boolean;
  organisations: Organisation[];
}

const initialState: OrganisationsState = {
  fetchingOrganisations: false,
  fetchingOrganisation: false,
  organisations: [],
};

type GetOrganisations = () => void;

interface OrganisationsContext extends OrganisationsState {
  getOrganisations?: GetOrganisations;
}

const initialContext: OrganisationsContext = { ...initialState };

// eslint-disable-next-line
const OrganisationsContext =
  createContext<OrganisationsContext>(initialContext);

export const useOrganisations = () => useContext(OrganisationsContext);

interface GetOrganisationsRequest extends Action<'GET_ORGS_REQUEST'> {}
interface GetOrganisationsSuccess extends Action<'GET_ORGS_SUCCESS'> {
  orgs: Organisation[];
}
interface GetOrganisationsFailure extends Action<'GET_ORGS_FAILURE'> {}

type Actions =
  | GetOrganisationsRequest
  | GetOrganisationsSuccess
  | GetOrganisationsFailure;

const orgsReducer = (
  state: OrganisationsState,
  action: Actions
): OrganisationsState => {
  switch (action.type) {
    case 'GET_ORGS_REQUEST':
      return {
        ...state,
        fetchingOrganisations: true,
      };
    case 'GET_ORGS_SUCCESS':
      return {
        ...state,
        organisations: action.orgs,
        fetchingOrganisations: false,
      };
    case 'GET_ORGS_FAILURE':
      return {
        ...state,
        fetchingOrganisations: false,
      };
    default:
      return state;
  }
};

interface Props {}

export const OrganisationsProvider: FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  // ----------------------------- Component state ------------------------------ //
  const [state, dispatch] = useReducer(orgsReducer, initialState);

  // ----------------------------- Component functions ------------------------- //
  const getOrganisations: GetOrganisations = useCallback(async () => {
    dispatch({ type: 'GET_ORGS_REQUEST' });

    try {
      const { status, data } = await organisationsService.getOrgs();

      if (status === 200) {
        dispatch({ type: 'GET_ORGS_SUCCESS', orgs: data });
      } else {
        dispatch({ type: 'GET_ORGS_FAILURE' });
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'GET_ORGS_FAILURE' });
    }
  }, [dispatch]);
  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    getOrganisations();
  }, [getOrganisations]);
  // ----------------------------- Render ---------------------------------------- //
  return (
    <OrganisationsContext.Provider value={{ ...state, getOrganisations }}>
      {children}
    </OrganisationsContext.Provider>
  );
};
