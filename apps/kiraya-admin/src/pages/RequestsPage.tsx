import { useVerificationRequests } from '@kiraya/data-store/products';
import {
  Box,
  DataLoadingFallback,
  getButtonClassName,
  Heading,
  Inline,
  PageMeta,
  Stack,
  Text,
  Time,
} from '@kiraya/kiraya-ui';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
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

function RequestsLayout() {
  return (
    <>
      <PageMeta>
        <title>Requests</title>
      </PageMeta>
      <Box
        key="requests_page_layout"
        bgColor="white"
        className="min-h-screen w-full sm:min-h-0"
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
              Review Requests
            </Heading>
          </Stack>
        </Box>
        <Box>
          <Box flexGrow="1">
            <Requests />
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Requests() {
  const { requests } = useVerificationRequests();
  return (
    <>
      <PageMeta>
        <title>Requests for verification</title>
      </PageMeta>
      <Stack width="full" maxWidth="xl" gap="16">
        <Box
          bgColor="white"
          paddingY="6"
          paddingX={{ xs: '4', md: '8' }}
          minHeight={{ xs: 'screen', sm: '0' }}
        >
          <Stack maxWidth="full" gap="6">
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
                        className="w-[260px]"
                      >
                        Date &amp; Time
                      </Box>
                      <Box
                        as="th"
                        position="sticky"
                        top="0"
                        bgColor="gray100"
                        paddingX="3"
                        paddingY="4"
                        className="w-[130px]"
                      >
                        Product Details
                      </Box>
                      <Box
                        as="th"
                        position="sticky"
                        top="0"
                        bgColor="gray100"
                        paddingX="3"
                        paddingY="4"
                        className="w-[260px]"
                      >
                        Status
                      </Box>
                      <Box
                        as="th"
                        position="sticky"
                        top="0"
                        bgColor="gray100"
                        paddingX="3"
                        paddingY="4"
                        className="w-[260px]"
                      >
                        Actions
                      </Box>
                    </tr>
                  </Box>
                  <Box as="tbody">
                    {requests.map((request) => (
                      <Fragment key={request.uid}>
                        <Box
                          as="tr"
                          position="sticky"
                          top="0"
                          paddingX="3"
                          paddingY="4"
                          className="w-[130px]"
                        >
                          <Box
                            as="td"
                            paddingX="3"
                            paddingY="4"
                            className="whitespace-pre"
                          >
                            <Stack gap="2" textAlign="center">
                              <Time
                                fontSize="sm"
                                color="gray500"
                                timeStamp={request.creationAt}
                                format="dd MMM yyyy, hh:mm a"
                              />
                            </Stack>
                          </Box>
                          <Box
                            as="td"
                            paddingX="3"
                            paddingY="4"
                            className="whitespace-pre"
                          >
                            <Stack gap="2" textAlign="center">
                              <Link to={`${request.uid}`}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  color="blue900"
                                >
                                  Product Details
                                </Text>
                              </Link>
                            </Stack>
                          </Box>
                          <Box
                            as="td"
                            paddingX="3"
                            paddingY="4"
                            className="whitespace-pre"
                          >
                            <Stack gap="2" textAlign="center">
                              <Stack
                                rounded="md"
                                backgroundColor={
                                  request.status === 'pending'
                                    ? 'yellow600'
                                    : request.status === 'rejected'
                                    ? 'red500'
                                    : request.status === 'approved'
                                    ? 'green500'
                                    : 'yellow300'
                                }
                              >
                                <Text
                                  color="white"
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  style={{
                                    paddingTop: 4,
                                    paddingBottom: 4,
                                  }}
                                >
                                  {request.status}
                                </Text>
                              </Stack>
                            </Stack>
                          </Box>
                          <Box
                            as="td"
                            paddingX="3"
                            paddingY="4"
                            className="whitespace-pre"
                          >
                            <Inline
                              textAlign="center"
                              gap="4"
                              justifyContent="center"
                            >
                              <Stack
                                gap="2"
                                textAlign="center"
                                cursor="pointer"
                                as={Link}
                                to={`${request.uid}`}
                                className={getButtonClassName({ inline: true })}
                              >
                                <Text fontSize="sm" fontWeight="semibold">
                                  View Details
                                </Text>
                              </Stack>
                            </Inline>
                          </Box>
                        </Box>
                      </Fragment>
                    ))}
                  </Box>
                </Box>
              </Stack>
            ) : (
              <Stack>
                <Text fontSize="base" fontWeight="semibold">
                  There are no requests for any products as of now. Try changing
                  some filters.
                </Text>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
