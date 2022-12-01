import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { BREAKPOINTS, COLORS, SPACING } from './css/theme';

const BORDER_WIDTH = {
  '0': 0,
  '1': '1px',
  '2': '2px',
  '4': '4px',
} as const;

const BORDER_RADIUS = {
  none: 0,
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  full: '999px',
} as const;

const marginProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: 'xs',
  properties: {
    marginTop: SPACING,
    marginBottom: SPACING,
    marginLeft: SPACING,
    marginRight: SPACING,
  },
  shorthands: {
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
  },
});

const borderProperties = defineProperties({
  properties: {
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderColor: COLORS,
  },
  shorthands: {
    borderRadius: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius',
    ],
    borderTopRadius: ['borderTopLeftRadius', 'borderTopRightRadius'],
    borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
    borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    borderLeftRadius: ['borderBottomLeftRadius', 'borderTopLeftRadius'],
    rounded: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius',
    ],
    roundedTop: ['borderTopLeftRadius', 'borderTopRightRadius'],
    roundedRight: ['borderTopRightRadius', 'borderBottomRightRadius'],
    roundedBottom: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    roundedLeft: ['borderBottomLeftRadius', 'borderTopLeftRadius'],
    roundedTopLeft: ['borderTopLeftRadius'],
    roundedTopRight: ['borderTopRightRadius'],
    roundedBottomRight: ['borderBottomRightRadius'],
    roundedBottomLeft: ['borderBottomLeftRadius'],
    borderWidth: [
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
    ],
    borderXWidth: ['borderLeftWidth', 'borderRightWidth'],
    borderYWidth: ['borderTopWidth', 'borderBottomWidth'],
  },
});

export const alertStyles = createSprinkles(marginProperties, borderProperties);
export type TAlertStyles = Parameters<typeof alertStyles>[0];
