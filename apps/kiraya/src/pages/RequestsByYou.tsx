import { useRequestsByYou } from '@kiraya/data-store/products';
import {
  Box,
  DataLoadingFallback,
  getButtonClassName,
  Heading,
  Stack,
  Text,
  Time,
} from '@kiraya/kiraya-ui';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';
import { CancelRequestInModal } from '../Requests';

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
    <>
      <Box
        bgColor="white"
        paddingY="6"
        paddingX={{ xs: '4', md: '8' }}
        minHeight={{ xs: 'screen', sm: '0' }}
      >
        <Stack maxWidth="xl" gap="6">
          <Heading as="h3" fontSize="md" fontWeight="semibold">
            Requests raised by you
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
                            <Link to={`/products/${request.productId}`}>
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
                            <Link to={`/products/${request.productId}`}>
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
                            </Link>
                          </Stack>
                        </Box>
                        <Box
                          as="td"
                          paddingX="3"
                          paddingY="4"
                          className="whitespace-pre"
                        >
                          <CancelRequestInModal request={request}>
                            {({ cancel }) => (
                              <Stack
                                gap="2"
                                textAlign="center"
                                color="red500"
                                cursor="pointer"
                                onClick={cancel}
                                className={getButtonClassName({ inline: true })}
                              >
                                <Text fontSize="sm" fontWeight="semibold">
                                  Cancel Request
                                </Text>
                              </Stack>
                            )}
                          </CancelRequestInModal>
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
                There are no requests that you made for any product.
              </Text>
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
}
