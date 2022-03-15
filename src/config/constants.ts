import { UiLanguageOption } from '../@types/interfaces';

export const PROD_EXPIRY_INTERVAL = {
  value: 3,
  unit: 'hours' as const,
  ms: 10800000,
};

export const DEV_EXPIRY_INTERVAL = {
  value: 20,
  unit: 'seconds' as const,
  ms: 20000,
};

export const PROD_PARTNER_QUEUE_SIZE = 20;
export const DEV_PARTNER_QUEUE_SIZE = 5;

export const UI_LANGUAGE_CODES = [
  'ar',
  'en',
  'es',
  'fa',
  'id',
  'prs',
  'sw',
  'kar',
  'my',
];

export const UI_LANGUAGES: UiLanguageOption[] = [
  { code: 'ar', language: 'Arabic' },
  { code: 'en', language: 'English' },
  { code: 'es', language: 'Spanish' },
  { code: 'fa', language: 'Persian' },
  { code: 'id', language: 'Indonesian' },
  { code: 'prs', language: 'Hazaragi' },
  { code: 'sw', language: 'Swahili' },
  { code: 'kar', language: 'Karen' },
  { code: 'my', language: 'Burmese' },
];

export const DEFAULT_REFERRAL_PAGE_SIZE = 25;
