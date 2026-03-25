export const COMPANY_LOGO_BASE_URL = 'https://assets.riseflake.com/images/logos';

export const COMPANY_LOGO_URLS = Array.from(
  { length: 70 },
  (_, index) => `${COMPANY_LOGO_BASE_URL}/row-company-logo-${index + 1}.webp`
);
