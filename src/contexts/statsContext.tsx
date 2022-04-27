import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import statsService, { DauStatsDTO, DateRange } from '../services/statsService';
import { Action } from '../@types/interfaces';
import referralsService from '../services/referralsService';

interface StatsState {
  fetchingDau: boolean;
  dauStartDate: Date;
  dauEndDate: Date;
  dauStats?: DauStatsDTO;
}

const defaultDauStartDate = new Date();
defaultDauStartDate.setDate(defaultDauStartDate.getDate() - 6);
const defaultDauEndDate = new Date();

const initialState: StatsState = {
  fetchingDau: false,
  dauStartDate: defaultDauStartDate,
  dauEndDate: defaultDauEndDate,
};

type GetDauStats = (args: DateRange) => Promise<boolean>;

interface StatsContext extends StatsState {
  getDauStats?: GetDauStats;
}

const initialContext: StatsContext = { ...initialState };

// eslint-disable-next-line @typescript-eslint/no-redeclare
const StatsContext = createContext<StatsContext>(initialContext);

export const useStats = () => useContext(StatsContext);

interface GetDauRequest extends Action<'GET_DAU_REQUEST'> {}
interface GetDauSuccess extends Action<'GET_DAU_SUCCESS'> {
  dto: DauStatsDTO;
  startDate: Date;
  endDate: Date;
}
interface GetDauFailure extends Action<'GET_DAU_FAILURE'> {}

type Actions = GetDauRequest | GetDauSuccess | GetDauFailure;

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
  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    getDauStats({ startDate: defaultDauStartDate, endDate: defaultDauEndDate });
  }, []);

  // -------------------------- Render ------------------------------------- //
  return (
    <StatsContext.Provider value={{ ...state, getDauStats }}>
      {children}
    </StatsContext.Provider>
  );
};
