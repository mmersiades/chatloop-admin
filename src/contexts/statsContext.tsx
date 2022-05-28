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
 * */

interface StatsState {
  fetchingDau: boolean;
  fetchingMau: boolean;
  fetchingCumulativeActivities: boolean;
  fetchingActivitiesInProgress: boolean;
  fetchingMessages: boolean;
  fetchingTar: boolean;
  fetchingTcr: boolean;
  dauStartDate: Date;
  mauStartDate: Date;
  cumulativeActivitiesStartDate: Date;
  activitiesInProgressStartDate: Date;
  messagesStartDate: Date;
  tarStartDate: Date;
  tcrStartDate: Date;
  dauEndDate: Date;
  mauEndDate: Date;
  cumulativeActivitiesEndDate: Date;
  activitiesInProgressEndDate: Date;
  messagesEndDate: Date;
  tarEndDate: Date;
  tcrEndDate: Date;
  dauStats?: StatsDTO;
  mauStats?: StatsDTO;
  cumulativeActivitiesStats?: StatsDTO;
  activitiesInProgressStats?: StatsDTO;
  messagesStats?: StatsDTO;
  tarStats?: StatsDTO;
  tcrStats?: StatsDTO;
}

const today = new Date();
const defaultDauStartDate = new Date();
defaultDauStartDate.setDate(defaultDauStartDate.getDate() - 6);
const defaultMauStartDate = new Date();
defaultMauStartDate.setDate(defaultMauStartDate.getDate() - 83);
const defaultCumulativeActivitiesStartDate = new Date();
defaultCumulativeActivitiesStartDate.setDate(
  defaultCumulativeActivitiesStartDate.getDate() - 83
);
const defaultActivitiesInProgressStartDate = new Date();
defaultActivitiesInProgressStartDate.setDate(
  defaultActivitiesInProgressStartDate.getDate() - 6
);
const defaultMessagesStartDate = new Date();
defaultMessagesStartDate.setDate(defaultMessagesStartDate.getDate() - 6);
const defaultTarStartDate = new Date();
defaultTarStartDate.setDate(defaultTarStartDate.getDate() - 6);
const defaultTcrStartDate = new Date();
defaultTcrStartDate.setDate(defaultTcrStartDate.getDate() - 83);

const initialState: StatsState = {
  fetchingDau: false,
  fetchingMau: false,
  fetchingCumulativeActivities: false,
  fetchingActivitiesInProgress: false,
  fetchingMessages: false,
  fetchingTar: false,
  fetchingTcr: false,
  dauStartDate: defaultDauStartDate,
  mauStartDate: defaultMauStartDate,
  cumulativeActivitiesStartDate: defaultTcrStartDate,
  messagesStartDate: defaultMessagesStartDate,
  activitiesInProgressStartDate: defaultActivitiesInProgressStartDate,
  tarStartDate: defaultTarStartDate,
  tcrStartDate: defaultTcrStartDate,
  dauEndDate: today,
  mauEndDate: today,
  cumulativeActivitiesEndDate: today,
  activitiesInProgressEndDate: today,
  messagesEndDate: today,
  tarEndDate: today,
  tcrEndDate: today,
};

type GetStats = (args: DateRange) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetStats;
  getMauStats?: GetStats;
  getCumulativeActivitiesStats?: GetStats;
  getActivitiesInProgressStats?: GetStats;
  getMessagesStats?: GetStats;
  getTarStats?: GetStats;
  getTcrStats?: GetStats;
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

interface GetCumulativeActivitiesRequest
  extends Action<'GET_CUM_ACTIVITIES_REQUEST'> {}
interface GetCumulativeActivitiesSuccess
  extends Action<'GET_CUM_ACTIVITIES_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetCumulativeActivitiesFailure
  extends Action<'GET_CUM_ACTIVITIES_FAILURE'> {}

interface GetActivitiesInProgressRequest
  extends Action<'GET_ACTIVITIES_PROGRESS_REQUEST'> {}
interface GetActivitiesInProgressSuccess
  extends Action<'GET_ACTIVITIES_PROGRESS_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetActivitiesInProgressFailure
  extends Action<'GET_ACTIVITIES_PROGRESS_FAILURE'> {}

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

type Actions =
  | GetDauRequest
  | GetDauSuccess
  | GetDauFailure
  | GetMauRequest
  | GetMauSuccess
  | GetMauFailure
  | GetCumulativeActivitiesRequest
  | GetCumulativeActivitiesSuccess
  | GetCumulativeActivitiesFailure
  | GetActivitiesInProgressRequest
  | GetActivitiesInProgressSuccess
  | GetActivitiesInProgressFailure
  | GetMessagesRequest
  | GetMessagesSuccess
  | GetMessagesFailure
  | GetTarRequest
  | GetTarSuccess
  | GetTarFailure
  | GetTcrRequest
  | GetTcrSuccess
  | GetTcrFailure;

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
    case 'GET_CUM_ACTIVITIES_REQUEST':
      return {
        ...state,
        fetchingCumulativeActivities: true,
      };
    case 'GET_CUM_ACTIVITIES_SUCCESS':
      return {
        ...state,
        fetchingCumulativeActivities: false,
        cumulativeActivitiesStats: action.dto,
        cumulativeActivitiesEndDate: action.endDate,
        cumulativeActivitiesStartDate: action.startDate,
      };
    case 'GET_CUM_ACTIVITIES_FAILURE':
      return {
        ...state,
        fetchingCumulativeActivities: false,
      };
    case 'GET_ACTIVITIES_PROGRESS_REQUEST':
      return {
        ...state,
        fetchingActivitiesInProgress: true,
      };
    case 'GET_ACTIVITIES_PROGRESS_SUCCESS':
      return {
        ...state,
        fetchingActivitiesInProgress: false,
        activitiesInProgressStats: action.dto,
        activitiesInProgressEndDate: action.endDate,
        activitiesInProgressStartDate: action.startDate,
      };
    case 'GET_ACTIVITIES_PROGRESS_FAILURE':
      return {
        ...state,
        fetchingActivitiesInProgress: false,
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
    default:
      return state;
  }
};

interface Props {}

export const StatsProvider: FC<PropsWithChildren<Props>> = ({ children }) => {
  // -------------------------- Component state ---------------------------- //
  const [state, dispatch] = useReducer(statsReducer, initialState);

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

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

  const getCumulativeActivitiesStats: GetStats = async (params) => {
    dispatch({ type: 'GET_CUM_ACTIVITIES_REQUEST' });

    try {
      const { status, data } = await statsService.getCumulativeActivitiesStats(
        params
      );

      if (status === 200) {
        dispatch({
          type: 'GET_CUM_ACTIVITIES_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_CUM_ACTIVITIES_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_CUM_ACTIVITIES_FAILURE' });
      return false;
    }
  };

  const getActivitiesInProgressStats: GetStats = async (params) => {
    dispatch({ type: 'GET_ACTIVITIES_PROGRESS_REQUEST' });

    try {
      const { status, data } = await statsService.getActivitiesInProgressStats(
        params
      );

      if (status === 200) {
        dispatch({
          type: 'GET_ACTIVITIES_PROGRESS_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_ACTIVITIES_PROGRESS_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_ACTIVITIES_PROGRESS_FAILURE' });
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

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getDauStats({ startDate: defaultDauStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getMauStats({ startDate: defaultMauStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getCumulativeActivitiesStats({
      startDate: defaultTcrStartDate,
      endDate: today,
    });
    // noinspection JSIgnoredPromiseFromCall
    getActivitiesInProgressStats({
      startDate: defaultActivitiesInProgressStartDate,
      endDate: today,
    });
    // noinspection JSIgnoredPromiseFromCall
    getMessagesStats({ startDate: defaultMessagesStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getTarStats({ startDate: defaultTarStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getTcrStats({ startDate: defaultTcrStartDate, endDate: today });
  }, []);

  // -------------------------- Render ------------------------------------- //
  return (
    <StatsContext.Provider
      value={{
        ...state,
        getDauStats,
        getMauStats,
        getCumulativeActivitiesStats,
        getActivitiesInProgressStats,
        getMessagesStats,
        getTarStats,
        getTcrStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
