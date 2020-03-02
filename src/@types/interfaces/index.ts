import { UserRoles, TutorShifts } from "../enums";

export interface IUser {
  id: number;
  displayName: string;
  email: string;
  roles: Array<UserRoles>;
}

export interface ILearner extends IUser {
  roles: [UserRoles.learner];
  showNewActivityDrawer: false;
}

export interface IPartner extends IUser {
  roles: [UserRoles.partner];
}

export interface ITutor extends IUser {
  roles: [UserRoles.tutor];
  shift: TutorShifts;
}
