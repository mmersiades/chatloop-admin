import apiChatloopOrg from '../config/axiosConfig';
import { authHeader } from '../helpers/getAuthHeader';
import { ExtendedUser, Learner, Partner, Tutor } from '../@types/interfaces';
import { TutorShift, UserRole } from '../@types/enums';
import { handleError } from '../helpers/handleError';

import { AxiosResponse } from 'axios';
import { usersAction } from '../contexts/usersContext';
import { NewUserPayload } from '../pages/UsersPage/NewUserForm';

export interface UserListDTO<T> {
  message: string;
  status: string;
  users: T[];
}

export const getUser = async (
  userId: number
): Promise<AxiosResponse<ExtendedUser>> => {
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
    // dispatch({ type: 'SET_LEARNERS', payload: learners });
  } catch (error) {
    /* istanbul ignore next */
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
    // dispatch({ type: 'SET_PARTNERS', payload: partners });
  } catch (error) {
    /* istanbul ignore next */
    handleError(error);
  }
};

export const getAllTutors = async <T>(): Promise<
  AxiosResponse<UserListDTO<T>>
> => {
  let shiftOneTutors: T[] = [];
  let shiftTwoTutors: T[] = [];

  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const responseShiftOne = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_ONE',
      requestOptions
    );
    shiftOneTutors = responseShiftOne.data.users.map((tutor: any) => {
      tutor.shift = TutorShift.one;
      return tutor;
    });

    const responseShiftTwo = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_TWO',
      requestOptions
    );
    shiftTwoTutors = responseShiftTwo.data.users.map((tutor: any) => {
      tutor.shift = TutorShift.two;
      return tutor;
    });

    return {
      status: 200,
      data: {
        users: shiftOneTutors.concat(shiftTwoTutors),
        status: '200',
        message: 'success',
      },
    } as AxiosResponse<UserListDTO<T>>;
  } catch (error) {
    /* istanbul ignore next */
    handleError(error);
    return {
      status: 400,
      data: { status: '400', message: 'failure' },
    } as AxiosResponse;
  }
};

export const getUsersByRole = async <T>(
  role: UserRole
): Promise<AxiosResponse<UserListDTO<T>>> => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  if (role === UserRole.tutor) {
    return (await getAllTutors<T>()) as AxiosResponse<UserListDTO<T>>;
  } else {
    return await apiChatloopOrg.get(
      `/rest/user/filter-users?role=${role}`,
      requestOptions
    );
  }
};

export const createUser = async (body: NewUserPayload) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response = await apiChatloopOrg.post(
      '/rest/user/create-user',
      body,
      requestOptions
    );
    return response;
  } catch (error) {
    /* istanbul ignore next */
    handleError(error);
  }
};

// export const assignTutors = async (body: {
//   shiftOneTutor: number;
//   shiftTwoTutor: number;
//   learner: number;
// }) => {
//   const requestOptions = {
//     headers: { authorization: authHeader() },
//   };
//   try {
//     const response = await apiChatloopOrg.post(
//       '/rest/admin/assign-learner-to-tutor',
//       body,
//       requestOptions
//     );
//     return response;
//   } catch (error) {
//     handleError(error);
//   }
// };

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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    handleError(error);
  }
};
