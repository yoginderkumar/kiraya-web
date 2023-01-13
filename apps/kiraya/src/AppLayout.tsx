import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownIcon,
  Box,
  Button,
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
  PlusIcon,
  ProductBoxIcon,
  SearchIcon,
  Stack,
  SwapArrowsIcon,
  Text,
  UserIcon,
} from '@kiraya/kiraya-ui';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  const logout = useLogout();
  const { user } = useProfile();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSearchInFocus, setSearchInFocus] = useState<boolean>(false);
  function onInputFocus() {
    setTimeout(() => {
      setSearchInFocus(true);
    }, 100);
    inputContainerRef.current?.classList.replace('w-[20%]', 'w-[40%]');
  }
  function onBlurredInput() {
    setSearchInFocus(false);
    inputContainerRef.current?.classList.replace('w-[40%]', 'w-[20%]');
  }
  function onSearchClicked() {
    console.log('Console:');
    navigate(`/search?query=${inputRef.current?.value}`);
    return;
  }
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
      <Inline alignItems="center" gap="6">
        <Link to="/">
          <Heading fontWeight="semibold" as="h1" fontSize="2xl" color="blue900">
            {config.appTitle.toUpperCase()}
          </Heading>
        </Link>
      </Inline>
      <Inline width="full" justifyContent="end" alignItems="center" gap="8">
        <Button
          level="primary"
          style={{
            borderRadius: '100px',
            backgroundColor: '#EEEEEE',
            borderColor: '#EEEEEE',
          }}
        >
          <Text fontWeight="semibold" fontSize="sm" color="gray500">
            Categories
          </Text>
          <Box>
            <ArrowDownIcon size="5" color="gray500" />
          </Box>
        </Button>
        <Box
          position="relative"
          height="10"
          ref={inputContainerRef}
          className="w-[20%] search-box"
        >
          <input
            type="search"
            name="q"
            ref={inputRef}
            tabIndex={0}
            onFocus={onInputFocus}
            onBlur={onBlurredInput}
            onKeyDown={(e) => {
              if (!inputRef.current?.value) {
                return;
              }
              const keyCode = e.key as string;
              if (keyCode === 'Enter') {
                onSearchClicked();
                return;
              }
            }}
            placeholder="Search here..."
            className="h-full w-full border-[2px] bg-white text-md rounded-[50px] px-4 outline-0"
          />
          <button
            type="button"
            onClick={onSearchClicked}
            className="text-white rounded-full h-8 w-8 bg-blue-900 absolute top-[50%] right-[5px] translate-y-[-50%]"
          >
            <Box>
              <SearchIcon />
            </Box>
          </button>
        </Box>
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
                  <Text textTransform="uppercase" fontSize="lg" color="blue900">
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
              bgColor="green900"
              rounded="md"
            >
              <PlusIcon size="6" />
            </Stack>
            <Text as="span">Add Product</Text>
          </Inline>
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
                backgroundColor={option.id === state ? 'blue900' : undefined}
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
                    bgColor={
                      location.pathname.split('/')[0].includes(option.to)
                        ? 'blue900'
                        : 'transparent'
                    }
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
