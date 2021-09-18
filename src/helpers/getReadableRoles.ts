import { UserRole } from '../@types/enums';

export const getReadableRoles = (userRole: UserRole) => {
  switch (userRole) {
    case UserRole.learner:
      return 'learner';
    case UserRole.partner:
      return 'partner';
    case UserRole.tutor:
      return 'tutor';
    default:
      return 'user';
  }
};
