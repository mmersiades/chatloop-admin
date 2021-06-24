import React, { FC, useContext, useEffect, useReducer } from 'react';

import { getUsersByUserRole } from '../services/usersService';
import { UserRoles } from '../@types/enums';
import { Learner, Partner, Tutor } from '../@types/interfaces';

interface UsersContext {
  learners: Array<Learner>;
  partners: Array<Partner>;
  tutors: Array<Tutor>;
  fetchUsersByUserRole?: (userRole: UserRoles) => void;
}

interface UsersContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

type usersState = {
  learners: Array<Learner>;
  partners: Array<Partner>;
  tutors: Array<Tutor>;
};

const initialContext: UsersContext = {
  learners: [],
  partners: [],
  tutors: [],
};

// eslint-disable-next-line
export const UsersContext = React.createContext<UsersContext>(initialContext);

export const useUsers = () => {
  return useContext(UsersContext);
};

export type usersAction =
  | {
      type: 'SET_LEARNERS';
      payload?: Array<Learner>;
    }
  | {
      type: 'SET_PARTNERS';
      payload?: Array<Partner>;
    }
  | {
      type: 'SET_TUTORS';
      payload?: Array<Tutor>;
    };

const usersReducerInitialState: usersState = {
  learners: [],
  partners: [],
  tutors: [],
};

const usersReducer = (state: usersState, action: usersAction) => {
  switch (action.type) {
    case 'SET_LEARNERS':
      return { ...state, learners: action.payload || state.learners };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload || state.partners };
    case 'SET_TUTORS':
      return { ...state, tutors: action.payload || state.tutors };
    default:
      return state;
  }
};

export const UsersContextProvider: FC<UsersContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(usersReducer, usersReducerInitialState);

  const fetchUsersByUserRole = (userRole: UserRoles) => {
    getUsersByUserRole(userRole, dispatch);
  };

  useEffect(() => {
    fetchUsersByUserRole(UserRoles.learner);
    fetchUsersByUserRole(UserRoles.partner);
    fetchUsersByUserRole(UserRoles.tutor);
  }, []);

  return (
    <UsersContext.Provider value={{ ...state, fetchUsersByUserRole }}>
      {children}
    </UsersContext.Provider>
  );
};
