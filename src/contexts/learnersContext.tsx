import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Action, LearnerDataDTO, PageableResponse } from '../@types/interfaces';
import learnersService, { GetLearnersArgs } from '../services/learnersService';
import { useAuth } from './authContext';
import {
  DEFAULT_TABLE_SIZE_DEV,
  DEFAULT_TABLE_SIZE_PROD,
} from '../config/constants';

const env = process.env.REACT_APP_ENV;

export interface LearnersState {
  fetching: boolean;
  learners: LearnerDataDTO[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

const initialState: LearnersState = {
  fetching: false,
  learners: [],
  page: 0,
  size: env === 'prod' ? DEFAULT_TABLE_SIZE_PROD : DEFAULT_TABLE_SIZE_DEV,
  totalPages: 1,
  totalElements: 1,
  last: true,
  first: true,
};

type ChangePageSize = (size: number) => void;
type ChangePageNumber = (page: number) => void;
type GetLearnersPage = (args: GetLearnersArgs) => void;

interface LearnersContext extends LearnersState {
  getLearnersPage?: GetLearnersPage;
  changePageSize?: ChangePageSize;
  changePageNumber?: ChangePageNumber;
}

const initialContext: LearnersContext = { ...initialState };

// eslint-disable-next-line
const LearnersContext = createContext<LearnersContext>(initialContext);

export const useLearners = () => useContext(LearnersContext);

interface GetLearnersRequest extends Action<'GET_LEARNERS_REQUEST'> {}

interface GetLearnersSuccess extends Action<'GET_LEARNERS_SUCCESS'> {
  page: PageableResponse<LearnerDataDTO>;
}

interface GetLearnersFailure extends Action<'GET_LEARNERS_FAILURE'> {}

interface SetPageSize extends Action<'SET_PAGE_SIZE'> {
  size: number;
}

interface SetPageNumber extends Action<'SET_PAGE_NUMBER'> {
  page: number;
}

type Actions =
  | GetLearnersRequest
  | GetLearnersSuccess
  | GetLearnersFailure
  | SetPageNumber
  | SetPageSize;

const learnersReducer = (
  state: LearnersState,
  action: Actions
): LearnersState => {
  switch (action.type) {
    case 'GET_LEARNERS_REQUEST':
      return {
        ...state,
        fetching: true,
      };
    case 'GET_LEARNERS_SUCCESS':
      return {
        ...state,
        learners: action.page.content,
        page: action.page.number,
        size: action.page.size,
        totalElements: action.page.totalElements,
        totalPages: action.page.totalPages,
        first: action.page.first,
        last: action.page.last,
        fetching: false,
      };
    case 'GET_LEARNERS_FAILURE':
      return {
        ...state,
        fetching: false,
      };
    case 'SET_PAGE_NUMBER':
      return {
        ...state,
        page: action.page,
      };
    case 'SET_PAGE_SIZE':
      return {
        ...state,
        size: action.size,
      };
    default:
      return state;
  }
};

interface Props {}

export const LearnersProvider: FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  // ----------------------------- Component state -------------------------- //
  const [state, dispatch] = useReducer(learnersReducer, initialState);
  const { loggedIn } = useAuth();

  // ----------------------------- Component functions ---------------------- //
  const getLearnersPage: GetLearnersPage = useCallback(
    async (args) => {
      dispatch({ type: 'GET_LEARNERS_REQUEST' });

      try {
        const { status, data } = await learnersService.getLearners(args);

        if (status === 200) {
          dispatch({ type: 'GET_LEARNERS_SUCCESS', page: data });
        } else {
          dispatch({ type: 'GET_LEARNERS_FAILURE' });
        }
      } catch (error) {
        console.error('error', error);
        dispatch({ type: 'GET_LEARNERS_FAILURE' });
      }
    },
    [dispatch]
  );

  const changePageSize: ChangePageSize = (size) =>
    dispatch({ type: 'SET_PAGE_SIZE', size });

  const changePageNumber: ChangePageNumber = (page) =>
    dispatch({ type: 'SET_PAGE_NUMBER', page });

  // ----------------------------- Effects ---------------------------------- //
  useEffect(() => {
    loggedIn && getLearnersPage({ size: state.size, page: state.page });
  }, [loggedIn, state.page, state.size, getLearnersPage]);

  // ----------------------------- Render ----------------------------------- //
  return (
    <LearnersContext.Provider
      value={{
        ...state,
        getLearnersPage,
        changePageSize,
        changePageNumber,
      }}
    >
      {children}
    </LearnersContext.Provider>
  );
};
