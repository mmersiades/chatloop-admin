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

interface StatsState {
  fetchingDau: boolean;
  fetchingMau: boolean;
  fetchingCumulativeActivities: boolean;
  fetchingActivitiesInProgress: boolean;
  fetchingMessages: boolean;
  dauStartDate: Date;
  mauStartDate: Date;
  cumulativeActivitiesStartDate: Date;
  activitiesInProgressStartDate: Date;
  messagesStartDate: Date;
  dauEndDate: Date;
  mauEndDate: Date;
  cumulativeActivitiesEndDate: Date;
  activitiesInProgressEndDate: Date;
  messagesEndDate: Date;
  dauStats?: StatsDTO;
  mauStats?: StatsDTO;
  cumulativeActivitiesStats?: StatsDTO;
  activitiesInProgressStats?: StatsDTO;
  messagesStats?: StatsDTO;
}

const today = new Date();
const defaultDauStartDate = new Date();
defaultDauStartDate.setDate(defaultDauStartDate.getDate() - 6);
const defaultMauStartDate = new Date();
defaultMauStartDate.setDate(defaultMauStartDate.getDate() - 27);
const defaultCumulativeActivitiesStartDate = new Date();
defaultCumulativeActivitiesStartDate.setDate(
  defaultCumulativeActivitiesStartDate.getDate() - 27
);
const defaultActivitiesInProgressStartDate = new Date();
defaultActivitiesInProgressStartDate.setDate(
  defaultActivitiesInProgressStartDate.getDate() - 6
);
const defaultMessagesStartDate = new Date();
defaultMessagesStartDate.setDate(defaultMessagesStartDate.getDate() - 6);

const initialState: StatsState = {
  fetchingDau: false,
  fetchingMau: false,
  fetchingCumulativeActivities: false,
  fetchingActivitiesInProgress: false,
  fetchingMessages: false,
  dauStartDate: defaultDauStartDate,
  mauStartDate: defaultMauStartDate,
  cumulativeActivitiesStartDate: defaultCumulativeActivitiesStartDate,
  messagesStartDate: defaultMessagesStartDate,
  activitiesInProgressStartDate: defaultActivitiesInProgressStartDate,
  dauEndDate: today,
  mauEndDate: today,
  cumulativeActivitiesEndDate: today,
  activitiesInProgressEndDate: today,
  messagesEndDate: today,
};

type GetDauStats = (args: DateRange) => Promise<boolean>;
type GetMauStats = (args: DateRange) => Promise<boolean>;
type GetCumulativeActivitiesStats = (args: DateRange) => Promise<boolean>;
type GetActivitiesInProgressStats = (args: DateRange) => Promise<boolean>;
type GetMessagesStats = (args: DateRange) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetDauStats;
  getMauStats?: GetMauStats;
  getCumulativeActivitiesStats?: GetCumulativeActivitiesStats;
  getActivitiesInProgressStats?: GetActivitiesInProgressStats;
  getMessagesStats?: GetMessagesStats;
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
  | GetMessagesFailure;

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
  const getDauStats: GetDauStats = async (params) => {
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

  const getMauStats: GetMauStats = async (params) => {
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

  const getCumulativeActivitiesStats: GetCumulativeActivitiesStats = async (
    params
  ) => {
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

  const getActivitiesInProgressStats: GetActivitiesInProgressStats = async (
    params
  ) => {
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

  const getMessagesStats: GetMessagesStats = async (params) => {
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

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getDauStats({ startDate: defaultDauStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getMauStats({ startDate: defaultMauStartDate, endDate: today });
    // noinspection JSIgnoredPromiseFromCall
    getCumulativeActivitiesStats({
      startDate: defaultCumulativeActivitiesStartDate,
      endDate: today,
    });
    // noinspection JSIgnoredPromiseFromCall
    getActivitiesInProgressStats({
      startDate: defaultActivitiesInProgressStartDate,
      endDate: today,
    });
    // noinspection JSIgnoredPromiseFromCall
    getMessagesStats({ startDate: defaultMessagesStartDate, endDate: today });
  }, []);

  // -------------------------- Render ------------------------------------- //
  return (
    <StatsContext.Provider
      value={{
        ...state,
        getDauStats,
        getMauStats,
        getCumulativeActivitiesStats,
        getMessagesStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
