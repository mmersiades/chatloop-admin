import React, { useContext } from 'react';
import { Learner, Partner, Tutor } from '../@types/interfaces';
import { usersAction } from '../pages/UsersPage';

interface UsersContext {
  learners?: Array<Learner>;
  partners?: Array<Partner>;
  tutors?: Array<Tutor>;
  fetchLearners: () => void;
  fetchPartners: () => void;
  fetchTutors: () => void;
  usersDispatch: React.Dispatch<usersAction>;
}

export const UsersContext = React.createContext<UsersContext>({} as UsersContext);

export const useUsers = () => {
  return useContext(UsersContext);
};
