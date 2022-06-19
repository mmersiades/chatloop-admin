// Form validation
export const LOGIN_ERROR = 'Incorrect email or password';

// Form helpers

// Navigation
export const LOG_OUT = 'Log out';
export const ACCOUNT_SETTINGS = 'Account Settings';
export const INVITES = 'Invites';
export const REFERRALS = 'Referrals';
export const ORGANISATIONS = 'Organisations';
export const USERS = 'Users';
export const DASHBOARD = 'Dashboard';

// Common
export const CANCEL = 'CANCEL';
export const DELETE = 'DELETE';
export const REMOVE = 'REMOVE';

// UsersPage
export const USERS_TITLE = 'Manage Users';
export const LEARNERS_TAB = 'LEARNERS';
export const PARTNERS_TAB = 'PARTNERS';
export const TUTORS_TAB = 'TUTORS';
export const ORG_ADMINS_TAB = 'ORG ADMINS';
export const REFERRERS_TAB = 'REFERRERS';
export const DISPLAY_NAME = 'Display name';
export const EMAIL = 'Email';
export const FIRST_LANGUAGE = 'First language';
export const INTERFACE_LANGUAGE = 'Interface language';
export const CURRENT_ACTIVITIES = 'Current activities';
export const CURRENT_LEARNERS = 'Current learners';
export const SHIFT_ONE_TUTOR = 'Shift one tutor';
export const SHIFT_TWO_TUTOR = 'Shift two tutor';
export const REPLACE_TUTOR = 'REPLACE TUTOR';
export const RESET_PASSWORD = 'RESET PASSWORD';
export const CHANGE_ROLE = 'CHANGE ROLE TO TUTOR';

// InvitesPage
export const INVITES_TITLE = 'Manage Invites';
export const PARTNER_QUEUE = 'Partner queue';
export const NUMBERS = 'Numbers';
export const NO_INVITES = 'No invites';

// ReferralsPage
export const REFERRALS_TITLE = 'Manage Referrals';
export const REFERRER_NAME = 'Referrer';
export const REFERRER_EMAIL = 'Referrer email';
export const NEW_REFERRAL_TITLE = 'New referral';
export const ADD_REFERRAL_BUTTON = 'ADD REFERRAL';
export const NAME_FORM_HELPER = 'Recommended: first name only';
export const EMAIL_FORM_HELPER = 'Invitation sent to this address';
export const PHONE_FORM_HELPER = 'Invitation sent to this phone number';
export const FIRST_LANG_FORM_HELPER = 'Native language / mother tongue';
export const INVITATION_LINK = 'Link';

// OrganisationsPage
export const ORGS_TITLE = 'Partner organisations';
export const ADD_ORG_BUTTON = 'ADD ORGANISATION';
export const OFFICIAL_NAME_HELPER =
  "Organisation's legal name, as registered with government";
export const SHORT_NAME_HELPER =
  'The name the organisation is commonly known as';
export const CONTACT_PHONE_HELPER = "Organisation's public-facing phone number";
export const CONTACT_EMAIL_HELPER =
  "Organisation's public-facing email address";
export const WEBSITE_HELPER = "Organisation's public-facing website url";
export const OPERATIONAL_COUNTRIES_HELPER =
  'Countries where the organisation serves clients';
export const SUBPREMISE_HELPER =
  'A building within a collection of buildings with a common name';
export const PREMISE_HELPER =
  'A building or collection of buildings with a common name';
export const STREET_ADDRESS_HELPER = 'A precise street address';
export const LOCALITY_HELPER = '';
export const ADMINISTRATIVE_AREA_HELPER = '';
export const POSTAL_CODE_HELPER = '';

// AccountSettings
export const ACCOUNT_SETTINGS_TITLE = 'Account Settings';
export const PASSWORD_LABEL = 'Password';

// Dashboard
export const DASHBOARD_TITLE = 'Chatloop Admin';
export const DAU_TITLE = 'Daily Active Users';
export const MAU_TITLE = 'Monthly Active Users';
export const ACTIVITIES_IN_PROGRESS_TITLE = 'Activities In Progress';
export const CUMULATIVE_ACTIVITIES_TITLE = 'Cumulative Activities';
export const MESSAGES_TITLE = 'Messages';
export const TAR_TITLE = 'Total Active Referrals';
export const TCR_TITLE = 'Total Cumulative Referrals';
export const OR_TITLE = 'Referrers In Organisations';
export const OOA_TITLE = 'Org Admins In Organisations';
export const OAR_TITLE = 'Active Referrals For Organisations';
export const OER_TITLE = 'Expired Referrals For Organisations';
export const OAI_TITLE = 'Accepted Invitations For Organisations';
export const LEARNER_CAPACITY_TITLE = 'Learner Capacity';
export const ACTIVITY_CAPACITY_TITLE = 'Activity Capacity';
export const MAX_LEARNERS_LABEL = 'Max learners';
export const CURRENT_LEARNERS_LABEL = 'Current learners';
export const MAX_ACTIVITIES_LABEL = 'Max activities';
export const CURRENT_ACTIVITIES_LABEL = 'Current activities';
export const CAPACITY_LABEL = 'Capacity';

// ResetPasswordDialog
export const RESET_PASSWORD_DIALOG_TITLE = 'Reset password?';
export const RESET = 'RESET';

// DeleteUserDialog
export const DELETE_USER_DIALOG_TITLE = 'Delete user?';

// RemoveOrgAdminDialog
export const REMOVE_ORG_ADMIN_TITLE = 'Remove administrator?';

// ChangeRoleDialog
export const changeRoleTitle = (name: string) =>
  `Change ${name}'s role to tutor?`;
export const CHANGE_ROLE_LABEL = 'CHANGE ROLE';
export const CANNOT_UNDO = 'This cannot be undone.';
