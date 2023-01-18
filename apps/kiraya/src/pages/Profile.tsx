import React from 'react';
import { useLogout } from '@kiraya/data-store/auth';
import { useProfile } from '@kiraya/data-store/users';
import {
  Button,
  LogoutIcon,
  PencilIcon,
  Box,
  Text,
  Heading,
  Inline,
  Stack,
  Time,
  PageMeta,
} from '@kiraya/kiraya-ui';
import { useUser } from 'reactfire';
import { UpdateProfileInDialog } from '../Profile';

export default function ProfilePage() {
  const { data: authUser } = useUser();
  const { user } = useProfile();
  const logout = useLogout();

  return (
    <>
      <PageMeta>
        <title>{user.displayName}</title>
      </PageMeta>
      <Stack width="full" alignItems="center" gap="16">
        <Stack maxWidth="full" gap="2" width="full">
          <Box
            as="header"
            paddingY="6"
            paddingX="8"
            borderBottomWidth="1"
            borderColor="gray100"
          >
            <Stack flexGrow="1" gap="1">
              <Heading as="h2" fontSize="lg" fontWeight="semibold">
                Profile
              </Heading>
            </Stack>
          </Box>
          <Stack
            paddingX={{ xs: '0', md: '8' }}
            paddingY={{ xs: '0', md: '4' }}
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
                <Button
                  onClick={() => logout()}
                  status="error"
                  level="tertiary"
                >
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
      </Stack>
    </>
  );
}
