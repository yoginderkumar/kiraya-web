export const COLORS = {
  transparent: 'transparent',
  red: 'red',
  black: '#000',
  white: '#fff',
  blue100: '#EBEEFD',
  blue50: '#f5f6fa',
  blue200: '#B6C1EE',
  blue900: '#4863D4',
  gray100: '#EEEEEE',
  gray200: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#707070',
  gray600: '#404040',
  gray900: '#171717',
  red100: '#f7e1e1',
  red500: '#ef4444',
  red900: '#C93B3B',
  green900: '#01865F',
  green500: '#21B15E',
  green100: '#dff4ed',
  yellow100: '#fef3c7',
  yellow300: '#fcd34d',
  yellow600: '#d97706',
  yellow800: '#92400e',
  category: '#534ECD',
  paymentMode: '#137AC6',
  paymentModeBg: '#E7F2F9',
  orange100: '#F8EFE7',
  orange200: '#D7A06E',
  orange900: '#BD610D',
} as const;

export const BREAKPOINTS = {
  xs: {},
  sm: { '@media': 'screen and (min-width: 640px)' },
  md: { '@media': 'screen and (min-width: 768px)' },
  lg: { '@media': 'screen and (min-width: 1024px)' },
  xl: { '@media': 'screen and (min-width: 1280px)' },
  '2xl': { '@media': 'screen and (min-width: 1440px)' },
} as const;

export const BREAKPOINTS_NAMES = Object.keys(
  BREAKPOINTS
) as never as keyof typeof BREAKPOINTS;

export const SPACING = {
  '0': '0',
  px: '1px',
  '1': '.25rem',
  '2': '.5rem',
  '3': '.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '18': '4.5rem',
  '24': '6rem',
  auto: 'auto',
} as const;

export const SIZES = {
  ...SPACING,
  '1/2': '50%',
  '1/3': '33.33333%',
  full: '100%',
} as const;
