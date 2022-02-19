import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { UserRole } from '../@types/enums';
import { Action, Referral } from '../@types/interfaces';
import { getReferralsByRole } from '../services/referralsService';

export interface ReferralsState {
  fetchingLearners: boolean;
  fetchingPartners: boolean;
  learnerReferrals: Referral[];
  partnerReferrals: Referral[];
}

const initialState: ReferralsState = {
  fetchingLearners: false,
  fetchingPartners: false,
  learnerReferrals: [],
  partnerReferrals: [],
};

export interface ReferralsContext extends ReferralsState {}

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

type Actions =
  | GetLearnerReferralsRequest
  | GetLearnerReferralsSuccess
  | GetLearnerReferralsFailure
  | GetPartnerReferralsRequest
  | GetPartnerReferralsSuccess
  | GetPartnerReferralsFailure;

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
  const [state, dispatch] = useReducer(referralsReducer, {
    ...initialState,
    ...injectedState,
  });

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

  useEffect(() => {
    getLearnerReferrals();
    getPartnerReferrals();
  }, []);

  console.log('state', state);

  return (
    <ReferralsContext.Provider value={{ ...state }}>
      {children}
    </ReferralsContext.Provider>
  );
};
