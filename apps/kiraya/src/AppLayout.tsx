import React from 'react';
import {
  ArrowDownIcon,
  Box,
  Circle,
  Heading,
  Inline,
  LogoutIcon,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemHeader,
  MenuLink,
  MenuList,
  SearchIcon,
  Stack,
  Text,
  UserIcon,
} from '@kiraya/kiraya-ui';
import { Outlet } from 'react-router-dom';
import { AuthenticationInModal } from './Auth';
import { useProfile } from '@kiraya/data-store/users';
import config from './config';
import { useLogout } from '@kiraya/data-store/auth';

export function AppLayout() {
  return (
    <Stack minHeight="screen" minWidth="screenMd">
      <Header />
      <Inline flex="1">
        <Outlet />
      </Inline>
    </Stack>
  );
}

export function Header() {
  const { user } = useProfile();
  const logout = useLogout();
  console.log('User: ', user);
  return (
    <Inline
      paddingX="12"
      paddingY="3"
      borderBottomWidth="2"
      backgroundColor="white"
      alignItems="center"
      gap="4"
      justifyContent="between"
    >
      <Box width="1/2">
        <Heading fontWeight="semibold" as="h1" fontSize="2xl" color="blue900">
          {config.appTitle.toUpperCase()}
        </Heading>
      </Box>
      <Inline
        width="full"
        rounded="md"
        borderWidth="2"
        alignItems="center"
        borderColor="blue900"
        backgroundColor="blue900"
      >
        <Inline
          gap="2"
          paddingY="2"
          paddingX="4"
          width="full"
          height="full"
          backgroundColor="white"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
        >
          <Box alignSelf="center">
            <button
              id="dropdownDividerButton"
              data-dropdown-toggle="dropdownDivider"
              className="flex items-center items-center justify-center text-black text-sm font-semibold w-max"
              type="button"
            >
              ALL CATEGORIES
              <Box>
                <ArrowDownIcon size="5" className="text-gray-500" />
              </Box>
            </button>
          </Box>
          <Box className="w-[3px]" rounded="md" backgroundColor="gray200" />
          <Box
            display="flex"
            alignItems="center"
            width="full"
            borderWidth="0"
            minHeight="full"
            alignSelf="center"
            backgroundColor="white"
            borderTopRightRadius="lg"
            borderBottomRightRadius="lg"
          >
            <input
              type="search"
              name="q"
              placeholder="Search here..."
              className="bg-transparent outline-none flex-1 w-full placeholder:gray-600"
            />
          </Box>
        </Inline>
        <Box
          backgroundColor="blue900"
          display="flex"
          alignItems="center"
          alignSelf="stretch"
          paddingX="3"
          cursor="pointer"
        >
          <button type="button" className="text-gray-500">
            <Box>
              <SearchIcon color="white" />
            </Box>
          </button>
        </Box>
      </Inline>
      <Menu>
        <MenuButton inline>
          <Circle size="10">
            {user && user.displayName ? (
              <Text textTransform="uppercase" fontSize="md" color="blue900">
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
                  <Text textTransform="uppercase" fontSize="lg" color="blue900">
                    {user.displayName ? user.displayName[0] : 'KU'}
                  </Text>
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
        ) : (
          <AuthenticationInModal>
            {({ onOpen }) => (
              <MenuList align="bottom-right">
                <MenuItem action="login" onClick={() => onOpen('login')}>
                  Login
                </MenuItem>
                <MenuItem action="login" onClick={() => onOpen('signup')}>
                  Signup
                </MenuItem>
              </MenuList>
            )}
          </AuthenticationInModal>
        )}
      </Menu>
    </Inline>
  );
}
