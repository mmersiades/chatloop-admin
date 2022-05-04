import { UserRole, TutorShift, ReferralStatus, Orientation } from '../enums';

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
  phone: string;
  createdAt: string;
  expiresAt: string;
  role: UserRole;
  refereeName: string;
  status: ReferralStatus;
  uiLanguage: string;
  firstLanguage: UserLanguageObject;
  link: string;
  targetOrgId?: number;
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

export interface OrgAdmin extends User {
  roles: [UserRole.orgAdmin];
}

export interface Referrer extends User {
  roles: [UserRole.referrer];
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
  id: number;
  code?: string;
  language: string;
  scope?: LanguageScopes;
  macroLanguage?: string | null;
}

//These language scopes come from ISO-639-3. [Read more here](https://iso639-3.sil.org/about/scope)
export enum LanguageScopes {
  individual = 'I',
  macrolanguage = 'M',
}

export interface OrgAdminDTO {
  adminId: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface Organisation {
  id: number;
  officialName: string;

  // Areas of operation
  operationalCountries: Country[];
  operationalRegions: Region[];
  onlineOrg: boolean;

  // Additional info
  shortName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  websiteUrl: string | null;

  // Logo
  logo: string | null;
  logoOrientation: Orientation | null;
  logomark: string | null;
  logomarkOrientation: Orientation | null;
  wordmark: string | null;

  // Address
  premise: string | null;
  subpremise: string | null;
  streetAddress: string | null;
  locality: string | null;
  administrativeArea: string | null;
  country: string | null;
  countryCode: string | null;
  postalCode: string | null;

  // Org Admin
  admins: OrgAdminDTO[];
}

export interface Country {
  countryCode: string;
  countryName: string;
}

export interface Region {
  code: string;
  countryCode: string;
  subdivisionName: string;
}
