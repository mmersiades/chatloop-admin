import React from 'react';
import { Learner, Partner, Tutor } from '../@types/interfaces';

interface UsersContext {
  learners?: Array<Learner>;
  partners?: Array<Partner>;
  tutors?: Array<Tutor>;
}

const defaultValue = {} as UsersContext;

export default React.createContext(defaultValue);
