import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { PartnerInQueue, Invite, PageableResponse } from '../@types/interfaces';
import invitesService from '../services/invitesService';
import {
  DEV_PARTNER_QUEUE_SIZE,
  PROD_PARTNER_QUEUE_SIZE,
} from '../config/constants';

const env = process.env.REACT_APP_ENV;

interface InvitesContext {
  isFetchingPartnerQueue: boolean;
  isFetchingMoreQueue: boolean;
  isFetchingInvites: boolean;
  queuePageable?: PageableResponse<PartnerInQueue>;
  invitesPageable?: PageableResponse<Invite>;
  refreshInvitesContext?: () => void;
  fetchQueue?: (page?: number, size?: number) => void;
  fetchMoreQueue?: (page: number, size?: number) => void;
  fetchInvites?: () => void;
}

interface InvitesContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

export type InvitesActions =
  | { type: 'PARTNER_QUEUE_REQUEST'; payload?: any }
  | { type: 'PARTNER_QUEUE_SUCCESS'; payload?: any }
  | { type: 'MORE_QUEUE_REQUEST'; payload?: any }
  | { type: 'MORE_QUEUE_SUCCESS'; payload?: any }
  | { type: 'INVITES_REQUEST'; payload?: any }
  | { type: 'INVITES_SUCCESS'; payload?: any };

const initialState: InvitesContext = {
  isFetchingPartnerQueue: false,
  isFetchingMoreQueue: false,
  isFetchingInvites: false,
};

export const invitesContext = createContext<InvitesContext>(initialState);

export const useInvites = () => useContext(invitesContext);

const invitesReducer = (
  state: InvitesContext,
  action: InvitesActions
): InvitesContext => {
  switch (action.type) {
    case 'PARTNER_QUEUE_REQUEST':
      return {
        ...state,
        isFetchingPartnerQueue: true,
      };
    case 'PARTNER_QUEUE_SUCCESS':
      return {
        ...state,
        queuePageable: action.payload,
        isFetchingPartnerQueue: false,
      };
    case 'MORE_QUEUE_REQUEST':
      return {
        ...state,
        isFetchingMoreQueue: true,
      };
    case 'MORE_QUEUE_SUCCESS':
      return {
        ...state,
        queuePageable: {
          ...action.payload,
          content: !!state.queuePageable
            ? [...state.queuePageable.content, ...action.payload.content]
            : action.payload,
        },
        isFetchingMoreQueue: false,
      };
    case 'INVITES_REQUEST':
      return {
        ...state,
        isFetchingInvites: true,
      };
    case 'INVITES_SUCCESS':
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
  // ----------------------------- Component state ------------------------------ //
  const [state, dispatch] = useReducer(invitesReducer, initialState);

  // ----------------------------- Component functions ------------------------- //
  const defaultSize =
    env === 'prod' ? PROD_PARTNER_QUEUE_SIZE : DEV_PARTNER_QUEUE_SIZE;

  const fetchQueue = useCallback(
    async (page: number = 0, size: number = defaultSize) => {
      dispatch({ type: 'PARTNER_QUEUE_REQUEST' });
      const partnerQueue = await invitesService.getPartnerQueue(page, size);
      dispatch({ type: 'PARTNER_QUEUE_SUCCESS', payload: partnerQueue });
    },
    [defaultSize]
  );

  const fetchInvites = useCallback(async () => {
    dispatch({ type: 'INVITES_REQUEST' });
    const invites = await invitesService.getInvites();
    dispatch({ type: 'INVITES_SUCCESS', payload: invites });
  }, []);

  const refreshInvitesContext = () => {
    fetchQueue();
    fetchInvites();
  };

  const fetchMoreQueue = async (page: number, size: number = defaultSize) => {
    dispatch({ type: 'MORE_QUEUE_REQUEST' });
    const partnerQueue = await invitesService.getPartnerQueue(page, size);
    dispatch({ type: 'MORE_QUEUE_SUCCESS', payload: partnerQueue });
  };

  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    fetchQueue();
    fetchInvites();
  }, [fetchQueue, fetchInvites]);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <invitesContext.Provider
      value={{
        ...state,
        refreshInvitesContext,
        fetchQueue,
        fetchInvites,
        fetchMoreQueue,
      }}
    >
      {children}
    </invitesContext.Provider>
  );
};
