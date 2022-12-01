import classNames from 'classnames';
import React, { useMemo } from 'react';

export type ButtonProps = {
  /**
   * @deprecated use "size" instead
   */
  sm?: boolean;
  size?: 'sm' | 'lg' | 'base';
  status?: 'warning' | 'primary' | 'error' | 'success';
  level?: 'primary' | 'secondary' | 'tertiary';
  inline?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  disabled?: boolean;
  align?: 'center' | 'left';
  verticalAlign?: 'middle';
  minWidth?: 'default' | 'auto';
};

export function getButtonClassName({
  size,
  status,
  level,
  fullWidth,
  inline,
  type,
  disabled,
  align,
  verticalAlign,
  minWidth,
}: Pick<
  ButtonProps,
  | 'size'
  | 'status'
  | 'level'
  | 'fullWidth'
  | 'inline'
  | 'type'
  | 'disabled'
  | 'align'
  | 'verticalAlign'
  | 'minWidth'
>) {
  level = level || (type === 'submit' ? 'primary' : 'secondary');
  size = size || 'base';
  return classNames(
    'rounded text-center focus:ring-4 focus:outline-none focus:ring-opacity-50 disabled:opacity-80 disabled:cursor-not-allowed font-semibold gap-2 items-center',
    {
      'justify-center': !align || align === 'center',
      'justify-start': align === 'left',
      'inline-flex': !fullWidth,
      'flex w-full': fullWidth,
      'align-middle': verticalAlign === 'middle',
      'text-sm': size === 'sm',
      'opacity-80 cursor-not-allowed': disabled,
    },
    !(inline || minWidth === 'auto') ? 'min-w-[120px]' : undefined,
    !inline
      ? [
          'border',
          {
            'px-4 h-[32px]': size === 'sm',
            'px-6 h-[40px]': size === 'base',
            'px-6 h-[48px]': size === 'lg',
          },
        ]
      : [],
    level === 'primary'
      ? {
          'text-white': true,
          'border-blue-900 bg-blue-900': !status,
          'border-red-900 bg-red-900': status === 'error',
          'border-green-900 bg-green-900': status === 'success',
          'border-yellow-800 bg-yellow-800': status === 'warning',
        }
      : null,
    level === 'secondary'
      ? {
          'bg-transparent border-gray-100': true,
          'hover:border-blue-900 text-blue-900': !status,
          'hover:border-red-900 text-red-900': status === 'error',
          'hover:border-green-900 text-green-900': status === 'success',
          'hover:border-yellow-800 text-yellow-800': status === 'warning',
        }
      : null,
    level === 'tertiary'
      ? {
          'bg-transparent border-transparent': true,
          'text-blue-900': !status,
          'text-red-900': status === 'error',
          'text-green-900': status === 'success',
          'text-yellow-800': status === 'warning',
        }
      : null
  );
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    ButtonProps
>(function Button(
  {
    className,
    sm,
    size,
    status,
    inline,
    fullWidth,
    level,
    type,
    disabled,
    align,
    verticalAlign,
    minWidth,
    ...props
  },
  ref
) {
  const styledClassName = useMemo(
    () =>
      getButtonClassName({
        size,
        status,
        level,
        fullWidth,
        inline,
        type,
        disabled,
        align,
        verticalAlign,
        minWidth,
      }),
    [
      size,
      status,
      level,
      fullWidth,
      inline,
      type,
      disabled,
      align,
      verticalAlign,
      minWidth,
    ]
  );
  return (
    <button
      type={type || 'button'}
      className={styledClassName}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > &
    ButtonProps
>(function Button(
  {
    className,
    sm,
    size = 'base',
    status,
    inline,
    fullWidth,
    level,
    children,
    type,
    disabled,
    href,
    download,
    align,
    minWidth,
    ...props
  },
  ref
) {
  const styledClassName = useMemo(
    () =>
      getButtonClassName({
        size,
        status,
        level,
        fullWidth,
        inline,
        disabled,
        align,
        minWidth,
      }),
    [size, status, level, fullWidth, inline, disabled, align, minWidth]
  );
  return (
    <a
      className={styledClassName}
      ref={ref}
      {...props}
      href={disabled ? '#disabled' : href}
      download={disabled ? false : download}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else {
          props.onClick?.(e);
        }
      }}
    >
      {children}
    </a>
  );
});
