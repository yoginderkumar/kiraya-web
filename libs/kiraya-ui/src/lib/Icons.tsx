import { TColorStyles } from './css/color.css';
import { TSizeStyles } from './css/size.css';
import { TTransformStyles } from './css/transform.css';
import { Box } from './Box';
import type { ElementType, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types';
import classNames from 'classnames';

const DefaultIconElement = 'svg';

export type IconOwnProps = { title?: string } & TSizeStyles &
  TColorStyles &
  Omit<TTransformStyles, 'transform'>;

export type IconProps<T extends React.ElementType = typeof DefaultIconElement> =
  PolymorphicPropsWithRef<IconOwnProps, T>;

export const Icon: PolymorphicForwardRefExoticComponent<
  IconOwnProps,
  typeof DefaultIconElement
> = forwardRef(function Text<T extends ElementType = typeof DefaultIconElement>(
  {
    as,
    title,
    children,
    size = '6',
    ...restProps
  }: PolymorphicPropsWithoutRef<IconOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultIconElement;
  return (
    <Box
      {...restProps}
      as={Element}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      display="inlineBlock"
      size={size}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </Box>
  );
});

export function ArrowDownIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <g clipPath="url(#ArrowDownIcon)">
        <path
          d="M18.5 10.0001L17.09 8.59009L12.5 13.1701L7.91 8.59009L6.5 10.0001L12.5 16.0001L18.5 10.0001Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="ArrowDownIcon">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(24.5) rotate(90)"
          />
        </clipPath>
      </defs>
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.4999 13.9999H14.7099L14.4299 13.7299C15.6299 12.3299 16.2499 10.4199 15.9099 8.38989C15.4399 5.60989 13.1199 3.38989 10.3199 3.04989C6.08989 2.52989 2.52989 6.08989 3.04989 10.3199C3.38989 13.1199 5.60989 15.4399 8.38989 15.9099C10.4199 16.2499 12.3299 15.6299 13.7299 14.4299L13.9999 14.7099V15.4999L18.2499 19.7499C18.6599 20.1599 19.3299 20.1599 19.7399 19.7499C20.1499 19.3399 20.1499 18.6699 19.7399 18.2599L15.4999 13.9999ZM9.49989 13.9999C7.00989 13.9999 4.99989 11.9899 4.99989 9.49989C4.99989 7.00989 7.00989 4.99989 9.49989 4.99989C11.9899 4.99989 13.9999 7.00989 13.9999 9.49989C13.9999 11.9899 11.9899 13.9999 9.49989 13.9999Z" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <g clipPath="url(#UserIcon)">
        <path
          d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="UserIcon">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
}

export function UserInABoxIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <g clipPath="url(#UserInABoxIcon)">
        <path
          d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM14 11C15.66 11 17 9.66 17 8C17 6.34 15.66 5 14 5C12.34 5 11 6.34 11 8C11 9.66 12.34 11 14 11ZM14 7C14.55 7 15 7.45 15 8C15 8.55 14.55 9 14 9C13.45 9 13 8.55 13 8C13 7.45 13.45 7 14 7ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM10.69 16C11.64 15.37 12.78 15 14 15C15.22 15 16.36 15.37 17.31 16H10.69ZM20 15.73C18.53 14.06 16.4 13 14 13C11.6 13 9.47 14.06 8 15.73V4H20V15.73Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="UserInABoxIcon">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 11H7.82998L12.71 6.11997C13.1 5.72997 13.1 5.08997 12.71 4.69997C12.32 4.30997 11.69 4.30997 11.3 4.69997L4.70998 11.29C4.31998 11.68 4.31998 12.31 4.70998 12.7L11.3 19.29C11.69 19.68 12.32 19.68 12.71 19.29C13.1 18.9 13.1 18.27 12.71 17.88L7.82998 13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11Z" />
    </Icon>
  );
}

export function CancelIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      className={classNames('icon animate-spin', props.className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </Icon>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
      <path d="M20 4H16.83L15.59 2.65C15.22 2.24 14.68 2 14.12 2H9.88C9.32 2 8.78 2.24 8.4 2.65L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z" />
    </Icon>
  );
}

export function InformationCircleIcon(props: IconProps) {
  return (
    <Icon {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24" stroke="none">
      <path d="M15 16L11 20H21V16H15Z" />
      <path d="M12.06 7.18994L3 16.2499V19.9999H6.75L15.81 10.9399L12.06 7.18994ZM5.92 17.9999H5V17.0799L12.06 10.0199L12.98 10.9399L5.92 17.9999Z" />
      <path d="M18.71 8.04C19.1 7.65 19.1 7.02 18.71 6.63L16.37 4.29C16.17 4.09 15.92 4 15.66 4C15.41 4 15.15 4.1 14.96 4.29L13.13 6.12L16.88 9.87L18.71 8.04Z" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24" stroke="none">
      <path d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z" />
    </Icon>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 48 48" stroke="none">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </Icon>
  );
}

export function InformationWarningIcon(props: IconProps) {
  return (
    <Icon {...props} fill="none" viewBox="0 0 32 29" stroke="currentColor">
      <path
        d="M3.44988 29.0001H28.5499C31.1165 29.0001 32.7165 26.2168 31.4332 24.0001L18.8832 2.3168C17.5999 0.10013 14.3999 0.10013 13.1165 2.3168L0.566543 24.0001C-0.71679 26.2168 0.883209 29.0001 3.44988 29.0001ZM15.9999 17.3335C15.0832 17.3335 14.3332 16.5835 14.3332 15.6668V12.3335C14.3332 11.4168 15.0832 10.6668 15.9999 10.6668C16.9165 10.6668 17.6665 11.4168 17.6665 12.3335V15.6668C17.6665 16.5835 16.9165 17.3335 15.9999 17.3335ZM17.6665 24.0001H14.3332V20.6668H17.6665V24.0001Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function InformationCircleFilledIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 20 20">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </Icon>
  );
}
