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

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
      />
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

export function ProductBoxIcon(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"
      />
    </Icon>
  );
}

export function ArrowDropDownIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path opacity="0.995" d="M7 10L12 15L17 10H7Z" fill="#171717" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </Icon>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.4301 12.98C19.4701 12.66 19.5001 12.34 19.5001 12C19.5001 11.66 19.4701 11.34 19.4301 11.02L21.5401 9.37C21.7301 9.22 21.7801 8.95 21.6601 8.73L19.6601 5.27C19.5701 5.11 19.4001 5.02 19.2201 5.02C19.1601 5.02 19.1001 5.03 19.0501 5.05L16.5601 6.05C16.0401 5.65 15.4801 5.32 14.8701 5.07L14.4901 2.42C14.4601 2.18 14.2501 2 14.0001 2H10.0001C9.75008 2 9.54008 2.18 9.51008 2.42L9.13008 5.07C8.52008 5.32 7.96008 5.66 7.44008 6.05L4.95008 5.05C4.89008 5.03 4.83008 5.02 4.77008 5.02C4.60008 5.02 4.43008 5.11 4.34008 5.27L2.34008 8.73C2.21008 8.95 2.27008 9.22 2.46008 9.37L4.57008 11.02C4.53008 11.34 4.50008 11.67 4.50008 12C4.50008 12.33 4.53008 12.66 4.57008 12.98L2.46008 14.63C2.27008 14.78 2.22008 15.05 2.34008 15.27L4.34008 18.73C4.43008 18.89 4.60008 18.98 4.78008 18.98C4.84008 18.98 4.90008 18.97 4.95008 18.95L7.44008 17.95C7.96008 18.35 8.52008 18.68 9.13008 18.93L9.51008 21.58C9.54008 21.82 9.75008 22 10.0001 22H14.0001C14.2501 22 14.4601 21.82 14.4901 21.58L14.8701 18.93C15.4801 18.68 16.0401 18.34 16.5601 17.95L19.0501 18.95C19.1101 18.97 19.1701 18.98 19.2301 18.98C19.4001 18.98 19.5701 18.89 19.6601 18.73L21.6601 15.27C21.7801 15.05 21.7301 14.78 21.5401 14.63L19.4301 12.98ZM17.4501 11.27C17.4901 11.58 17.5001 11.79 17.5001 12C17.5001 12.21 17.4801 12.43 17.4501 12.73L17.3101 13.86L18.2001 14.56L19.2801 15.4L18.5801 16.61L17.3101 16.1L16.2701 15.68L15.3701 16.36C14.9401 16.68 14.5301 16.92 14.1201 17.09L13.0601 17.52L12.9001 18.65L12.7001 20H11.3001L11.1101 18.65L10.9501 17.52L9.89008 17.09C9.46008 16.91 9.06008 16.68 8.66008 16.38L7.75008 15.68L6.69008 16.11L5.42008 16.62L4.72008 15.41L5.80008 14.57L6.69008 13.87L6.55008 12.74C6.52008 12.43 6.50008 12.2 6.50008 12C6.50008 11.8 6.52008 11.57 6.55008 11.27L6.69008 10.14L5.80008 9.44L4.72008 8.6L5.42008 7.39L6.69008 7.9L7.73008 8.32L8.63008 7.64C9.06008 7.32 9.47008 7.08 9.88008 6.91L10.9401 6.48L11.1001 5.35L11.3001 4H12.6901L12.8801 5.35L13.0401 6.48L14.1001 6.91C14.5301 7.09 14.9301 7.32 15.3301 7.62L16.2401 8.32L17.3001 7.89L18.5701 7.38L19.2701 8.59L18.2001 9.44L17.3101 10.14L17.4501 11.27ZM12.0001 8C9.79008 8 8.00008 9.79 8.00008 12C8.00008 14.21 9.79008 16 12.0001 16C14.2101 16 16.0001 14.21 16.0001 12C16.0001 9.79 14.2101 8 12.0001 8ZM12.0001 14C10.9001 14 10.0001 13.1 10.0001 12C10.0001 10.9 10.9001 10 12.0001 10C13.1001 10 14.0001 10.9 14.0001 12C14.0001 13.1 13.1001 14 12.0001 14Z" />
    </Icon>
  );
}

export function SwapArrowsIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z"
      />
    </Icon>
  );
}

export function CheckCircleSolidIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </Icon>
  );
}

export function FurnitureIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M19,7H5V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7"
      />
    </Icon>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"
      />
    </Icon>
  );
}

export function HomeApplianceIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M5 20V12H2L12 3L22 12H19V20H5M12 5.69L7 10.19V18H17V10.19L12 5.69M11.5 18V14H9L12.5 7V11H15L11.5 18Z"
      />
    </Icon>
  );
}

export function BookShelfIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z"
      />
    </Icon>
  );
}

export function StorageIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M17 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H7C3.69 6 1 8.69 1 12S3.69 18 7 18V21H9V18H15V21H17V18C20.31 18 23 15.31 23 12S20.31 6 17 6M10 5H14V6H10V5M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16Z"
      />
    </Icon>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="currentColor"
        d="M12 4C14.2 4 16 5.8 16 8C16 10.1 13.9 13.5 12 15.9C10.1 13.4 8 10.1 8 8C8 5.8 9.8 4 12 4M12 2C8.7 2 6 4.7 6 8C6 12.5 12 19 12 19S18 12.4 18 8C18 4.7 15.3 2 12 2M12 6C10.9 6 10 6.9 10 8S10.9 10 12 10 14 9.1 14 8 13.1 6 12 6M20 19C20 21.2 16.4 23 12 23S4 21.2 4 19C4 17.7 5.2 16.6 7.1 15.8L7.7 16.7C6.7 17.2 6 17.8 6 18.5C6 19.9 8.7 21 12 21S18 19.9 18 18.5C18 17.8 17.3 17.2 16.2 16.7L16.8 15.8C18.8 16.6 20 17.7 20 19Z"
      />
    </Icon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.0498 4.91C17.1798 3.03 14.6898 2 12.0398 2C6.5798 2 2.1298 6.45 2.1298 11.91C2.1298 13.66 2.5898 15.36 3.4498 16.86L2.0498 22L7.2998 20.62C8.7498 21.41 10.3798 21.83 12.0398 21.83C17.4998 21.83 21.9498 17.38 21.9498 11.92C21.9498 9.27 20.9198 6.78 19.0498 4.91ZM12.0398 20.15C10.5598 20.15 9.1098 19.75 7.8398 19L7.5398 18.82L4.4198 19.64L5.2498 16.6L5.0498 16.29C4.2298 14.98 3.7898 13.46 3.7898 11.91C3.7898 7.37 7.4898 3.67 12.0298 3.67C14.2298 3.67 16.2998 4.53 17.8498 6.09C19.4098 7.65 20.2598 9.72 20.2598 11.92C20.2798 16.46 16.5798 20.15 12.0398 20.15ZM16.5598 13.99C16.3098 13.87 15.0898 13.27 14.8698 13.18C14.6398 13.1 14.4798 13.06 14.3098 13.3C14.1398 13.55 13.6698 14.11 13.5298 14.27C13.3898 14.44 13.2398 14.46 12.9898 14.33C12.7398 14.21 11.9398 13.94 10.9998 13.1C10.2598 12.44 9.7698 11.63 9.6198 11.38C9.4798 11.13 9.5998 11 9.7298 10.87C9.8398 10.76 9.9798 10.58 10.0998 10.44C10.2198 10.3 10.2698 10.19 10.3498 10.03C10.4298 9.86 10.3898 9.72 10.3298 9.6C10.2698 9.48 9.7698 8.26 9.5698 7.76C9.3698 7.28 9.1598 7.34 9.0098 7.33C8.8598 7.33 8.6998 7.33 8.5298 7.33C8.3598 7.33 8.0998 7.39 7.8698 7.64C7.6498 7.89 7.0098 8.49 7.0098 9.71C7.0098 10.93 7.89981 12.11 8.0198 12.27C8.1398 12.44 9.7698 14.94 12.2498 16.01C12.8398 16.27 13.2998 16.42 13.6598 16.53C14.2498 16.72 14.7898 16.69 15.2198 16.63C15.6998 16.56 16.6898 16.03 16.8898 15.45C17.0998 14.87 17.0998 14.38 17.0298 14.27C16.9598 14.16 16.8098 14.11 16.5598 13.99Z" />
    </Icon>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <Icon {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </Icon>
  );
}

export function DocumentDownloadIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24" stroke="none">
      <path d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z" />
    </Icon>
  );
}

export function AddImageIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M13 19C13 19.7 13.13 20.37 13.35 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3H19C20.11 3 21 3.9 21 5V13.35C20.37 13.13 19.7 13 19 13V5H5V19H13M13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H13.35C13.75 15.88 14.47 14.91 15.4 14.21L13.96 12.29M20 18V15H18V18H15V20H18V23H20V20H23V18H20Z"
      />
    </Icon>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z"
      />
    </Icon>
  );
}

export function RaiseIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M8,21V19H16V21H8M8,17V15H16V17H8M8,13V11H16V13H8M19,9H5L12,2L19,9Z"
      />
    </Icon>
  );
}

export function PreviewProductIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17,22V20H20V17H22V20.5C22,20.89 21.84,21.24 21.54,21.54C21.24,21.84 20.89,22 20.5,22H17M7,22H3.5C3.11,22 2.76,21.84 2.46,21.54C2.16,21.24 2,20.89 2,20.5V17H4V20H7V22M17,2H20.5C20.89,2 21.24,2.16 21.54,2.46C21.84,2.76 22,3.11 22,3.5V7H20V4H17V2M7,2V4H4V7H2V3.5C2,3.11 2.16,2.76 2.46,2.46C2.76,2.16 3.11,2 3.5,2H7M13,17.25L17,14.95V10.36L13,12.66V17.25M12,10.92L16,8.63L12,6.28L8,8.63L12,10.92M7,14.95L11,17.25V12.66L7,10.36V14.95M18.23,7.59C18.73,7.91 19,8.34 19,8.91V15.23C19,15.8 18.73,16.23 18.23,16.55L12.75,19.73C12.25,20.05 11.75,20.05 11.25,19.73L5.77,16.55C5.27,16.23 5,15.8 5,15.23V8.91C5,8.34 5.27,7.91 5.77,7.59L11.25,4.41C11.5,4.28 11.75,4.22 12,4.22C12.25,4.22 12.5,4.28 12.75,4.41L18.23,7.59Z"
      />
    </Icon>
  );
}

export function SaveIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
      />
    </Icon>
  );
}
