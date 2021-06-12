import React, { useContext } from 'react';
import { Learner, Partner, Tutor } from '../@types/interfaces';
import { usersAction } from '../pages/UsersPage';

interface UsersContext {
  learners?: Array<Learner>;
  partners?: Array<Partner>;
  tutors?: Array<Tutor>;
  newLearnerEmail: string;
  emailForPasswordReset: string;
  usersDispatch: React.Dispatch<usersAction>;
  fetchLearners: () => void;
  fetchPartners: () => void;
  fetchTutors: () => void;
  setNewLearnerEmail: (email: string) => void;
  setEmailForPasswordReset: (email: string) => void;
}

// eslint-disable-next-line
export const UsersContext = React.createContext<UsersContext>({} as UsersContext);

export const useUsers = () => {
  return useContext(UsersContext);
};
