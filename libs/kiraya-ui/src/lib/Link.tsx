import { Link, LinkProps, useResolvedPath, useMatch } from 'react-router-dom';
import { Box, BoxProps, BoxOwnProps } from './Box';

export type NavLinkProps = Omit<
  LinkProps,
  keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
> &
  BoxProps<typeof Link> & {
    end?: boolean;
    activeProps?: BoxOwnProps;
  };

export function NavLink({
  activeProps,
  className,
  children,
  to,
  end = false,
  'aria-current': ariaCurrentProp = 'page',
  ...props
}: NavLinkProps) {
  const resolved = useResolvedPath(to);
  const match = useMatch({
    path: resolved.pathname,
    end: end,
    caseSensitive: false,
  });
  if (match && activeProps) {
    props = { ...props, ...activeProps };
  }
  const ariaCurrent = match ? ariaCurrentProp : undefined;
  return (
    <Box<typeof Link> as={Link} to={to} {...props} aria-current={ariaCurrent}>
      {children}
    </Box>
  );
}
