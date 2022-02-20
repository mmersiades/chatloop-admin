import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { useAppNav } from './appNavContext';
import {
  getReferralById,
  getReferralsByRole,
  PostReferralBody,
  postReferralByRole,
} from '../services/referralsService';
import { UserRole } from '../@types/enums';
import { Action, ExtendedReferral, Referral } from '../@types/interfaces';

export interface ReferralsState {
  fetchingLearners: boolean;
  fetchingPartners: boolean;
  fetchingReferral: boolean;
  postingReferral: boolean;
  learnerReferrals: Referral[];
  partnerReferrals: Referral[];
  extendedReferral?: ExtendedReferral;
}

const initialState: ReferralsState = {
  fetchingLearners: false,
  fetchingPartners: false,
  fetchingReferral: false,
  postingReferral: false,
  learnerReferrals: [],
  partnerReferrals: [],
};

export interface ReferralsContext extends ReferralsState {
  postReferral?: (body: PostReferralBody, role: UserRole) => Promise<boolean>;
}

const initialContext: ReferralsContext = { ...initialState };

// eslint-disable-next-line
export const ReferralsContext = createContext<ReferralsContext>(initialContext);

export const useReferrals = () => useContext(ReferralsContext);

export const ReferralsConsumer = ReferralsContext.Consumer;

interface GetLearnerReferralsRequest
  extends Action<'GET_L_REFERRALS_REQUEST'> {}

interface GetLearnerReferralsSuccess extends Action<'GET_L_REFERRALS_SUCCESS'> {
  learnerReferrals: Referral[];
}

interface GetLearnerReferralsFailure
  extends Action<'GET_L_REFERRALS_FAILURE'> {}

interface GetPartnerReferralsRequest
  extends Action<'GET_P_REFERRALS_REQUEST'> {}

interface GetPartnerReferralsSuccess extends Action<'GET_P_REFERRALS_SUCCESS'> {
  partnerReferrals: Referral[];
}

interface GetPartnerReferralsFailure
  extends Action<'GET_P_REFERRALS_FAILURE'> {}

interface GetReferralRequest extends Action<'GET_REFERRAL_REQUEST'> {}

interface GetReferralSuccess extends Action<'GET_REFERRAL_SUCCESS'> {
  extendedReferral: ExtendedReferral;
}

interface GetReferralFailure extends Action<'GET_REFERRAL_FAILURE'> {}

interface PostReferralRequest extends Action<'POST_REFERRAL_REQUEST'> {}

interface PostReferralSuccess extends Action<'POST_REFERRAL_SUCCESS'> {
  referrals: Referral[];
  role: UserRole;
}

interface PostReferralFailure extends Action<'POST_REFERRAL_FAILURE'> {}

type Actions =
  | GetLearnerReferralsRequest
  | GetLearnerReferralsSuccess
  | GetLearnerReferralsFailure
  | GetPartnerReferralsRequest
  | GetPartnerReferralsSuccess
  | GetPartnerReferralsFailure
  | GetReferralRequest
  | GetReferralSuccess
  | GetReferralFailure
  | PostReferralRequest
  | PostReferralSuccess
  | PostReferralFailure;

const referralsReducer = (
  state: ReferralsState,
  action: Actions
): ReferralsState => {
  switch (action.type) {
    case 'GET_L_REFERRALS_REQUEST':
      return {
        ...state,
        fetchingLearners: true,
      };
    case 'GET_L_REFERRALS_SUCCESS':
      return {
        ...state,
        fetchingLearners: false,
        learnerReferrals: action.learnerReferrals,
      };
    case 'GET_L_REFERRALS_FAILURE':
      return {
        ...state,
        fetchingLearners: false,
      };
    case 'GET_P_REFERRALS_REQUEST':
      return {
        ...state,
        fetchingPartners: true,
      };
    case 'GET_P_REFERRALS_SUCCESS':
      return {
        ...state,
        fetchingPartners: false,
        partnerReferrals: action.partnerReferrals,
      };
    case 'GET_P_REFERRALS_FAILURE':
      return {
        ...state,
        fetchingPartners: false,
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
      if (action.role === UserRole.learner) {
        return {
          ...state,
          postingReferral: false,
          learnerReferrals: action.referrals,
        };
      } else {
        return {
          ...state,
          postingReferral: false,
          partnerReferrals: action.referrals,
        };
      }

    case 'POST_REFERRAL_FAILURE':
      return {
        ...state,
        postingReferral: false,
      };
    default:
      return state;
  }
};

interface ReferralsProviderProps {
  injectedState?: Partial<ReferralsState>;
}

export const ReferralsProvider: FC<
  PropsWithChildren<ReferralsProviderProps>
> = ({ children, injectedState }) => {
  // ----------------------------- Component state ------------------------------ //
  const [state, dispatch] = useReducer(referralsReducer, {
    ...initialState,
    ...injectedState,
  });

  // ----------------------------- Hooks ---------------------------------------- //
  const { showReferralDrawer } = useAppNav();

  // ----------------------------- Component functions ------------------------- //
  const getLearnerReferrals = async () => {
    dispatch({ type: 'GET_L_REFERRALS_REQUEST' });

    try {
      const learnerReferrals = await getReferralsByRole(UserRole.learner);

      dispatch({ type: 'GET_L_REFERRALS_SUCCESS', learnerReferrals });
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'GET_L_REFERRALS_FAILURE' });
    }
  };

  const getPartnerReferrals = async () => {
    dispatch({ type: 'GET_P_REFERRALS_REQUEST' });

    try {
      const partnerReferrals = await getReferralsByRole(UserRole.partner);

      dispatch({ type: 'GET_P_REFERRALS_SUCCESS', partnerReferrals });
    } catch (error) {
      console.error('error', error);
      dispatch({ type: 'GET_P_REFERRALS_FAILURE' });
    }
  };

  const getReferral = async (referralId: number) => {
    dispatch({ type: 'GET_REFERRAL_REQUEST' });

    try {
      const extendedReferral = await getReferralById(referralId);
      dispatch({ type: 'GET_REFERRAL_SUCCESS', extendedReferral });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_REFERRAL_FAILURE' });
    }
  };

  const postReferral = async (
    body: PostReferralBody,
    role: UserRole
  ): Promise<boolean> => {
    dispatch({ type: 'POST_REFERRAL_REQUEST' });

    try {
      const referrals = await postReferralByRole(body, role);

      dispatch({ type: 'POST_REFERRAL_SUCCESS', referrals, role });
      return true;
    } catch (error) {
      console.error(error);
      dispatch({ type: 'POST_REFERRAL_FAILURE' });
      return false;
    }
  };

  // ----------------------------- Effects ---------------------------------------- //
  useEffect(() => {
    getLearnerReferrals();
    getPartnerReferrals();
  }, []);

  useEffect(() => {
    showReferralDrawer && getReferral(showReferralDrawer);
  }, [showReferralDrawer]);

  console.log('state', state);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <ReferralsContext.Provider value={{ ...state, postReferral }}>
      {children}
    </ReferralsContext.Provider>
  );
};
