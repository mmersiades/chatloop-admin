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
  fetchingTopicTexts: boolean;
  fetchingMessages: boolean;
  dauStartDate: Date;
  mauStartDate: Date;
  topicTextsStartDate: Date;
  messagesStartDate: Date;
  dauEndDate: Date;
  mauEndDate: Date;
  topicTextsEndDate: Date;
  messagesEndDate: Date;
  dauStats?: StatsDTO;
  mauStats?: StatsDTO;
  topicTextsStats?: StatsDTO;
  messagesStats?: StatsDTO;
}

const today = new Date();
const defaultDauStartDate = new Date();
defaultDauStartDate.setDate(defaultDauStartDate.getDate() - 6);
const defaultMauStartDate = new Date();
defaultMauStartDate.setDate(defaultMauStartDate.getDate() - 27);
const defaultTopicTextStartDate = new Date();
defaultTopicTextStartDate.setDate(defaultTopicTextStartDate.getDate() - 27);
const defaultMessagesStartDate = new Date();
defaultMessagesStartDate.setDate(defaultMessagesStartDate.getDate() - 6);

const initialState: StatsState = {
  fetchingDau: false,
  fetchingMau: false,
  fetchingTopicTexts: false,
  fetchingMessages: false,
  dauStartDate: defaultDauStartDate,
  mauStartDate: defaultMauStartDate,
  topicTextsStartDate: defaultTopicTextStartDate,
  messagesStartDate: defaultMessagesStartDate,
  dauEndDate: today,
  mauEndDate: today,
  topicTextsEndDate: today,
  messagesEndDate: today,
};

type GetDauStats = (args: DateRange) => Promise<boolean>;
type GetMauStats = (args: DateRange) => Promise<boolean>;
type GetTopicTextsStats = (args: DateRange) => Promise<boolean>;
type GetMessagesStats = (args: DateRange) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetDauStats;
  getMauStats?: GetMauStats;
  getTopicTextsStats?: GetTopicTextsStats;
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
interface GetTopicTextsRequest extends Action<'GET_TOPICTEXTS_REQUEST'> {}
interface GetTopicTextsSuccess extends Action<'GET_TOPICTEXTS_SUCCESS'> {
  dto: StatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetTopicTextsFailure extends Action<'GET_TOPICTEXTS_FAILURE'> {}
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
  | GetTopicTextsRequest
  | GetTopicTextsSuccess
  | GetTopicTextsFailure
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
    case 'GET_TOPICTEXTS_REQUEST':
      return {
        ...state,
        fetchingTopicTexts: true,
      };
    case 'GET_TOPICTEXTS_SUCCESS':
      return {
        ...state,
        fetchingTopicTexts: false,
        topicTextsStats: action.dto,
        topicTextsEndDate: action.endDate,
        topicTextsStartDate: action.startDate,
      };
    case 'GET_TOPICTEXTS_FAILURE':
      return {
        ...state,
        fetchingTopicTexts: false,
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

  const getTopicTextsStats: GetTopicTextsStats = async (params) => {
    dispatch({ type: 'GET_TOPICTEXTS_REQUEST' });

    try {
      const { status, data } = await statsService.getTopicTextStats(params);

      if (status === 200) {
        dispatch({
          type: 'GET_TOPICTEXTS_SUCCESS',
          dto: data,
          startDate: params.startDate,
          endDate: params.endDate,
        });
        return true;
      } else {
        dispatch({ type: 'GET_TOPICTEXTS_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'GET_TOPICTEXTS_FAILURE' });
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
    getTopicTextsStats({
      startDate: defaultTopicTextStartDate,
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
        getTopicTextsStats,
        getMessagesStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
