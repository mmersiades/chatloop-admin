import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import organisationsService, {
  PostOrgBody,
  PutOrgBody,
} from '../services/organisationsService';
import { Action, Organisation } from '../@types/interfaces';

export interface OrganisationsState {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  organisations: Organisation[];
}

const initialState: OrganisationsState = {
  fetching: false,
  creating: false,
  updating: false,
  organisations: [],
};

type GetOrganisations = () => void;
type CreateOrganisation = (body: PostOrgBody) => Promise<boolean>;
type UpdateOrganisation = ({
  body,
  orgId,
}: {
  body: PutOrgBody;
  orgId: number;
}) => Promise<boolean>;

interface OrganisationsContext extends OrganisationsState {
  getOrganisations?: GetOrganisations;
  createOrganisation?: CreateOrganisation;
  updateOrganisation?: UpdateOrganisation;
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

interface CreateOrganisationsRequest extends Action<'CREATE_ORG_REQUEST'> {}
interface CreateOrganisationsSuccess extends Action<'CREATE_ORG_SUCCESS'> {
  orgs: Organisation[];
}
interface CreateOrganisationsFailure extends Action<'CREATE_ORG_FAILURE'> {}
interface UpdateOrganisationsRequest extends Action<'UPDATE_ORG_REQUEST'> {}
interface UpdateOrganisationsSuccess extends Action<'UPDATE_ORG_SUCCESS'> {
  orgs: Organisation[];
}
interface UpdateOrganisationsFailure extends Action<'UPDATE_ORG_FAILURE'> {}

type Actions =
  | GetOrganisationsRequest
  | GetOrganisationsSuccess
  | GetOrganisationsFailure
  | CreateOrganisationsRequest
  | CreateOrganisationsSuccess
  | CreateOrganisationsFailure
  | UpdateOrganisationsRequest
  | UpdateOrganisationsSuccess
  | UpdateOrganisationsFailure;

const orgsReducer = (
  state: OrganisationsState,
  action: Actions
): OrganisationsState => {
  switch (action.type) {
    case 'GET_ORGS_REQUEST':
      return {
        ...state,
        fetching: true,
      };
    case 'GET_ORGS_SUCCESS':
      return {
        ...state,
        organisations: action.orgs,
        fetching: false,
      };
    case 'GET_ORGS_FAILURE':
      return {
        ...state,
        fetching: false,
      };
    case 'CREATE_ORG_REQUEST':
      return {
        ...state,
        creating: true,
      };
    case 'CREATE_ORG_SUCCESS':
      return {
        ...state,
        organisations: action.orgs,
        creating: false,
      };
    case 'CREATE_ORG_FAILURE':
      return {
        ...state,
        creating: false,
      };
    case 'UPDATE_ORG_REQUEST':
      return {
        ...state,
        updating: true,
      };
    case 'UPDATE_ORG_SUCCESS':
      return {
        ...state,
        organisations: action.orgs,
        updating: false,
      };
    case 'UPDATE_ORG_FAILURE':
      return {
        ...state,
        updating: false,
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

  const createOrganisation: CreateOrganisation = async (body) => {
    dispatch({ type: 'CREATE_ORG_REQUEST' });

    try {
      const { status, data } = await organisationsService.postOrg(body);

      if (status === 200) {
        dispatch({ type: 'CREATE_ORG_SUCCESS', orgs: data });
        return true;
      } else {
        dispatch({ type: 'CREATE_ORG_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'CREATE_ORG_FAILURE' });
      return false;
    }
  };

  const updateOrganisation: UpdateOrganisation = async ({ body, orgId }) => {
    dispatch({ type: 'UPDATE_ORG_REQUEST' });

    try {
      const { status, data } = await organisationsService.putOrg({
        body,
        orgId,
      });

      if (status === 200) {
        dispatch({ type: 'UPDATE_ORG_SUCCESS', orgs: data });
        return true;
      } else {
        dispatch({ type: 'UPDATE_ORG_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'UPDATE_ORG_FAILURE' });
      return false;
    }
  };
  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    getOrganisations();
  }, [getOrganisations]);
  // ----------------------------- Render ---------------------------------------- //
  return (
    <OrganisationsContext.Provider
      value={{
        ...state,
        getOrganisations,
        createOrganisation,
        updateOrganisation,
      }}
    >
      {children}
    </OrganisationsContext.Provider>
  );
};
