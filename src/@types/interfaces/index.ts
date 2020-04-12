import { UserRoles, TutorShifts } from '../enums';

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

export interface IApplicationProperty {
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
}

export type appPropertiesState = {
  inviteExpiryInterval?: IApplicationProperty;
};

export interface IPartnerInQueue {
  id: number;
  displayName: string;
  currentNumberOfActivities: number;
  maxNumberOfActivities: number;
  lastChatFinished: string;
}

export interface IInvite {
  id: number;
  learner: {
    id: number;
    displayName: string;
    currentNumberOfActivities: number;
    maxNumberOfActivities: number;
  };
  partners: Array<IPartnerInQueue>;
  sentOn: string;
  topic: string;
}

export type IPageable<T> = {
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
