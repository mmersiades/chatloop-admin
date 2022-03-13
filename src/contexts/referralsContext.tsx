// noinspection JSIgnoredPromiseFromCall

import React, {
  createContext,
  FC,
  PropsWithChildren, useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {useAppNav} from './appNavContext';
import referralsService, {
  PostReferralBody,
} from '../services/referralsService';
import {Action, ExtendedReferral, PageableResponse, Referral} from '../@types/interfaces';
import {DEFAULT_REFERRAL_PAGE_SIZE} from "../config/constants";

export interface ReferralsState {
  fetchingReferrals: boolean;
  fetchingReferral: boolean;
  postingReferral: boolean;
  referrals: Referral[];
  extendedReferral?: ExtendedReferral;
  page: number
  size: number
  totalReferrals: number
}

const initialState: ReferralsState = {
  fetchingReferrals: false,
  fetchingReferral: false,
  postingReferral: false,
  referrals: [],
  page: 0,
  size: DEFAULT_REFERRAL_PAGE_SIZE,
  totalReferrals: 0,
};

type PostReferral = (body: PostReferralBody) => Promise<boolean>
type ChangeReferralsSize = (size: number) => void
type ChangeReferralsPage = (page: number) => void

export interface ReferralsContext extends ReferralsState {
  postReferral?: PostReferral
  changeReferralsSize?: ChangeReferralsSize
  changeReferralsPage?: ChangeReferralsPage
}

const initialContext: ReferralsContext = {...initialState};

// eslint-disable-next-line
export const ReferralsContext = createContext<ReferralsContext>(initialContext);

export const useReferrals = () => useContext(ReferralsContext);

export const ReferralsConsumer = ReferralsContext.Consumer;

interface GetReferralsRequest
  extends Action<'GET_REFERRALS_REQUEST'> {
}

interface GetReferralsSuccess extends Action<'GET_REFERRALS_SUCCESS'> {
  page: PageableResponse<Referral>;
}

interface GetReferralsFailure
  extends Action<'GET_REFERRALS_FAILURE'> {
}

interface GetReferralRequest extends Action<'GET_REFERRAL_REQUEST'> {
}

interface GetReferralSuccess extends Action<'GET_REFERRAL_SUCCESS'> {
  extendedReferral: ExtendedReferral;
}

interface GetReferralFailure extends Action<'GET_REFERRAL_FAILURE'> {
}

interface PostReferralRequest extends Action<'POST_REFERRAL_REQUEST'> {
}

interface PostReferralSuccess extends Action<'POST_REFERRAL_SUCCESS'> {
  page: PageableResponse<Referral>
}

interface PostReferralFailure extends Action<'POST_REFERRAL_FAILURE'> {
}

interface SetReferralPage extends Action<'SET_REFERRAL_PAGE'> {
  page: number
}

interface SetReferralSize extends Action<'SET_REFERRAL_SIZE'> {
  size: number
}

type Actions =
  | GetReferralsRequest
  | GetReferralsSuccess
  | GetReferralsFailure
  | GetReferralRequest
  | GetReferralSuccess
  | GetReferralFailure
  | PostReferralRequest
  | PostReferralSuccess
  | PostReferralFailure
  | SetReferralPage
  | SetReferralSize;

const referralsReducer = (
  state: ReferralsState,
  action: Actions
): ReferralsState => {
  switch (action.type) {
    case 'GET_REFERRALS_REQUEST':
      return {
        ...state,
        fetchingReferrals: true,
      };
    case 'GET_REFERRALS_SUCCESS':
      return {
        ...state,
        fetchingReferrals: false,
        referrals: action.page.content,
        totalReferrals: action.page.totalElements
      };
    case 'GET_REFERRALS_FAILURE':
      return {
        ...state,
        fetchingReferrals: false,
      };
    case 'GET_REFERRAL_REQUEST':
      return {
        ...state,
        fetchingReferral: true,
      };
    case 'GET_REFERRAL_SUCCESS':
      return {
        ...state,
        fetchingReferral: false,
        extendedReferral: action.extendedReferral,
      };
    case 'GET_REFERRAL_FAILURE':
      return {
        ...state,
        fetchingReferral: false,
      };
    case 'POST_REFERRAL_REQUEST':
      return {
        ...state,
        postingReferral: true,
      };
    case 'POST_REFERRAL_SUCCESS':
      return {
        ...state,
        postingReferral: false,
        referrals: action.page.content,
        totalReferrals: action.page.totalElements
      }
    case 'POST_REFERRAL_FAILURE':
      return {
        ...state,
        postingReferral: false,
      };
    case 'SET_REFERRAL_PAGE':
      return {
        ...state,
        page: action.page
      }
    case 'SET_REFERRAL_SIZE':
      return {
        ...state,
        size: action.size,
        page: 0
      }
    default:
      return state;
  }
};

interface ReferralsProviderProps {
  injectedState?: Partial<ReferralsState>;
}

export const ReferralsProvider: FC<PropsWithChildren<ReferralsProviderProps>> = ({
                                                                                   children,
                                                                                   injectedState
                                                                                 }
) => {
  // ----------------------------- Component state ------------------------------ //
  const [state, dispatch] = useReducer(referralsReducer, {
    ...initialState,
    ...injectedState,
  });

  // ----------------------------- Hooks ---------------------------------------- //
  const {showReferralDrawer} = useAppNav();

  // ----------------------------- Component functions ------------------------- //
  const getReferrals = useCallback(async () => {
    dispatch({type: 'GET_REFERRALS_REQUEST'});

    try {
      const {status, data} = await referralsService
        .getReferrals({page: state.page, size: state.size})

      if (status === 200) {
        dispatch({type: 'GET_REFERRALS_SUCCESS', page: data});

      }
    } catch (error) {
      console.error('error', error);
      dispatch({type: 'GET_REFERRALS_FAILURE'});
    }
  }, [state.size, state.page]);

  const getReferral = async (referralId: number) => {
    dispatch({type: 'GET_REFERRAL_REQUEST'});

    try {
      const {status, data} = await referralsService
        .getReferralById({referralId});

      if (status === 200) {
        dispatch({
          type: 'GET_REFERRAL_SUCCESS',
          extendedReferral: data
        });

      } else {
        dispatch({type: 'GET_REFERRAL_FAILURE'});
      }
    } catch (error) {
      console.error(error);
      dispatch({type: 'GET_REFERRAL_FAILURE'});
    }
  };

  const postReferral = async (
    body: PostReferralBody,
  ): Promise<boolean> => {
    dispatch({type: 'POST_REFERRAL_REQUEST'});

    try {
      const {status, data} = await referralsService
        .postReferral({
          body,
          page: state.page,
          size: state.size
        });

      if (status === 200) {
        dispatch({type: 'POST_REFERRAL_SUCCESS', page: data});
        return true;

      } else {
        dispatch({type: 'POST_REFERRAL_FAILURE'});
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({type: 'POST_REFERRAL_FAILURE'});
      return false;
    }
  };

  const changeReferralsSize: ChangeReferralsSize = (size) => dispatch({type: "SET_REFERRAL_SIZE", size})

  const changeReferralsPage: ChangeReferralsPage = (page) => dispatch({type: "SET_REFERRAL_PAGE", page})

  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    getReferrals()
  }, [state.page, state.size, getReferrals]);

  useEffect(() => {
    showReferralDrawer && getReferral(showReferralDrawer);
  }, [showReferralDrawer]);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <ReferralsContext.Provider value={{...state, postReferral, changeReferralsSize, changeReferralsPage}}>
      {children}
    </ReferralsContext.Provider>
  );
};
