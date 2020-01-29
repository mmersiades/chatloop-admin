import React, { useReducer, useEffect } from 'react';
import WithNavbar from '../../components/WithNavbar';
import usersContext from '../../contexts/usersContext';
import usersService from '../../services/usersService';
import { ILearner, IPartner, ITutor } from '../../@types/interfaces';

type usersState = {
  learners?: Array<ILearner>;
  partners?: Array<IPartner>;
  tutors?: Array<ITutor>;
};

type usersAction =
  | {
      type: 'SET_LEARNERS';
      payload?: Array<ILearner>;
    }
  | {
      type: 'SET_PARTNERS';
      payload?: Array<IPartner>;
    }
  | {
      type: 'SET_TUTORS';
      payload?: Array<ITutor>;
    };

const usersReducerInitialState: usersState = {
  learners: [],
  partners: [],
  tutors: []
};

const usersReducer = (state: usersState, action: usersAction) => {
  switch (action.type) {
    case 'SET_LEARNERS':
      return { ...state, learners: action.payload };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    case 'SET_TUTORS':
      return { ...state, tutors: action.payload };
    default:
      return state;
  }
};

const UsersPage = () => {
  const [state, dispatch] = useReducer(usersReducer, usersReducerInitialState);

  useEffect(() => {
    const fetchLearners = async () => {
      const learners = await usersService.getLearners();
      dispatch({ type: 'SET_LEARNERS', payload: learners });
    };

    fetchLearners();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      const partners = await usersService.getPartners();
      dispatch({ type: 'SET_PARTNERS', payload: partners });
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await usersService.getTutors();
      dispatch({ type: 'SET_TUTORS', payload: tutors });
    };

    fetchTutors();
  }, []);

  console.log('state', state);
  return (
    <usersContext.Provider value={state}>
      <div>Users</div>;
    </usersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
