import React, { FC, useContext, useEffect, useReducer } from 'react';

import { getAllTutors, getUsersByRole } from '../services/usersService';
import { UserRole } from '../@types/enums';
import {
  Action,
  Learner,
  OrgAdmin,
  Partner,
  Referrer,
  Tutor,
} from '../@types/interfaces';

interface UsersState {
  fetchingUsers: boolean;
  learners: Learner[];
  partners: Partner[];
  tutors: Tutor[];
  referrers: Referrer[];
  orgAdmins: OrgAdmin[];
}

const initialState: UsersState = {
  fetchingUsers: false,
  learners: [],
  partners: [],
  tutors: [],
  referrers: [],
  orgAdmins: [],
};

interface UsersContext extends UsersState {
  fetchUsersByUserRole?: (userRole: UserRole) => void;
  fetchAllUsers?: () => void;
}

interface UsersContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

const initialContext: UsersContext = {
  ...initialState,
};

export const usersContext = React.createContext<UsersContext>(initialContext);

export const useUsers = () => useContext(usersContext);

interface GetAllUsersRequest extends Action<'GET_ALL_USERS_REQUEST'> {}

interface GetAllUsersSuccess extends Action<'GET_ALL_USERS_SUCCESS'> {
  learners: Learner[];
  partners: Partner[];
  tutors: Tutor[];
  orgAdmins: OrgAdmin[];
  referrers: Referrer[];
}

interface GetAllUsersFailure extends Action<'GET_ALL_USERS_FAILURE'> {}

interface SetLearners extends Action<'SET_LEARNERS'> {
  learners: Learner[];
}

interface SetPartners extends Action<'SET_PARTNERS'> {
  partners: Partner[];
}

interface SetTutors extends Action<'SET_TUTORS'> {
  tutors: Tutor[];
}

interface SetOrgAdmins extends Action<'SET_ORG_ADMINS'> {
  orgAdmins: OrgAdmin[];
}

interface SetReferrers extends Action<'SET_REFERRERS'> {
  referrers: Referrer[];
}

export type usersAction =
  | GetAllUsersRequest
  | GetAllUsersSuccess
  | GetAllUsersFailure
  | SetLearners
  | SetPartners
  | SetTutors
  | SetOrgAdmins
  | SetReferrers;

const usersReducer = (state: UsersState, action: usersAction): UsersState => {
  switch (action.type) {
    case 'SET_LEARNERS':
      return { ...state, learners: action.learners };
    case 'SET_PARTNERS':
      return { ...state, partners: action.partners };
    case 'SET_TUTORS':
      return { ...state, tutors: action.tutors };
    case 'SET_ORG_ADMINS':
      return { ...state, orgAdmins: action.orgAdmins };
    case 'SET_REFERRERS':
      return { ...state, referrers: action.referrers };
    case 'GET_ALL_USERS_REQUEST':
      return {
        ...state,
        fetchingUsers: true,
      };
    case 'GET_ALL_USERS_SUCCESS':
      return {
        ...state,
        fetchingUsers: false,
        learners: action.learners,
        partners: action.partners,
        tutors: action.tutors,
        orgAdmins: action.orgAdmins,
        referrers: action.referrers,
      };
    case 'GET_ALL_USERS_FAILURE':
      return {
        ...state,
        fetchingUsers: false,
      };
    default:
      return state;
  }
};

export const UsersContextProvider: FC<UsersContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(usersReducer, initialContext);

  const fetchUsersByUserRole = async (userRole: UserRole) => {
    try {
      const { status, data } = await getUsersByRole(userRole);
      if (status === 200) {
        switch (userRole) {
          case UserRole.learner:
            dispatch({
              type: 'SET_LEARNERS',
              learners: data.users as Learner[],
            });
            break;
          case UserRole.partner:
            dispatch({
              type: 'SET_PARTNERS',
              partners: data.users as Partner[],
            });
            break;
          case UserRole.tutor:
            dispatch({ type: 'SET_TUTORS', tutors: data.users as Tutor[] });
            break;
          case UserRole.orgAdmin:
            dispatch({
              type: 'SET_ORG_ADMINS',
              orgAdmins: data.users as OrgAdmin[],
            });
            break;
          case UserRole.referrer:
            dispatch({
              type: 'SET_REFERRERS',
              referrers: data.users as Referrer[],
            });
            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllUsers = async () => {
    dispatch({ type: 'GET_ALL_USERS_REQUEST' });

    try {
      const [learners, partners, tutors, orgAdmins, referrers] =
        await Promise.all([
          getUsersByRole<Learner>(UserRole.learner).then(
            ({ data }) => data.users
          ),
          getUsersByRole<Partner>(UserRole.partner).then(
            ({ data }) => data.users
          ),
          getAllTutors<Tutor>().then(({ data }) => data.users),
          getUsersByRole<OrgAdmin>(UserRole.orgAdmin).then(
            ({ data }) => data.users
          ),
          getUsersByRole<Referrer>(UserRole.referrer).then(
            ({ data }) => data.users
          ),
        ]);
      dispatch({
        type: 'GET_ALL_USERS_SUCCESS',
        learners,
        partners,
        tutors,
        orgAdmins,
        referrers,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'GET_ALL_USERS_FAILURE' });
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchAllUsers();
  }, []);

  return (
    <usersContext.Provider
      value={{ ...state, fetchUsersByUserRole, fetchAllUsers }}
    >
      {children}
    </usersContext.Provider>
  );
};
