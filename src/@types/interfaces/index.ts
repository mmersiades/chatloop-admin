import { UserRoles, TutorShifts } from '../enums';

export interface User {
  id: number;
  displayName: string;
  email: string;
  roles: Array<UserRoles>;
  uiLanguage: string;
}

export interface Learner extends User {
  roles: [UserRoles.learner];
  showNewActivityDrawer: false;
}

export interface ExtendedLearner extends Learner {
  userRole: UserRoles.learner;
  id: number; // Learner's id
  firstLanguages: UserLanguageObject[];
  numberOfActivities: number;
  maxNumberOfActivities: number;
  shiftOneTutor: number; // Tutor's id
  shiftTwoTutor: number; // Tutor's id
}

export interface Partner extends User {
  roles: [UserRoles.partner];
}

export interface ExtendedPartner extends Partner {
  userRole: UserRoles.partner;
  id: number; // Partner's id
  firstLanguages: UserLanguageObject[];
  numberOfActivities: number;
  maxNumberOfActivities: number;
}

export interface Tutor extends User {
  roles: [UserRoles.tutor];
  shift: TutorShifts;
}

export interface ExtendedTutor extends Tutor {
  userRole: UserRoles.tutor;
  id: number; // Tutor's id
  firstLanguages: UserLanguageObject[];
  numberOfLearners: number;
  maxNumberOfLearners: number;
  assignedLearners: number[]; // array of Learner ids
}

export interface UserLanguageObject {
  code: string;
  language: string;
}

export interface ExpiryInterval {
  value: number;
  /**
   * Returned from back-end as Spring time units (eg HOURS, HOUR, SECOND),
   * but should be converted to match Moment.js's units (moment.d.ts)
   *  */
  unit?:
    | 'year'
    | 'years'
    | 'y'
    | 'month'
    | 'months'
    | 'M'
    | 'week'
    | 'weeks'
    | 'w'
    | 'day'
    | 'days'
    | 'd'
    | 'hour'
    | 'hours'
    | 'h'
    | 'minute'
    | 'minutes'
    | 'm'
    | 'second'
    | 'seconds'
    | 's'
    | 'millisecond'
    | 'milliseconds'
    | 'ms';

  // Interval in milliseconds
  ms: number;
}

export type appPropertiesState = {
  inviteExpiryInterval?: ExpiryInterval;
};

export interface PartnerInQueue {
  id: number;
  displayName: string;
  currentNumberOfActivities: number;
  maxNumberOfActivities: number;
  lastChatFinished: string;
}

export interface Invite {
  id: number;
  learner: {
    id: number;
    displayName: string;
    currentNumberOfActivities: number;
    maxNumberOfActivities: number;
  };
  partners: Array<PartnerInQueue>;
  sentOn: string;
  topic: string;
}

export type Pageable<T> = {
  content: T;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElement: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;
};
