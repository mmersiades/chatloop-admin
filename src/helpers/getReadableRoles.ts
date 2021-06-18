import { UserRoles } from '../@types/enums';

export const getReadableRoles = (userRole: UserRoles) => {
  switch (userRole) {
    case UserRoles.learner:
      return 'learner';
    case UserRoles.partner:
      return 'partner';
    case UserRoles.tutor:
      return 'tutor';
    default:
      return 'user';
  }
};
