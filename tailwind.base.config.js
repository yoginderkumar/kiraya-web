const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  // presets: [],
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/line-clamp'),
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      blue: {
        50: '#f5f6fa',
        100: '#EBEEFD',
        900: '#4863D4',
      },
      gray: {
        900: '#171717',
        500: '#707070',
        600: '#404040',
        100: '#EEEEEE',
      },
      red: {
        100: '#f7e1e1',
        900: '#C93B3B',
      },
      green: {
        900: '#01865F',
        500: '#21B15E',
        100: '#dff4ed',
      },
      yellow: {
        100: colors.yellow['100'],
        300: colors.yellow['300'],
        600: colors.yellow['600'],
        800: colors.yellow['800'],
      },
      category: '#534ECD',
      paymentMode: '#137AC6',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['12px', { lineHeight: '15px' }],
      base: ['14px', { lineHeight: '17px' }],
      lg: ['20px', { lineHeight: '24px' }],
      xl: ['24px', { lineHeight: '30px' }],
      '2xl': ['28px', { lineHeight: '34px' }],
      '3xl': ['32px', { lineHeight: '39px' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
    borderColor: (theme) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.100', 'currentColor'),
    }),
  },
};
