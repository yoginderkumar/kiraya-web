import React from 'react';
import { Box } from './Box';
import { COLORS, SIZES } from './css/theme';

export function Circle({
  size,
  color,
  children,
  backgroundColor,
}: {
  size?: keyof typeof SIZES;
  color?: keyof typeof COLORS;
  backgroundColor?: keyof typeof COLORS;
  children?: React.ReactNode;
}) {
  const defaultSize = size || '12';
  const defaultColor = color || 'blue900';
  const defaultBgColor = backgroundColor || 'blue100';
  return (
    <Box>
      <Box
        width={defaultSize}
        height={defaultSize}
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={defaultColor}
        backgroundColor={defaultBgColor}
      >
        {children}
      </Box>
    </Box>
  );
}
