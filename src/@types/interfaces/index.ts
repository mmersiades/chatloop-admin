import { UserRole, TutorShift, ReferralStatus } from '../enums';

export interface Action<T> {
  type: T;
}

interface PageableSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: PageableSort;
  unpaged: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: PageableSort;
  totalElements: number;
  totalPages: number;
}

export interface Referrer {
  referrerId: number;
  referrerName: string;
  referrerEmail: string;
  orgId: number;
  orgName: string;
}

export interface Referral {
  id: number;
  email: string;
  createdAt: string;
  expiresAt: string;
  role: UserRole;
  refereeName: string;
  status: ReferralStatus;
  uiLanguage: string;
  firstLanguage: UserLanguageObject;
}

export interface UiLanguageOption {
  code: string;
  language: string;
}

export interface ExtendedReferral extends Referral, Referrer {}

export interface User {
  id: number;
  displayName: string;
  email: string;
  roles: Array<UserRole>;
  uiLanguage: string;
}

export interface Learner extends User {
  roles: [UserRole.learner];
  showNewActivityDrawer: false;
}

export interface ExtendedLearner extends Learner {
  userRole: UserRole.learner;
  id: number; // Learner's id
  firstLanguages: UserLanguageObject[];
  numberOfActivities: number;
  maxNumberOfActivities: number;
  shiftOneTutor: number; // Tutor's id
  shiftTwoTutor: number; // Tutor's id
}

export interface Partner extends User {
  roles: [UserRole.partner];
}

export interface ExtendedPartner extends Partner {
  userRole: UserRole.partner;
  id: number; // Partner's id
  firstLanguages: UserLanguageObject[];
  numberOfActivities: number;
  maxNumberOfActivities: number;
}

export interface Tutor extends User {
  roles: [UserRole.tutor];
  shift: TutorShift;
}

export interface ExtendedTutor extends Tutor {
  userRole: UserRole.tutor;
  id: number; // Tutor's id
  firstLanguages: UserLanguageObject[];
  numberOfLearners: number;
  maxNumberOfLearners: number;
  assignedLearners: number[]; // array of Learner ids
}

export const isExtendedTutor = (item: any): item is ExtendedTutor =>
  (item as ExtendedTutor).userRole === UserRole.tutor;

export type ExtendedUser = ExtendedLearner | ExtendedPartner | ExtendedTutor;

export interface UserLanguageObject {
  code: string;
  language: string;
}

export interface ExpiryInterval {
  value: number;
  /**
   * Returned from back-end as Spring time units (e.g. HOURS, HOUR, SECOND),
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

// An object representing a language as per [ISO 639-3](https://en.wikipedia.org/wiki/ISO_639-3)
export interface Language {
  // A unique 6-digit number identifying each language
  id: number;

  /**
   * A 2- or 3-character code representing a language
   */
  code?: string;

  // The name of the language, in English
  language: string;

  // Individual (I) or macroLanguage (M). See more at [[LanguageScopes]]
  scope?: LanguageScopes;

  /**
   * The language code for the selected language's macroLanguage,
   * if the selected language belongs to a macroLanguage
   */
  macroLanguage?: string | null;
}

//These language scopes come from ISO-639-3. [Read more here](https://iso639-3.sil.org/about/scope)
export enum LanguageScopes {
  /** An individual scope means that the language codes represents just one, individual language. */
  individual = 'I',
  /** A macrolanguage scope that the language code represents an umbrella code for a collection of related individual languages.
   * For example **"ara"** is a macrolanguage code that covers the various Arabic language codes, for example:
   * * arb - Standard Arabic
   * * arq - Algerian Arabic
   * * ars - Nadji Arabic
   * * arz - Egyptian Arabic
   * * etc...
   */
  macrolanguage = 'M',
}
