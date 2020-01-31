import apiChatloopOrg from '../config/axionConfig';
import authHeader from '../helpers/getAuthHeader';
import { ILearner, IPartner, ITutor } from '../@types/interfaces';
import { TutorShifts, UserRoles } from '../@types/enums';

const handleError = (error?: any) => {
  if (error.response) {
    console.log('error.response', error.response);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('error.message', error.message);
  }
  console.log('error.config', error.config);
};

const getLearners = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() }
  };

  try {
    const response = await apiChatloopOrg.get('/rest/user/filter-users?role=ROLE_LEARNER', requestOptions);
    const learners: Array<ILearner> = response.data.users.map((learner: any) => {
      delete learner.learner;
      delete learner.partner;
      delete learner.tutor;
      delete learner.admin;
      return learner;
    });
    return learners;
  } catch (error) {
    handleError(error);
  }
};

const getPartners = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() }
  };

  try {
    const response = await apiChatloopOrg.get('/rest/user/filter-users?role=ROLE_PARTNER', requestOptions);
    const partners: Array<IPartner> = response.data.users.map((partner: any) => {
      delete partner.learner;
      delete partner.partner;
      delete partner.tutor;
      delete partner.admin;
      return partner;
    });
    return partners;
  } catch (error) {
    handleError(error);
  }
};

const getTutors = async () => {
  let shiftOneTutors: Array<ITutor> = [];
  let shiftTwoTutors: Array<ITutor> = [];
  const requestOptions = {
    headers: { authorization: authHeader() }
  };

  try {
    const responseShiftOne = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_ONE',
      requestOptions
    );
    shiftOneTutors = responseShiftOne.data.users.map((tutor: any) => {
      delete tutor.learner;
      delete tutor.partner;
      delete tutor.tutor;
      delete tutor.admin;
      tutor.shift = TutorShifts.one;
      return tutor;
    });

    const responseShiftTwo = await apiChatloopOrg.get(
      '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_TWO',
      requestOptions
    );
    shiftTwoTutors = responseShiftTwo.data.users.map((tutor: any) => {
      delete tutor.learner;
      delete tutor.partner;
      delete tutor.tutor;
      delete tutor.admin;
      tutor.shift = TutorShifts.two;
      return tutor;
    });

    return shiftOneTutors.concat(shiftTwoTutors);
  } catch (error) {
    handleError(error);
  }
};

const createUser = async (newUser: { email: string; displayName: string; userRole: UserRoles }) => {
  const requestOptions = {
    headers: { authorization: authHeader() }
  };

  const body = {
    email: newUser.email,
    displayName: newUser.displayName,
    userRole: newUser.userRole
  };

  try {
    const response = await apiChatloopOrg.post('/rest/user/create-user', body, requestOptions);
    return response;
  } catch (error) {
    handleError(error);
  }
};

const assignTutors = async (body: { shiftOneTutor: number; shiftTwoTutor: number; learner: number }) => {
  const requestOptions = {
    headers: { authorization: authHeader() }
  };
  try {
    const response = await apiChatloopOrg.post('/rest/admin/assign-learner-to-tutor', body, requestOptions);
    return response;
  } catch (error) {
    handleError(error);
  }
};

const deleteUser = async (userId: number) => {
  const requestOptions = {
    headers: { authorization: authHeader() }
  };

  try {
    const response = await apiChatloopOrg.delete(`/rest/user/hard-delete/${userId}`, requestOptions);
    return response;
  } catch (error) {
    handleError(error);
  }
};

const usersService = {
  getLearners,
  getPartners,
  getTutors,
  createUser,
  assignTutors,
  deleteUser
};

export default usersService;
