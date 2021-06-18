import apiChatloopOrg from '../config/axiosConfig';
import { authHeader } from '../helpers/getAuthHeader';
import { Learner, Partner, Tutor } from '../@types/interfaces';
import { TutorShifts, UserRoles } from '../@types/enums';
import { handleError } from '../helpers/handleError';

import { AxiosResponse } from 'axios';
import { usersAction } from '../contexts/usersContext';

export const getUser = async (userId: number): Promise<AxiosResponse> => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/get-user/${userId}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const getLearners = async (dispatch: React.Dispatch<usersAction>) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_LEARNER',
      requestOptions
    );
    const learners: Array<Learner> = response.data.users.map(
      (learner: any) => learner
    );
    dispatch({ type: 'SET_LEARNERS', payload: learners });
  } catch (error) {
    handleError(error);
  }
};

export const getPartners = async (dispatch: React.Dispatch<usersAction>) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_PARTNER',
      requestOptions
    );
    const partners: Array<Partner> = response.data.users.map(
      (partner: any) => partner
    );
    dispatch({ type: 'SET_PARTNERS', payload: partners });
  } catch (error) {
    handleError(error);
  }
};

export const getTutors = async (dispatch: React.Dispatch<usersAction>) => {
  let shiftOneTutors: Array<Tutor> = [];
  let shiftTwoTutors: Array<Tutor> = [];
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const responseShiftOne = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_ONE',
      requestOptions
    );
    shiftOneTutors = responseShiftOne.data.users.map((tutor: any) => {
      tutor.shift = TutorShifts.one;
      return tutor;
    });

    const responseShiftTwo = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_TWO',
      requestOptions
    );
    shiftTwoTutors = responseShiftTwo.data.users.map((tutor: any) => {
      tutor.shift = TutorShifts.two;
      return tutor;
    });
    dispatch({
      type: 'SET_TUTORS',
      payload: shiftOneTutors.concat(shiftTwoTutors),
    });
  } catch (error) {
    handleError(error);
  }
};

export const getUsersByUserRole = (
  userRole: UserRoles,
  dispatch: React.Dispatch<usersAction>
) => {
  switch (userRole) {
    case UserRoles.learner:
      getLearners(dispatch);
      break;
    case UserRoles.partner:
      getPartners(dispatch);
      break;
    case UserRoles.tutor:
      getTutors(dispatch);
      break;
    default:
  }
};

export const createUser = async (newUser: {
  email: string;
  displayName: string;
  userRole: UserRoles;
  shift: TutorShifts;
}) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  const body = {
    email: newUser.email,
    displayName: newUser.displayName,
    userRole: newUser.userRole,
    shift: newUser.shift,
  };

  try {
    const response = await apiChatloopOrg.post(
      '/rest/user/create-user',
      body,
      requestOptions
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const assignTutors = async (body: {
  shiftOneTutor: number;
  shiftTwoTutor: number;
  learner: number;
}) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };
  try {
    const response = await apiChatloopOrg.post(
      '/rest/admin/assign-learner-to-tutor',
      body,
      requestOptions
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const replaceTutor = async (
  oldTutor: number,
  newTutor: number,
  learner: number
) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  const body = { oldTutor, newTutor, learner };

  try {
    return await apiChatloopOrg.post(
      '/rest/admin/reassign-tutors-for-learner',
      body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (userId: number) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response = await apiChatloopOrg.delete(
      `/rest/user/hard-delete/${userId}`,
      requestOptions
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (email: string) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  const body = { email };

  try {
    const response = await apiChatloopOrg.post(
      '/rest/user/password/reset',
      body,
      requestOptions
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
