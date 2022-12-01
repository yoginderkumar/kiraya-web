import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { BREAKPOINTS } from './theme';

const fontSizeProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: 'xs',
  properties: {
    fontSize: {
      xs: { fontSize: '0.75rem', lineHeight: '1rem' },
      sm: { fontSize: '12px', lineHeight: '15px' },
      base: { fontSize: '14px', lineHeight: '17px' },
      md: { fontSize: '16px', lineHeight: '19px' },
      lg: { fontSize: '20px', lineHeight: '24px' },
      xl: { fontSize: '24px', lineHeight: '30px' },
      '2xl': { fontSize: '28px', lineHeight: '34px' },
      '3xl': { fontSize: '32px', lineHeight: '39px' },
    },
  },
});

const fontWeightProperties = defineProperties({
  properties: {
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
});

const textTransformProperties = defineProperties({
  properties: {
    textTransform: {
      uppercase: 'uppercase',
      capitalize: 'capitalize',
    },
  },
});

const whiteSpaceProperties = defineProperties({
  properties: {
    whiteSpace: {
      // prevent text from wrapping within an element. Newlines and spaces will be collapsed.
      nowrap: 'nowrap',
      // preserve newlines and spaces within an element. Text will NOT be wrapped.
      preserve: 'pre',
      // preserve newlines but not spaces within an element. Text will be wrapped normally.
      preserveLine: 'pre-line',
      // preserve newlines and spaces within an element. Text will be wrapped normally.
      preserveAndWrap: 'pre-wrap',
    },
  },
});

export const textStyles = createSprinkles(
  fontSizeProperties,
  fontWeightProperties,
  textTransformProperties,
  whiteSpaceProperties
);

export type TTextStyles = Parameters<typeof textStyles>[0];
