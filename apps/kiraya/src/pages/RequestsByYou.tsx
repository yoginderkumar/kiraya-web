import { useRequestsByYou } from '@kiraya/data-store/products';
import {
  Box,
  DataLoadingFallback,
  Heading,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import React from 'react';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';

export default function RequestsByYouPage() {
  return (
    <ErrorBoundary>
      <SuspenseWithPerf
        fallback={<DataLoadingFallback label="Loading requests..." />}
        traceId="loading_requests_by_you_details"
      >
        <RequestsByYou key="requests_by_you" />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

function RequestsByYou() {
  const { requests } = useRequestsByYou();
  return (
    <Box
      bgColor="white"
      paddingY="6"
      paddingX={{ xs: '4', md: '8' }}
      minHeight={{ xs: 'screen', sm: '0' }}
    >
      <Stack maxWidth="xl" gap="6">
        <Heading as="h3" fontSize="md" fontWeight="semibold">
          By you
        </Heading>
        {requests.length ? (
          <Stack gap="4">
            <Text color="gray500" fontWeight="medium">
              Showing 1 - {requests.length} of {requests.length} Items
            </Text>
            <Box
              as="table"
              width="full"
              position="relative"
              fontWeight="medium"
            >
              <Box
                as="thead"
                bgColor="gray100"
                fontWeight="semibold"
                color="gray500"
                fontSize="sm"
                className="whitespace-pre"
              >
                <tr>
                  <Box
                    as="th"
                    position="sticky"
                    top="0"
                    bgColor="gray100"
                    paddingX="3"
                    paddingY="4"
                    className="w-[130px]"
                  >
                    Date &amp; Time
                  </Box>
                </tr>
              </Box>
            </Box>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
