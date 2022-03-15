/**
 * @module helpers
 */

/**
 * Determines the direction text should be displayed in (right-to-left or left-to-right),
 * based on the browser's display language.
 * @returns `'ltr'` or `'rtl'`
 */
const getTextDirection = (): 'ltr' | 'rtl' => {
  const isArabic: boolean = navigator.language.toLowerCase().startsWith('ar');
  const isPersian: boolean = navigator.language.toLowerCase().startsWith('fa');
  const isUrdu: boolean = navigator.language.toLowerCase().startsWith('ur');
  if (isArabic || isPersian || isUrdu) {
    return 'rtl';
  } else {
    return 'ltr';
  }
};

export default getTextDirection;
