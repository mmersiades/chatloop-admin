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

export const DEFAULT_LEARNERS_SIZE = 25;

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
  size: DEFAULT_LEARNERS_SIZE,
  totalPages: 1,
  totalElements: 1,
  last: true,
  first: true,
};

type GetLearnersPage = (args: GetLearnersArgs) => void;

interface LearnersContext extends LearnersState {
  getLearnersPage?: GetLearnersPage;
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

type Actions = GetLearnersRequest | GetLearnersSuccess | GetLearnersFailure;

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

  // ----------------------------- Effects ---------------------------------- //
  useEffect(() => {
    loggedIn && getLearnersPage({ page: 0, size: DEFAULT_LEARNERS_SIZE });
  }, [loggedIn, getLearnersPage]);

  // ----------------------------- Render ----------------------------------- //
  return (
    <LearnersContext.Provider
      value={{
        ...state,
        getLearnersPage,
      }}
    >
      {children}
    </LearnersContext.Provider>
  );
};
