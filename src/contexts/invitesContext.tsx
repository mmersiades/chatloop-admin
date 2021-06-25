import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Pageable, PartnerInQueue, Invite } from '../@types/interfaces';
import invitesService from '../services/invitesService';

interface InvitesContext {
  isFetchingPartnerQueue: boolean;
  isFetchingInvites: boolean;
  queuePageable?: Pageable<PartnerInQueue[]>;
  invitesPageable?: Pageable<Invite[]>;
  refreshInvitesContext?: () => void;
}

interface InvitesContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

export type InvitesActions =
  | { type: 'GET_PARTNER_QUEUE'; payload?: any }
  | { type: 'SET_PARTNER_QUEUE'; payload?: any }
  | { type: 'GET_INVITES'; payload?: any }
  | { type: 'SET_INVITES'; payload?: any };

const initialState: InvitesContext = {
  isFetchingPartnerQueue: false,
  isFetchingInvites: false,
};

export const invitesContext = createContext<InvitesContext>(initialState);

export const useInvites = () => useContext(invitesContext);

const invitesReducer = (
  state: InvitesContext,
  action: InvitesActions
): InvitesContext => {
  switch (action.type) {
    case 'GET_PARTNER_QUEUE':
      return {
        ...state,
        isFetchingPartnerQueue: true,
      };
    case 'SET_PARTNER_QUEUE':
      return {
        ...state,
        queuePageable: action.payload,
        isFetchingPartnerQueue: false,
      };
    case 'GET_INVITES':
      return {
        ...state,
        isFetchingInvites: true,
      };
    case 'SET_INVITES':
      return {
        ...state,
        isFetchingInvites: false,
        invitesPageable: action.payload,
      };
    default:
      return state;
  }
};

export const InvitesContextProvider: FC<InvitesContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(invitesReducer, initialState);

  const fetchQueue = async () => {
    dispatch({ type: 'GET_INVITES' });
    const partnerQueue = await invitesService.getPartnerQueue();
    dispatch({ type: 'SET_PARTNER_QUEUE', payload: partnerQueue });
  };

  const fetchInvites = async () => {
    dispatch({ type: 'GET_INVITES' });
    const invites = await invitesService.getInvites();
    dispatch({ type: 'SET_INVITES', payload: invites });
  };

  const refreshInvitesContext = () => {
    fetchQueue();
    fetchInvites();
  };

  useEffect(() => {
    fetchQueue();
    fetchInvites();
  }, []);

  return (
    <invitesContext.Provider value={{ ...state, refreshInvitesContext }}>
      {children}
    </invitesContext.Provider>
  );
};
