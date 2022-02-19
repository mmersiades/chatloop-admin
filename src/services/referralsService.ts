import { ReferralStatus, UserRole } from '../@types/enums';
import { ExtendedReferral, Referral, Referrer } from '../@types/interfaces';

const referrer: Referrer = {
  referrerId: 567890,
  referrerName: 'Referrer',
  referrerEmail: 'referrer@email.com',
  orgId: 678901,
  orgName: 'Chatloop',
};

const learnerReferral1: Referral = {
  id: 123456,
  email: 'learnerReferral1@email.com',
  createdAt: '2022-02-19T04:52:27+0000',
  expiresAt: '2022-03-19T04:52:27+0000',
  role: UserRole.learner,
  referreeName: 'Learner Referral 1',
  status: ReferralStatus.sent,
  uiLanguage: 'ar',
  firstLanguages: [{ code: 'ara', language: 'Arabic' }],
};

const learnerReferral2: Referral = {
  id: 234567,
  email: 'learnerReferral2@email.com',
  createdAt: '2022-02-19T05:52:27+0000',
  expiresAt: '2022-03-19T05:52:27+0000',
  role: UserRole.learner,
  referreeName: 'Learner Referral 2',
  status: ReferralStatus.sent,
  uiLanguage: 'ar',
  firstLanguages: [{ code: 'ara', language: 'Arabic' }],
};

const partnerReferral1: Referral = {
  id: 345678,
  email: 'partnerReferral1@email.com',
  createdAt: '2022-02-19T04:52:27+0000',
  expiresAt: '2022-03-19T04:52:27+0000',
  role: UserRole.partner,
  referreeName: 'Partner Referral 1',
  status: ReferralStatus.sent,
  uiLanguage: 'en',
  firstLanguages: [{ code: 'eng', language: 'English' }],
};

const partnerReferral2: Referral = {
  id: 456789,
  email: 'partnerReferral2@email.com',
  createdAt: '2022-02-19T05:52:27+0000',
  expiresAt: '2022-03-19T05:52:27+0000',
  role: UserRole.partner,
  referreeName: 'Partner Referral 2',
  status: ReferralStatus.sent,
  uiLanguage: 'en',
  firstLanguages: [{ code: 'eng', language: 'English' }],
};

const extendedLearnerReferral1: ExtendedReferral = {
  ...learnerReferral1,
  ...referrer,
};

const extendedLearnerReferral2: ExtendedReferral = {
  ...learnerReferral2,
  ...referrer,
};

const extendedPartnerReferral1: ExtendedReferral = {
  ...partnerReferral1,
  ...referrer,
};

const extendedPartnerReferral2: ExtendedReferral = {
  ...partnerReferral1,
  ...referrer,
};

const extendedReferrals = [
  extendedLearnerReferral1,
  extendedLearnerReferral2,
  extendedPartnerReferral1,
  extendedPartnerReferral2,
];

export const getReferralsByRole = async (
  role: UserRole
): Promise<Referral[]> => {
  const payload =
    role === UserRole.learner
      ? [learnerReferral1, learnerReferral2]
      : [partnerReferral1, partnerReferral2];

  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), 1500);
  });
};

export const getReferralById = async (
  referralId: number
): Promise<ExtendedReferral> => {
  const payload = extendedReferrals.find((r) => r.id === referralId);

  return new Promise((resolve, reject) => {
    if (!payload) {
      reject();
    } else {
      setTimeout(() => resolve(payload), 1500);
    }
  });
};
