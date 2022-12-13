import React, { ElementType, ForwardedRef, forwardRef } from 'react';
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types';
import { Box, BoxOwnProps } from './Box';

const DefaultElement = 'div';

export type CircleOwnProps = Omit<BoxOwnProps, 'display'> & {
  children?: React.ReactNode;
};

export type CircleProps<T extends React.ElementType = typeof DefaultElement> =
  PolymorphicPropsWithRef<CircleOwnProps, T>;

export const Circle: PolymorphicForwardRefExoticComponent<
  CircleOwnProps,
  typeof DefaultElement
> = forwardRef(function Stack<T extends ElementType = typeof DefaultElement>(
  { as, ...restProps }: PolymorphicPropsWithoutRef<CircleOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultElement;
  const defaultSize = restProps.size || '12';
  const defaultColor = restProps.color || 'blue900';
  const defaultBgColor = restProps.backgroundColor || 'blue100';
  return (
    <Element {...restProps}>
      <Box
        width={defaultSize}
        height={defaultSize}
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={defaultColor}
        backgroundColor={defaultBgColor}
        {...restProps}
      >
        {restProps.children}
      </Box>
    </Element>
  );
});
