import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { LogoDialogProps } from '../components/dialogs/LogoDialog';
import { useAppNav } from './appNavContext';
import organisationsService, {
  DeleteLogoArgs,
  PostLogoArgs,
  PostOrgBody,
  PutOrgBody,
} from '../services/organisationsService';
import { Action, Organisation } from '../@types/interfaces';
import { useAuth } from './authContext';

export interface OrganisationsState {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  organisations: Organisation[];
  selectedOrganisation?: Organisation;
  logoDialog?: LogoDialogProps;
}

const initialState: OrganisationsState = {
  fetching: false,
  creating: false,
  updating: false,
  deleting: false,
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
type DeleteOrganisation = (orgId: number) => Promise<boolean>;

type OpenLogoDialog = (props: LogoDialogProps) => void;
type CloseLogoDialog = () => void;
type SelectOrg = (org?: Organisation) => void;
type UpdateLogo = (args: PostLogoArgs) => Promise<boolean>;
type DeleteLogo = (args: DeleteLogoArgs) => Promise<boolean>;

interface OrganisationsContext extends OrganisationsState {
  getOrganisations?: GetOrganisations;
  createOrganisation?: CreateOrganisation;
  updateOrganisation?: UpdateOrganisation;
  deleteOrganisation?: DeleteOrganisation;
  openLogoDialog?: OpenLogoDialog;
  closeLogoDialog?: CloseLogoDialog;
  selectOrg?: SelectOrg;
  updateLogo?: UpdateLogo;
  deleteLogo?: DeleteLogo;
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

interface DeleteOrganisationsRequest extends Action<'DELETE_ORG_REQUEST'> {}

interface DeleteOrganisationsSuccess extends Action<'DELETE_ORG_SUCCESS'> {
  orgs: Organisation[];
}

interface DeleteOrganisationsFailure extends Action<'DELETE_ORG_FAILURE'> {}

interface SetLogoDialog extends Action<'SET_LOGO_DIALOG'> {
  props?: LogoDialogProps;
}

interface SetSelectedOrg extends Action<'SET_SELECTED_ORG'> {
  org?: Organisation;
}

interface UpdateLogoRequest extends Action<'UPDATE_LOGO_REQUEST'> {}

interface UpdateLogoSuccess extends Action<'UPDATE_LOGO_SUCCESS'> {
  org: Organisation;
}

interface UpdateLogoFailure extends Action<'UPDATE_LOGO_FAILURE'> {}
interface DeleteLogoRequest extends Action<'DELETE_LOGO_REQUEST'> {}

interface DeleteLogoSuccess extends Action<'DELETE_LOGO_SUCCESS'> {
  org: Organisation;
}

interface DeleteLogoFailure extends Action<'DELETE_LOGO_FAILURE'> {}

type Actions =
  | GetOrganisationsRequest
  | GetOrganisationsSuccess
  | GetOrganisationsFailure
  | CreateOrganisationsRequest
  | CreateOrganisationsSuccess
  | CreateOrganisationsFailure
  | UpdateOrganisationsRequest
  | UpdateOrganisationsSuccess
  | UpdateOrganisationsFailure
  | DeleteOrganisationsRequest
  | DeleteOrganisationsSuccess
  | DeleteOrganisationsFailure
  | SetLogoDialog
  | SetSelectedOrg
  | UpdateLogoRequest
  | UpdateLogoSuccess
  | UpdateLogoFailure
  | DeleteLogoRequest
  | DeleteLogoSuccess
  | DeleteLogoFailure;

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
    case 'DELETE_ORG_REQUEST':
      return {
        ...state,
        deleting: true,
      };
    case 'DELETE_ORG_SUCCESS':
      return {
        ...state,
        organisations: action.orgs,
        deleting: false,
      };
    case 'DELETE_ORG_FAILURE':
      return {
        ...state,
        deleting: false,
      };
    case 'SET_LOGO_DIALOG':
      return {
        ...state,
        logoDialog: action.props,
      };
    case 'SET_SELECTED_ORG':
      return {
        ...state,
        selectedOrganisation: action.org,
      };
    case 'UPDATE_LOGO_REQUEST':
      return {
        ...state,
        updating: true,
      };
    case 'UPDATE_LOGO_SUCCESS':
      return {
        ...state,
        selectedOrganisation: action.org,
        updating: false,
      };
    case 'UPDATE_LOGO_FAILURE':
      return {
        ...state,
        updating: false,
      };
    case 'DELETE_LOGO_REQUEST':
      return {
        ...state,
        deleting: true,
      };
    case 'DELETE_LOGO_SUCCESS':
      return {
        ...state,
        selectedOrganisation: action.org,
        deleting: false,
      };
    case 'DELETE_LOGO_FAILURE':
      return {
        ...state,
        deleting: false,
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

  const { setShowOrgDrawer } = useAppNav();
  const { loggedIn } = useAuth();

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

  const deleteOrganisation: DeleteOrganisation = async (orgId) => {
    dispatch({ type: 'DELETE_ORG_REQUEST' });

    try {
      const { status, data } = await organisationsService.deleteOrg(orgId);

      if (status === 200) {
        dispatch({ type: 'DELETE_ORG_SUCCESS', orgs: data });
        return true;
      } else {
        dispatch({ type: 'DELETE_ORG_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'DELETE_ORG_FAILURE' });
      return false;
    }
  };

  const openLogoDialog: OpenLogoDialog = (props) =>
    dispatch({ type: 'SET_LOGO_DIALOG', props });

  const closeLogoDialog: CloseLogoDialog = () =>
    dispatch({ type: 'SET_LOGO_DIALOG' });

  const selectOrg: SelectOrg = (org) => {
    dispatch({ type: 'SET_SELECTED_ORG', org });
    setShowOrgDrawer(!!org);
  };

  const updateLogo: UpdateLogo = async (args) => {
    dispatch({ type: 'UPDATE_LOGO_REQUEST' });

    try {
      const { status, data } = await organisationsService.postLogo(args);

      if (status === 200) {
        dispatch({ type: 'UPDATE_LOGO_SUCCESS', org: data });
        getOrganisations();
        return true;
      } else {
        dispatch({ type: 'UPDATE_LOGO_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'UPDATE_LOGO_FAILURE' });
      return false;
    }
  };

  const deleteLogo: DeleteLogo = async (args) => {
    dispatch({ type: 'DELETE_LOGO_REQUEST' });

    try {
      const { status, data } = await organisationsService.deleteLogo(args);

      if (status === 200) {
        dispatch({ type: 'DELETE_LOGO_SUCCESS', org: data });
        getOrganisations();
        return true;
      } else {
        dispatch({ type: 'DELETE_LOGO_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'DELETE_LOGO_FAILURE' });
      return false;
    }
  };

  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    loggedIn && getOrganisations();
  }, [loggedIn, getOrganisations]);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <OrganisationsContext.Provider
      value={{
        ...state,
        getOrganisations,
        createOrganisation,
        updateOrganisation,
        deleteOrganisation,
        openLogoDialog,
        closeLogoDialog,
        selectOrg,
        updateLogo,
        deleteLogo,
      }}
    >
      {children}
    </OrganisationsContext.Provider>
  );
};
