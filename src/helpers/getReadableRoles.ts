import { UserRole } from '../@types/enums';

export const getReadableRoles = (userRole: UserRole) => {
  switch (userRole) {
    case UserRole.learner:
      return 'learner';
    case UserRole.partner:
      return 'partner';
    case UserRole.tutor:
      return 'tutor';
    case UserRole.referrer:
      return 'referrer';
    case UserRole.orgAdmin:
      return 'org admin';
    default:
      return 'user';
  }
};
