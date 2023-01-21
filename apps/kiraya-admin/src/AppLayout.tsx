import React, { useEffect, useState } from 'react';
import {
  ArrowDownIcon,
  Box,
  Circle,
  getButtonClassName,
  Heading,
  Inline,
  LogoutIcon,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemHeader,
  MenuLink,
  MenuList,
  Stack,
  SwapArrowsIcon,
  Text,
  UserIcon,
} from '@kiraya/kiraya-ui';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '@kiraya/data-store/users';
import config from './config';
import { useLogout } from '@kiraya/data-store/auth';

export function DashboardLayout() {
  const maxHeight = 'calc(100vh - 52px)';
  return (
    <Stack minHeight="screen" minWidth="screenMd">
      <Header />
      <Inline flex="1" backgroundColor="white">
        <Box as="aside" position="relative" zIndex="10" className="w-60">
          <Sidebar maxHeight={maxHeight} />
        </Box>
        <Outlet />
      </Inline>
    </Stack>
  );
}

export function Header() {
  const logout = useLogout();
  const { user } = useProfile();
  return (
    <Inline
      paddingX={{ md: '12', xs: '4' }}
      paddingY="3"
      borderBottomWidth="2"
      backgroundColor="white"
      alignItems="center"
      gap="4"
      justifyContent="between"
    >
      <Inline alignItems="center" gap="6">
        <Link to="/">
          <Heading
            fontWeight="semibold"
            as="h1"
            fontSize={{ md: '2xl', xs: 'lg' }}
            color="blue900"
          >
            {config.appTitle.toUpperCase()}
          </Heading>
        </Link>
      </Inline>
      <Box width="full" display={{ lg: 'block', xs: 'none' }}>
        <Inline width="full" justifyContent="end" alignItems="center" gap="8">
          {user && user.uid ? (
            <Menu>
              <MenuButton inline>
                <Circle size="8">
                  {user && user.photoURL ? (
                    <img
                      src={user.photoURL}
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                      alt={user.displayName}
                    />
                  ) : user && user.displayName ? (
                    <Text
                      textTransform="uppercase"
                      fontSize="lg"
                      color="blue900"
                    >
                      {user.displayName ? user.displayName[0] : 'KU'}
                    </Text>
                  ) : (
                    <UserIcon />
                  )}
                </Circle>
                {user && user.uid ? <ArrowDownIcon /> : null}
              </MenuButton>
              {user && user.uid ? (
                <MenuList align="bottom-right">
                  <MenuLink to={'/profile'} className="border-b py-4 mb-2">
                    <Inline alignItems="center" gap="4" className="w-60">
                      <Circle size="12">
                        {user && user.photoURL ? (
                          <img
                            src={user.photoURL}
                            className="rounded-full"
                            referrerPolicy="no-referrer"
                            alt={user.displayName}
                          />
                        ) : user && user.displayName ? (
                          <Text
                            textTransform="uppercase"
                            fontSize="lg"
                            color="blue900"
                          >
                            {user.displayName ? user.displayName[0] : 'KU'}
                          </Text>
                        ) : null}
                      </Circle>
                      <Stack gap="1">
                        <Heading as="h4" fontWeight="medium">
                          {user.displayName || `${config.appTitle} User`}
                        </Heading>
                        <Text
                          fontSize="sm"
                          color="gray500"
                          className="tracking-wider"
                        >
                          {user.phoneNumber}
                        </Text>
                        <Text fontSize="xs" color="blue900" fontWeight="medium">
                          Your Profile <ArrowDownIcon rotate="270" size="4" />
                        </Text>
                      </Stack>
                    </Inline>
                  </MenuLink>
                  <MenuItemHeader className="mt-2">Settings</MenuItemHeader>
                  <MenuItem action="logout" onClick={logout}>
                    <LogoutIcon /> Logout
                  </MenuItem>
                  <MenuItemHeader className="py-2 px-2 text-gray-500">
                    &copy; {config.appTitle} • Version {config.appVersion}
                  </MenuItemHeader>
                </MenuList>
              ) : null}
            </Menu>
          ) : (
            <Inline gap="4" alignItems="center">
              <Link
                to="/login?from=home"
                style={{ borderRadius: '100px' }}
                className={getButtonClassName({ level: 'primary' })}
              >
                Login
              </Link>
              <Link
                to="/signup?from=home"
                style={{ borderRadius: '100px' }}
                className={getButtonClassName({})}
              >
                Sign up
              </Link>
            </Inline>
          )}
        </Inline>
      </Box>
    </Inline>
  );
}

type ProfileOptions = 'profile' | 'products' | 'requests';

const profileOptions: Array<{
  id: ProfileOptions;
  label: string;
  icon?: React.ReactNode;
  to: string;
}> = [
  { id: 'profile', label: 'Profile', icon: <UserIcon />, to: 'profile' },
  {
    id: 'requests',
    label: 'Review Requests',
    icon: <SwapArrowsIcon />,
    to: 'requests',
  },
];

export function Sidebar({
  maxHeight,
  routePrefix = '',
}: {
  maxHeight?: string;
  routePrefix?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<ProfileOptions>('profile');

  useEffect(() => {
    if (location.pathname.includes('your-products')) {
      setState('products');
    } else if (location.pathname.includes('requests')) {
      setState('requests');
    } else {
      setState('profile');
    }
  }, [location.pathname]);

  return (
    <Box
      position="relative"
      color="white"
      paddingBottom="16"
      overflow="auto"
      minHeight="full"
      flex="1"
      className="bg-[#2C324B] w-full max-w-max"
      style={{
        maxHeight: maxHeight,
      }}
    >
      <Box position="relative" zIndex="0">
        <Stack as="ol">
          {profileOptions.map((option, index) => {
            return (
              <Box
                width="full"
                key={option.id}
                backgroundColor={option.id === state ? 'blue900' : undefined}
              >
                <Box
                  as="li"
                  key={option.id}
                  borderTopWidth={index === 0 ? '0' : '1'}
                  className="border-[#54586A]"
                  cursor="pointer"
                  rounded="md"
                  onClick={() => {
                    setState(option.id);
                    if (option.id !== state) {
                    }
                    navigate(option.id === 'profile' ? '/profile' : option.to);
                  }}
                >
                  <Stack gap="2" paddingY="2">
                    <Inline
                      gap="4"
                      paddingX="3"
                      paddingY="4"
                      rounded="md"
                      alignItems="center"
                    >
                      {option.icon ? <Box>{option.icon}</Box> : null}
                      <Stack flex="1" minWidth="0" gap="1">
                        <Inline gap="2" alignItems="center">
                          <Heading
                            as="h5"
                            fontWeight="semibold"
                            className="break-words"
                          >
                            {option.label}
                          </Heading>
                        </Inline>
                      </Stack>
                    </Inline>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
