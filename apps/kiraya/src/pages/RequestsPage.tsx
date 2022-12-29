import {
  Box,
  DataLoadingFallback,
  Heading,
  NavLink,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';

export default function RequestsPage() {
  return (
    <ErrorBoundary>
      <SuspenseWithPerf
        fallback={<DataLoadingFallback label="Loading Requests..." />}
        traceId="loading_request_details"
      >
        <RequestsLayout key="requests_details" />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

const requestOptions = [
  {
    label: 'Requests (For you)',
    description: 'View requests for your products on the platform',
    to: 'profile',
  },
  {
    label: 'Requests (By you)',
    description: 'List of requests which you sent to different owners',
    to: 'requests-by-you',
  },
];
function RequestsLayout() {
  return (
    <Box
      key="requests_page_layout"
      bgColor="white"
      className="min-h-screen sm:min-h-0"
    >
      <Box
        as="header"
        paddingY="6"
        paddingX="8"
        borderBottomWidth="1"
        borderColor="gray100"
      >
        <Stack flexGrow="1" gap="1">
          <Heading as="h2" fontSize="lg" fontWeight="semibold">
            Requests
          </Heading>
        </Stack>
      </Box>
      <Box display="flex">
        <Box
          as="aside"
          className="w-[264px]"
          borderRightWidth="1"
          borderColor="gray100"
        >
          <Box as="ol" paddingLeft="4" paddingBottom="12">
            {requestOptions.map(({ label, description, to }) => {
              return (
                <Box
                  as="li"
                  paddingY="3"
                  paddingRight="4"
                  key={label}
                  borderBottomWidth="1"
                >
                  <NavLink
                    to={to}
                    paddingX="4"
                    paddingY="3"
                    display="block"
                    rounded="md"
                    bgColor={{ default: 'transparent', hover: 'blue50' }}
                    activeProps={{
                      bgColor: 'blue100',
                    }}
                  >
                    <Stack gap="2">
                      <Heading as="h4" fontWeight="semibold" fontSize="base">
                        {label}
                      </Heading>
                      <Text color="gray500" fontWeight="medium" fontSize="sm">
                        {description}
                      </Text>
                    </Stack>
                  </NavLink>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box flexGrow="1">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
