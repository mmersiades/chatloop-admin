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
