import { Box, DataLoadingFallback, Heading, Stack } from '@kiraya/kiraya-ui';
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
      </Stack>
    </Box>
  );
}
