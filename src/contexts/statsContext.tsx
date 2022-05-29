import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import statsService, { StatsDTO, DateRange } from '../services/statsService';
import { Action } from '../@types/interfaces';

/*
 * ACRONYMS
 * dau = daily active user
 * mau = monthly active user
 * tar = total active referrals
 * tcr = total cumulative referrals
 * or = organisation referrer
 * ooa = organisation org admin
 * ca = cumulative activities
 * aip = activities in progress
 * oar = org active referrals
 * oer = org expired referrals
 * oai = org accepted invitations
 * */

interface StatsState {
  fetchingDau: boolean;
  fetchingMau: boolean;
  fetchingCa: boolean;
  fetchingAip: boolean;
  fetchingMessages: boolean;
  fetchingTar: boolean;
  fetchingTcr: boolean;
  fetchingOr: boolean;
  fetchingOoa: boolean;
  fetchingOar: boolean;
  fetchingOer: boolean;
  fetchingOai: boolean;
  dauStartDate: Date;
  mauStartDate: Date;
  caStartDate: Date;
  aipStartDate: Date;
  messagesStartDate: Date;
  tarStartDate: Date;
  tcrStartDate: Date;
  orStartDate: Date;
  ooaStartDate: Date;
  oarStartDate: Date;
  oerStartDate: Date;
  oaiStartDate: Date;
  dauEndDate: Date;
  mauEndDate: Date;
  caEndDate: Date;
  aipEndDate: Date;
  messagesEndDate: Date;
  tarEndDate: Date;
  tcrEndDate: Date;
  orEndDate: Date;
  ooaEndDate: Date;
  oarEndDate: Date;
  oerEndDate: Date;
  oaiEndDate: Date;
  dauStats?: StatsDTO;
  mauStats?: StatsDTO;
  caStats?: StatsDTO;
  aipStats?: StatsDTO;
  messagesStats?: StatsDTO;
  tarStats?: StatsDTO;
  tcrStats?: StatsDTO;
  orStats?: StatsDTO;
  ooaStats?: StatsDTO;
  oarStats?: StatsDTO;
  oerStats?: StatsDTO;
  oaiStats?: StatsDTO;
}

const today = new Date();
const dailyStartDate = new Date();
dailyStartDate.setDate(dailyStartDate.getDate() - 6);
const monthlyStartDate = new Date();
monthlyStartDate.setDate(monthlyStartDate.getDate() - 83);

const initialState: StatsState = {
  fetchingDau: false,
  fetchingMau: false,
  fetchingCa: false,
  fetchingAip: false,
  fetchingMessages: false,
  fetchingTar: false,
  fetchingTcr: false,
  fetchingOr: false,
  fetchingOoa: false,
  fetchingOar: false,
  fetchingOer: false,
  fetchingOai: false,
  dauStartDate: dailyStartDate,
  mauStartDate: monthlyStartDate,
  caStartDate: monthlyStartDate,
  messagesStartDate: dailyStartDate,
  aipStartDate: dailyStartDate,
  tarStartDate: dailyStartDate,
  tcrStartDate: monthlyStartDate,
  orStartDate: monthlyStartDate,
  ooaStartDate: monthlyStartDate,
  oarStartDate: monthlyStartDate,
  oerStartDate: monthlyStartDate,
  oaiStartDate: monthlyStartDate,
  dauEndDate: today,
  mauEndDate: today,
  caEndDate: today,
  aipEndDate: today,
  messagesEndDate: today,
  tarEndDate: today,
  tcrEndDate: today,
  orEndDate: today,
  ooaEndDate: today,
  oarEndDate: today,
  oerEndDate: today,
  oaiEndDate: today,
};
interface OrgStatsArgs extends DateRange {
  orgIds: number[];
}

type GetStats = (args: DateRange) => Promise<boolean>;
type GetOrgStats = (args: OrgStatsArgs) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetStats;
  getMauStats?: GetStats;
  getCaStats?: GetStats;
  getAipStats?: GetStats;
  getMessagesStats?: GetStats;
  getTarStats?: GetStats;
  getTcrStats?: GetStats;
  getOrStats?: GetOrgStats;
  getOoaStats?: GetOrgStats;
  getOarStats?: GetOrgStats;
  getOerStats?: GetOrgStats;
  getOaiStats?: GetOrgStats;
}

const initialContext: StatsContext = { ...initialState };

// eslint-disable-next-line @typescript-eslint/no-redeclare
const StatsContext = createContext<StatsContext>(initialContext);

export const useStats = () => useContext(StatsContext);

interface GetDauRequest extends Action<'GET_DAU_REQUEST'> {}
interface GetDauSuccess extends Action<'GET_DAU_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetDauFailure extends Action<'GET_DAU_FAILURE'> {}

interface GetMauRequest extends Action<'GET_MAU_REQUEST'> {}
interface GetMauSuccess extends Action<'GET_MAU_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetMauFailure extends Action<'GET_MAU_FAILURE'> {}

interface GetCaRequest extends Action<'GET_CA_REQUEST'> {}
interface GetCaSuccess extends Action<'GET_CA_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetCaFailure extends Action<'GET_CA_FAILURE'> {}

interface GetAipRequest extends Action<'GET_AIP_REQUEST'> {}
interface GetAipSuccess extends Action<'GET_AIP_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetAipFailure extends Action<'GET_AIP_FAILURE'> {}

interface GetMessagesRequest extends Action<'GET_MESSAGES_REQUEST'> {}
interface GetMessagesSuccess extends Action<'GET_MESSAGES_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetMessagesFailure extends Action<'GET_MESSAGES_FAILURE'> {}

interface GetTarRequest extends Action<'GET_TAR_REQUEST'> {}
interface GetTarSuccess extends Action<'GET_TAR_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetTarFailure extends Action<'GET_TAR_FAILURE'> {}

interface GetTcrRequest extends Action<'GET_TCR_REQUEST'> {}
interface GetTcrSuccess extends Action<'GET_TCR_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetTcrFailure extends Action<'GET_TCR_FAILURE'> {}

interface GetOrRequest extends Action<'GET_OR_REQUEST'> {}
interface GetOrSuccess extends Action<'GET_OR_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetOrFailure extends Action<'GET_OR_FAILURE'> {}

interface GetOoaRequest extends Action<'GET_OOA_REQUEST'> {}
interface GetOoaSuccess extends Action<'GET_OOA_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetOoaFailure extends Action<'GET_OOA_FAILURE'> {}

interface GetOarRequest extends Action<'GET_OAR_REQUEST'> {}
interface GetOarSuccess extends Action<'GET_OAR_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetOarFailure extends Action<'GET_OAR_FAILURE'> {}

interface GetOerRequest extends Action<'GET_OER_REQUEST'> {}
interface GetOerSuccess extends Action<'GET_OER_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetOerFailure extends Action<'GET_OER_FAILURE'> {}

interface GetOaiRequest extends Action<'GET_OAI_REQUEST'> {}
interface GetOaiSuccess extends Action<'GET_OAI_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetOaiFailure extends Action<'GET_OAI_FAILURE'> {}

type Actions =
  | GetDauRequest
  | GetDauSuccess
  | GetDauFailure
  | GetMauRequest
  | GetMauSuccess
  | GetMauFailure
  | GetCaRequest
  | GetCaSuccess
  | GetCaFailure
  | GetAipRequest
  | GetAipSuccess
  | GetAipFailure
  | GetMessagesRequest
  | GetMessagesSuccess
  | GetMessagesFailure
  | GetTarRequest
  | GetTarSuccess
  | GetTarFailure
  | GetTcrRequest
  | GetTcrSuccess
  | GetTcrFailure
  | GetOrRequest
  | GetOrSuccess
  | GetOrFailure
  | GetOoaRequest
  | GetOoaSuccess
  | GetOoaFailure
  | GetOarRequest
  | GetOarSuccess
  | GetOarFailure
  | GetOerRequest
  | GetOerSuccess
  | GetOerFailure
  | GetOaiRequest
  | GetOaiSuccess
  | GetOaiFailure;

const statsReducer = (state: StatsState, action: Actions): StatsState => {
  switch (action.type) {
    case 'GET_DAU_REQUEST':
      return {
        ...state,
        fetchingDau: true,
      };
    case 'GET_DAU_SUCCESS':
      return {
        ...state,
        fetchingDau: false,
        dauStats: action.dto,
        dauEndDate: action.endDate,
        dauStartDate: action.startDate,
      };
    case 'GET_DAU_FAILURE':
      return {
        ...state,
        fetchingDau: false,
      };
    case 'GET_MAU_REQUEST':
      return {
        ...state,
        fetchingMau: true,
      };
    case 'GET_MAU_SUCCESS':
      return {
        ...state,
        fetchingMau: false,
        mauStats: action.dto,
        mauEndDate: action.endDate,
        mauStartDate: action.startDate,
      };
    case 'GET_MAU_FAILURE':
      return {
        ...state,
        fetchingMau: false,
      };
    case 'GET_CA_REQUEST':
      return {
        ...state,
        fetchingCa: true,
      };
    case 'GET_CA_SUCCESS':
      return {
        ...state,
        fetchingCa: false,
        caStats: action.dto,
        caEndDate: action.endDate,
        caStartDate: action.startDate,
      };
    case 'GET_CA_FAILURE':
      return {
        ...state,
        fetchingCa: false,
      };
    case 'GET_AIP_REQUEST':
      return {
        ...state,
        fetchingAip: true,
      };
    case 'GET_AIP_SUCCESS':
      return {
        ...state,
        fetchingAip: false,
        aipStats: action.dto,
        aipEndDate: action.endDate,
        aipStartDate: action.startDate,
      };
    case 'GET_AIP_FAILURE':
      return {
        ...state,
        fetchingAip: false,
      };
    case 'GET_MESSAGES_REQUEST':
      return {
        ...state,
        fetchingMessages: true,
      };
    case 'GET_MESSAGES_SUCCESS':
      return {
        ...state,
        fetchingMessages: false,
        messagesStats: action.dto,
        messagesEndDate: action.endDate,
        messagesStartDate: action.startDate,
      };
    case 'GET_MESSAGES_FAILURE':
      return {
        ...state,
        fetchingMessages: false,
      };
    case 'GET_TAR_REQUEST':
      return {
        ...state,
        fetchingTar: true,
      };
    case 'GET_TAR_SUCCESS':
      return {
        ...state,
        fetchingTar: false,
        tarStats: action.dto,
        tarEndDate: action.endDate,
        tarStartDate: action.startDate,
      };
    case 'GET_TAR_FAILURE':
      return {
        ...state,
        fetchingTar: false,
      };
    case 'GET_TCR_REQUEST':
      return {
        ...state,
        fetchingTcr: true,
      };
    case 'GET_TCR_SUCCESS':
      return {
        ...state,
        fetchingTcr: false,
        tcrStats: action.dto,
        tcrEndDate: action.endDate,
        tcrStartDate: action.startDate,
      };
    case 'GET_TCR_FAILURE':
      return {
        ...state,
        fetchingTcr: false,
      };
    case 'GET_OR_REQUEST':
      return {
        ...state,
        fetchingOr: true,
      };
    case 'GET_OR_SUCCESS':
      return {
        ...state,
        fetchingOr: false,
        orStats: action.dto,
        orEndDate: action.endDate,
        orStartDate: action.startDate,
      };
    case 'GET_OR_FAILURE':
      return {
        ...state,
        fetchingOr: false,
      };
    case 'GET_OOA_REQUEST':
      return {
        ...state,
        fetchingOoa: true,
      };
    case 'GET_OOA_SUCCESS':
      return {
        ...state,
        fetchingOoa: false,
        ooaStats: action.dto,
        ooaEndDate: action.endDate,
        ooaStartDate: action.startDate,
      };
    case 'GET_OOA_FAILURE':
      return {
        ...state,
        fetchingOoa: false,
      };
    case 'GET_OAR_REQUEST':
      return {
        ...state,
        fetchingOar: true,
      };
    case 'GET_OAR_SUCCESS':
      return {
        ...state,
        fetchingOar: false,
        oarStats: action.dto,
        oarEndDate: action.endDate,
        oarStartDate: action.startDate,
      };
    case 'GET_OAR_FAILURE':
      return {
        ...state,
        fetchingOar: false,
      };
    case 'GET_OER_REQUEST':
      return {
        ...state,
        fetchingOer: true,
      };
    case 'GET_OER_SUCCESS':
      return {
        ...state,
        fetchingOer: false,
        oerStats: action.dto,
        oerEndDate: action.endDate,
        oerStartDate: action.startDate,
      };
    case 'GET_OER_FAILURE':
      return {
        ...state,
        fetchingOer: false,
      };
    case 'GET_OAI_REQUEST':
      return {
        ...state,
        fetchingOai: true,
      };
    case 'GET_OAI_SUCCESS':
      return {
        ...state,
        fetchingOai: false,
        oaiStats: action.dto,
        oaiEndDate: action.endDate,
        oaiStartDate: action.startDate,
      };
    case 'GET_OAI_FAILURE':
      return {
        ...state,
        fetchingOai: false,
      };
    default:
      return state;
  }
};

interface Props {}

export const StatsProvider: FC<PropsWithChildren<Props>> = ({ children }) => {
  // -------------------------- Component state ---------------------------- //
  const [state, dispatch] = useReducer(statsReducer, initialState);

  // -------------------------- Component functions ------------------------ //
  const getDauStats: GetStats = async (params) => {
    dispatch({ type: 'GET_DAU_REQUEST' });

    try {
      const { status, data } = await statsService.getDauStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_DAU_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_DAU_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_DAU_FAILURE' });
      return false;
    }
  };

  const getMauStats: GetStats = async (params) => {
    dispatch({ type: 'GET_MAU_REQUEST' });

    try {
      const { status, data } = await statsService.getMauStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_MAU_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_MAU_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_MAU_FAILURE' });
      return false;
    }
  };

  const getCaStats: GetStats = async (params) => {
    dispatch({ type: 'GET_CA_REQUEST' });

    try {
      const { status, data } = await statsService.getCaStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_CA_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_CA_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_CA_FAILURE' });
      return false;
    }
  };

  const getAipStats: GetStats = async (params) => {
    dispatch({ type: 'GET_AIP_REQUEST' });

    try {
      const { status, data } = await statsService.getAipStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_AIP_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_AIP_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_AIP_FAILURE' });
      return false;
    }
  };

  const getMessagesStats: GetStats = async (params) => {
    dispatch({ type: 'GET_MESSAGES_REQUEST' });

    try {
      const { status, data } = await statsService.getMessagesStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_MESSAGES_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_MESSAGES_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_MESSAGES_FAILURE' });
      return false;
    }
  };

  const getTarStats: GetStats = async (params) => {
    dispatch({ type: 'GET_TAR_REQUEST' });

    try {
      const { status, data } = await statsService.getTarStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_TAR_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_TAR_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_TAR_FAILURE' });
      return false;
    }
  };

  const getTcrStats: GetStats = async (params) => {
    dispatch({ type: 'GET_TCR_REQUEST' });

    try {
      const { status, data } = await statsService.getTcrStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_TCR_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_TCR_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_TCR_FAILURE' });
      return false;
    }
  };

  const getOrStats: GetOrgStats = async (args) => {
    dispatch({ type: 'GET_OR_REQUEST' });

    try {
      const { status, data } = await statsService.getOrgStats({
        type: 'referrers',
        ...args,
      });

      if (status === 200) {
        dispatch({
          type: 'GET_OR_SUCCESS',
          dto: data,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_OR_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_OR_FAILURE' });
      return false;
    }
  };

  const getOoaStats: GetOrgStats = async (args) => {
    dispatch({ type: 'GET_OOA_REQUEST' });

    try {
      const { status, data } = await statsService.getOrgStats({
        type: 'org-admins',
        ...args,
      });

      if (status === 200) {
        dispatch({
          type: 'GET_OOA_SUCCESS',
          dto: data,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_OOA_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_OOA_FAILURE' });
      return false;
    }
  };

  const getOarStats: GetOrgStats = async (args) => {
    dispatch({ type: 'GET_OAR_REQUEST' });

    try {
      const { status, data } = await statsService.getOrgStats({
        type: 'active-referrals',
        ...args,
      });

      if (status === 200) {
        dispatch({
          type: 'GET_OAR_SUCCESS',
          dto: data,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_OAR_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_OAR_FAILURE' });
      return false;
    }
  };

  const getOerStats: GetOrgStats = async (args) => {
    dispatch({ type: 'GET_OER_REQUEST' });

    try {
      const { status, data } = await statsService.getOrgStats({
        type: 'expired-referrals',
        ...args,
      });

      if (status === 200) {
        dispatch({
          type: 'GET_OER_SUCCESS',
          dto: data,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_OER_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_OER_FAILURE' });
      return false;
    }
  };

  const getOaiStats: GetOrgStats = async (args) => {
    dispatch({ type: 'GET_OAI_REQUEST' });

    try {
      const { status, data } = await statsService.getOrgStats({
        type: 'accepted-invitations',
        ...args,
      });

      console.log('data', data);

      if (status === 200) {
        dispatch({
          type: 'GET_OAI_SUCCESS',
          dto: data,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_OAI_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_OAI_FAILURE' });
      return false;
    }
  };

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getDauStats({ startDate: dailyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getMauStats({ startDate: monthlyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getCaStats({ startDate: monthlyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getAipStats({ startDate: dailyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getMessagesStats({ startDate: dailyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getTarStats({ startDate: dailyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getTcrStats({ startDate: monthlyStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getOrStats({ startDate: monthlyStartDate, endDate: today, orgIds: [] });
    // noinspection JSIgnoredPromiseFromCall
    getOoaStats({ startDate: monthlyStartDate, endDate: today, orgIds: [] });
    // noinspection JSIgnoredPromiseFromCall
    getOarStats({ startDate: monthlyStartDate, endDate: today, orgIds: [] });
    // noinspection JSIgnoredPromiseFromCall
    getOerStats({ startDate: monthlyStartDate, endDate: today, orgIds: [] });
    // noinspection JSIgnoredPromiseFromCall
    getOaiStats({ startDate: monthlyStartDate, endDate: today, orgIds: [] });
  }, []);

  // -------------------------- Render ------------------------------------- //
  return (
    <StatsContext.Provider
      value={{
        ...state,
        getDauStats,
        getMauStats,
        getCaStats,
        getAipStats,
        getMessagesStats,
        getTarStats,
        getTcrStats,
        getOrStats,
        getOoaStats,
        getOarStats,
        getOerStats,
        getOaiStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
