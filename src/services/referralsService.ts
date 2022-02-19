import { ReferralStatus, UserRole } from '../@types/enums';
import { Referral } from '../@types/interfaces';

const learnerReferral1: Referral = {
  id: 123456,
  email: 'learnerReferral1@email.com',
  createdAt: '2022-02-19T04:52:27+0000',
  expiresAt: '2022-03-19T04:52:27+0000',
  role: UserRole.learner,
  referreeName: 'Learner Referral 1',
  status: ReferralStatus.sent,
};

const learnerReferral2: Referral = {
  id: 23456,
  email: 'learnerReferral2@email.com',
  createdAt: '2022-02-19T05:52:27+0000',
  expiresAt: '2022-03-19T05:52:27+0000',
  role: UserRole.learner,
  referreeName: 'Learner Referral 2',
  status: ReferralStatus.sent,
};

const partnerReferral1: Referral = {
  id: 123456,
  email: 'partnerReferral1@email.com',
  createdAt: '2022-02-19T04:52:27+0000',
  expiresAt: '2022-03-19T04:52:27+0000',
  role: UserRole.partner,
  referreeName: 'Partner Referral 1',
  status: ReferralStatus.sent,
};

const partnerReferral2: Referral = {
  id: 23456,
  email: 'partnerReferral2@email.com',
  createdAt: '2022-02-19T05:52:27+0000',
  expiresAt: '2022-03-19T05:52:27+0000',
  role: UserRole.partner,
  referreeName: 'Partner Referral 2',
  status: ReferralStatus.sent,
};

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
