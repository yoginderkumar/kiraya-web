import classnames from 'classnames';
import React, { ForwardedRef } from 'react';
import { alertStyles, TAlertStyles } from './alert.css';
import { InformationCircleFilledIcon, InformationWarningIcon } from './Icons';

import type { ElementType } from 'react';
import { forwardRef } from 'react';
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
} from 'react-polymorphic-types';

const DefaultAlertElement = 'div';

export type AlertOwnProps = TAlertStyles & {
  status: 'error' | 'info' | 'warning' | 'success';
  children: React.ReactNode;
  customIcon?: React.ReactNode;
  removeIcon?: boolean;
};

export const Alert: PolymorphicForwardRefExoticComponent<
  AlertOwnProps,
  typeof DefaultAlertElement
> = forwardRef(function Alert<
  T extends ElementType = typeof DefaultAlertElement
>(
  {
    status,
    children,
    customIcon,
    removeIcon,

    borderWidth,
    borderRadius,
    rounded,
    roundedTopRight,
    roundedTopLeft,
    roundedBottomRight,
    roundedBottomLeft,
    roundedTop,
    roundedRight,
    roundedBottom,
    roundedLeft,
    margin,
    marginX,
    marginY,
    marginTop,
    marginLeft,
    marginBottom,
    ...restProps
  }: PolymorphicPropsWithoutRef<AlertOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: React.ElementType = DefaultAlertElement;
  return (
    <Element
      {...restProps}
      role="status"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      className={classnames(
        `${!rounded ? 'rounded' : ''} ${borderWidth ? '' : 'border'} ${
          !marginBottom ? 'mb-4' : ''
        } px-4 py-3 flex gap-3 items-center font-medium`,
        {
          'bg-[#F8EFE7] border-[#EB974A] text-[#BD610D]': status === 'warning',
          'bg-red-100 text-red-900 border-red-100': status === 'error',
          'bg-[#EEEDFA] text-[#212121] px-6': status === 'info',
          'bg-green-100 text-green-900 px-6': status === 'success',
        },
        alertStyles({
          borderRadius,
          rounded,

          roundedTopRight,
          roundedTopLeft,
          roundedBottomRight,
          roundedBottomLeft,
          roundedTop,
          roundedRight,
          roundedBottom,
          roundedLeft,
          borderWidth,
          margin,
          marginX,
          marginY,
          marginTop,
          marginLeft,
          marginBottom,
        })
      )}
    >
      {removeIcon ? null : customIcon ? (
        customIcon
      ) : status === 'warning' ? (
        <InformationWarningIcon />
      ) : status === 'info' ? (
        <InformationCircleFilledIcon className="h-5 w-5" color="category" />
      ) : null}
      <div className="flex-1 min-w-0">{children}</div>
    </Element>
  );
});
