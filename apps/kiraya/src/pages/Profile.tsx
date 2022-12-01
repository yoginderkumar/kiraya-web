import React from 'react';
import { useLogout } from '@kiraya/data-store/auth';
import { useProfile } from '@kiraya/data-store/users';
import {
  Alert,
  Button,
  InformationCircleIcon,
  LogoutIcon,
  PencilIcon,
  Box,
  Text,
  Heading,
  Inline,
  Stack,
  InformationWarningIcon,
  Time,
  //   Tooltip,
  //   CheckCircleIcon,
} from '@kiraya/kiraya-ui';
import { useEffect } from 'react';
import { useUser } from 'reactfire';
import config from '../config';
import appImageSrc from '../Profile/app_image.png';
import { UpdateProfileInDialog } from '../Profile';

export default function ProfilePage() {
  const { data: authUser } = useUser();
  const { user } = useProfile();
  const logout = useLogout();

  return (
    <Stack width="full" alignItems="center" gap="16">
      <Stack maxWidth="full" gap="2" width="full">
        <Stack
          padding={{ xs: '0', md: '8' }}
          bgColor="white"
          rounded="md"
          gap="8"
        >
          <Stack gap="3">
            <Stack gap="2">
              <Text fontSize="sm" fontWeight="medium" color="gray500">
                Name
              </Text>
              <Heading as="h2" fontWeight="medium" fontSize="2xl">
                {user
                  ? user.displayName
                  : authUser?.displayName || 'Kiraya User'}
              </Heading>
              {user ? (
                <Box>
                  <Stack gap="2">
                    <Text fontWeight="medium">{user.email}</Text>
                    <Text>{user.phoneNumber}</Text>
                  </Stack>
                </Box>
              ) : null}
            </Stack>
            <Inline as="footer" gap="4" collapseBelow="sm">
              <UpdateProfileInDialog>
                {({ update }) => (
                  <Button onClick={update}>
                    <PencilIcon /> Edit Profile
                  </Button>
                )}
              </UpdateProfileInDialog>
              <Button onClick={() => logout()} status="error" level="tertiary">
                <LogoutIcon /> Logout
              </Button>
            </Inline>
          </Stack>
          {user.metadata?.creationTime ? (
            <Box>
              <Text fontSize="sm" color="gray500">
                Member Since:{' '}
                <Time date={new Date(user.metadata.creationTime)} />
              </Text>
            </Box>
          ) : null}
          <Box paddingTop="8" borderTopWidth="1">
            <Box marginBottom="4">
              <Text color="gray500" fontWeight="medium">
                Preferences
              </Text>
            </Box>
            <Stack as="ol">
              <Inline gap="4">
                <Stack flex="1" minWidth="0" gap="2">
                  <Stack gap="1">
                    <Heading as="h4" fontWeight="medium">
                      Notifications
                    </Heading>
                    <Text fontSize="sm" color="gray500" fontWeight="normal">
                      Get notified for entries from group books
                    </Text>
                  </Stack>
                </Stack>
              </Inline>
            </Stack>
          </Box>
        </Stack>
      </Stack>
      <Box maxWidth="lg">
        {/* <Inline
            as="a"
            rounded="lg"
            overflow="hidden"
            borderWidth="4"
            borderColor="blue900"
            className="shadow-lg"
            href={config.appDownloadLink}
            target="_blank"
            rel="noreferrer nopener"
            collapseBelow="sm"
          >
            <Box width={{ xs: "full", md: "1/2" }}>
              <img src={appImageSrc} alt="Mobile App" />
            </Box>
            <Inline
              bgColor="blue900"
              paddingY="4"
              color="white"
              width={{ xs: "full", md: "1/2" }}
              alignItems="center"
              justifyContent="center"
            >
              <Box>
                <Box marginBottom="1">
                  <Text fontSize="xs">Checkout the</Text>
                </Box>
                <Box marginBottom="2">
                  <Heading as="h3" fontSize="2xl">
                    Mobile App
                  </Heading>
                </Box>
                <Stack gap="2" fontSize="sm" fontWeight="medium">
                  <Inline gap="2">
                    <CheckCircleSolidIcon color="green100" size="4" />
                    <Text>Offline Support</Text>
                  </Inline>
                  <Inline gap="2">
                    <CheckCircleSolidIcon color="green100" size="4" />
                    <Text>Book Sharing</Text>
                  </Inline>
                  <Inline gap="2">
                    <CheckCircleSolidIcon color="green100" size="4" />
                    <Text>Data Backup</Text>
                  </Inline>
                </Stack>
                <Box
                  bgColor="blue100"
                  paddingX="4"
                  paddingY="2"
                  marginTop="4"
                  rounded="md"
                  className="shadow"
                >
                  <Text color="black">
                    <AppDownloadIcon /> Download Now
                  </Text>
                </Box>
              </Box>
            </Inline>
          </Inline> */}
      </Box>
    </Stack>
  );
}
