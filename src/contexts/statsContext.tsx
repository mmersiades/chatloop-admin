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
  dauStartDate: Date;
  mauStartDate: Date;
  dauEndDate: Date;
  mauEndDate: Date;
  dauStats?: StatsDTO;
  mauStats?: StatsDTO;
}

const defaultDauStartDate = new Date();
defaultDauStartDate.setDate(defaultDauStartDate.getDate() - 6);
const defaultDauEndDate = new Date();
const defaultMauStartDate = new Date();
defaultMauStartDate.setDate(defaultMauStartDate.getDate() - 27);
const defaultMauEndDate = new Date();

const initialState: StatsState = {
  fetchingDau: false,
  fetchingMau: false,
  dauStartDate: defaultDauStartDate,
  mauStartDate: defaultMauStartDate,
  dauEndDate: defaultDauEndDate,
  mauEndDate: defaultMauEndDate,
};

type GetDauStats = (args: DateRange) => Promise<boolean>;
type GetMauStats = (args: DateRange) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetDauStats;
  getMauStats?: GetMauStats;
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

type Actions =
  | GetDauRequest
  | GetDauSuccess
  | GetDauFailure
  | GetMauRequest
  | GetMauSuccess
  | GetMauFailure;

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

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getDauStats({ startDate: defaultDauStartDate, endDate: defaultDauEndDate });
    // noinspection JSIgnoredPromiseFromCall
    getMauStats({ startDate: defaultMauStartDate, endDate: defaultMauEndDate });
  }, []);

  // -------------------------- Render ------------------------------------- //
  return (
    <StatsContext.Provider value={{ ...state, getDauStats, getMauStats }}>
      {children}
    </StatsContext.Provider>
  );
};
