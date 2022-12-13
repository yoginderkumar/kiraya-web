import React, { useState } from 'react';
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
  PlusIcon,
  ProductBoxIcon,
  SearchIcon,
  Stack,
  SwapArrowsIcon,
  Text,
  UserIcon,
} from '@kiraya/kiraya-ui';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { AuthenticationInModal } from './Auth';
import { useProfile } from '@kiraya/data-store/users';
import config from './config';
import { useLogout } from '@kiraya/data-store/auth';
import { SuspenseWithPerf } from 'reactfire';

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
  const logout = useLogout();
  const { user } = useProfile();
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
        <Link to="/">
          <Heading fontWeight="semibold" as="h1" fontSize="2xl" color="blue900">
            {config.appTitle.toUpperCase()}
          </Heading>
        </Link>
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
            <MenuLink to="/profile/your-products">
              <ProductBoxIcon /> Your Products
            </MenuLink>
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

export function DashboardLayout() {
  const maxHeight = 'calc(100vh - 52px)';
  return (
    <Stack flex="1" maxWidth="screen2xl" marginX="auto" minWidth="screenMd">
      <Inline flex="1" width="full" maxWidth="full">
        <Box as="aside" position="relative" zIndex="10" className="w-60">
          <ProfileSidebar maxHeight={maxHeight} />
        </Box>
        <Stack
          as="main"
          flex="1"
          bgColor="white"
          maxWidth="full"
          overflow="auto"
        >
          <Box
            flex="1"
            overflow="auto"
            style={{
              maxHeight,
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Inline>
    </Stack>
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
    id: 'products',
    label: 'Products',
    icon: <ProductBoxIcon />,
    to: 'your-products',
  },
  {
    id: 'requests',
    label: 'Requests',
    icon: <SwapArrowsIcon />,
    to: 'requests',
  },
];

export function ProfileSidebar({
  maxHeight,
  routePrefix = '',
}: {
  maxHeight?: string;
  routePrefix?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<ProfileOptions>('profile');
  return (
    <Box
      position="relative"
      color="white"
      paddingBottom="16"
      overflow="auto"
      minHeight="full"
      flex="1"
      className="bg-[#2C324B]"
      style={{
        maxHeight: maxHeight,
      }}
    >
      <Box position="sticky" top="0" zIndex="10">
        <Box paddingX="3" paddingY="4" bgColor="gray900">
          <Inline
            as="button"
            onClick={() => navigate('your-products/add-product')}
            padding="1"
            alignItems="center"
            gap="4"
            fontWeight="semibold"
            rounded="md"
            width="full"
            className="bg-blue-900 bg-opacity-20"
          >
            <Stack
              as="span"
              size="8"
              alignItems="center"
              justifyContent="center"
              bgColor="blue900"
              rounded="md"
            >
              <PlusIcon size="6" />
            </Stack>
            <Text as="span">Add New Product</Text>
          </Inline>
          {/* <AddNewBusinessInModal
          onSuccess={(newBusinessId) =>
            navigate(`${routePrefix}/businesses/${newBusinessId}/cashbooks`)
          }
        >
          {({ add }) => (
          )}
        </AddNewBusinessInModal> */}
        </Box>
      </Box>

      <Box position="relative" zIndex="0" paddingX="3">
        <Stack as="ol" paddingTop="2">
          {profileOptions.map((option, index) => {
            return (
              <Box
                as="li"
                key={option.id}
                borderTopWidth={index === 0 ? '0' : '1'}
                className="border-[#54586A]"
                cursor="pointer"
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
                    bgColor={
                      location.pathname.split('/')[0].includes(option.to)
                        ? 'blue900'
                        : 'transparent'
                    }
                    // bgColor={state === option.id ? 'blue900' : 'transparent'}
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
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
