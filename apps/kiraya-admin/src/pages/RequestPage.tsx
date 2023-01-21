import {
  useProduct,
  useVerificationRequestById,
} from '@kiraya/data-store/products';
import {
  ArrowLeftIcon,
  Box,
  Button,
  CancelIcon,
  CheckIcon,
  DataLoadingFallback,
  Heading,
  Inline,
  LocationIcon,
  PageMeta,
  SkeletonImage,
  SpinnerIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';
import { UserAvatar } from '../Profile';
import {
  ApproveRequestInModal,
  RejectRequestInModal,
  renderTextForProductReview,
  reviewStatusColorStyles,
} from '../Requests';

export default function RequestPage() {
  const { requestId } = useParams();
  if (!requestId) return null;
  return (
    <ErrorBoundary>
      <SuspenseWithPerf
        fallback={<DataLoadingFallback label="Loading request details" />}
        traceId="loading_request_details"
      >
        <RequestDetails key={requestId} requestId={requestId} />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

function RequestDetails({ requestId }: { requestId: string }) {
  const navigate = useNavigate();
  const { request } = useVerificationRequestById(requestId);
  const { product } = useProduct(request.productId);
  const {
    title,
    duration,
    address,
    pricePerMonth,
    description,
    ownerInfo,
    productMedia,
  } = product;
  const [activeImage, setActiveImage] = useState<{
    index: number;
    url: string;
  } | null>(productMedia?.length ? { index: 0, url: productMedia[0] } : null);

  const [loadingImage, setImageLoading] = useState<boolean>(true);

  function onLoadImage() {
    setImageLoading(false);
  }

  return !product || !request ? (
    <Inline flex="1" alignItems="center" justifyContent="center" gap="4">
      <SpinnerIcon color="blue900" />
      <Text>Fetching Details...</Text>
    </Inline>
  ) : (
    <>
      <PageMeta>
        <title>{product.title}</title>
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
              <Inline
                alignItems="center"
                gap="4"
                cursor="pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon />
                <Heading as="h2" fontSize="lg" fontWeight="semibold">
                  Review Request
                </Heading>
              </Inline>
            </Stack>
          </Box>
          <Stack
            paddingX={{ xs: '0', md: '8' }}
            paddingY={{ xs: '0', md: '4' }}
            bgColor="white"
            rounded="md"
            gap="8"
          >
            <Box display={{ lg: 'block', xs: 'none' }}>
              <Stack gap="3" paddingBottom="6">
                <Inline gap="4" justifyContent="between">
                  <Stack gap="6" className="w-[30%]">
                    <Box
                      rounded="lg"
                      backgroundColor="gray100"
                      className="w-[325px] h-[320px] max-h-[320px]"
                    >
                      {loadingImage ? (
                        <SkeletonImage />
                      ) : (
                        <img
                          src={activeImage?.url}
                          className="w-full h-full object-cover rounded-xl"
                          alt={`product_${title}`}
                        />
                      )}
                    </Box>
                    {productMedia?.length ? (
                      <Inline
                        as="ul"
                        gap="6"
                        className="w-[325px]"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {productMedia.map((media, index) => (
                          <Box
                            key={media}
                            width="18"
                            height="18"
                            cursor="pointer"
                            borderWidth="2"
                            borderColor={
                              activeImage && index === activeImage?.index
                                ? 'blue900'
                                : undefined
                            }
                            rounded="lg"
                            onClick={() =>
                              setActiveImage({ index, url: media })
                            }
                          >
                            <img
                              src={media}
                              onLoad={onLoadImage}
                              alt={`media_list_${index}`}
                              className="h-full w-full rounded-lg"
                            />
                          </Box>
                        ))}
                      </Inline>
                    ) : null}
                  </Stack>
                  <Stack
                    className="w-[50%]"
                    paddingX="8"
                    paddingTop="4"
                    gap="4"
                  >
                    <Text
                      fontWeight="semibold"
                      className="line-clamp-2"
                      fontSize="2xl"
                    >
                      {title}
                    </Text>
                    {description?.length ? (
                      <Text className="pl-2" fontSize="sm">
                        {description}
                      </Text>
                    ) : null}
                    <Stack paddingLeft="2" gap="1">
                      <Text fontWeight="semibold" fontSize="md">
                        Available For?
                      </Text>
                      <Text>{duration.toString()} Months</Text>
                    </Stack>
                    <Stack paddingLeft="2" gap="1">
                      <Text fontWeight="semibold" fontSize="md">
                        Location
                      </Text>
                      <Text>
                        <LocationIcon color="red900" /> {address?.state.label}
                      </Text>
                    </Stack>
                    <Stack paddingLeft="2" gap="1">
                      <Text color="blue900" fontWeight="semibold" fontSize="lg">
                        Price Per Month
                      </Text>
                      <Text color="blue900" fontWeight="semibold" fontSize="lg">
                        ₹{pricePerMonth}
                      </Text>
                    </Stack>
                  </Stack>
                  <Box paddingTop="4" className="w-[25%]">
                    <form noValidate key="raise_request">
                      <Stack gap="4" rounded="md" padding="6" borderWidth="1">
                        <Text fontWeight="semibold" fontSize="lg">
                          Owner Details
                        </Text>
                        <Inline gap="3" alignItems="center">
                          <Box>
                            <UserAvatar
                              uid={ownerInfo.uid}
                              name={ownerInfo.displayName || 'KU'}
                              fontSize="xl"
                              photoUrl={ownerInfo.photoURL || undefined}
                            />
                          </Box>
                          <Stack gap="1" className="max-w-[70%] w-full">
                            <Text fontWeight="semibold" className="break-words">
                              {ownerInfo.displayName}
                            </Text>
                            {ownerInfo.email ? (
                              <Text
                                color="gray500"
                                fontWeight="semibold"
                                fontSize="sm"
                                className="line-clamp-2 break-words"
                              >
                                {ownerInfo.email}
                              </Text>
                            ) : null}
                            {ownerInfo.phoneNumber ? (
                              <Text
                                color="gray500"
                                fontWeight="semibold"
                                fontSize="sm"
                                className="line-clamp-1"
                              >
                                {ownerInfo.phoneNumber}
                              </Text>
                            ) : null}
                          </Stack>
                        </Inline>
                        <Box
                          rounded="lg"
                          padding="4"
                          color={reviewStatusColorStyles.colors[request.status]}
                          backgroundColor={
                            reviewStatusColorStyles.backgroundColors[
                              request.status
                            ]
                          }
                        >
                          <Text fontSize="sm" fontWeight="semibold">
                            {renderTextForProductReview(request.status)}
                          </Text>
                        </Box>
                        {product.isUnderReview ? (
                          <Inline gap="2">
                            <RejectRequestInModal request={request}>
                              {({ reject }) => (
                                <Button status="error" onClick={reject}>
                                  <Box>
                                    <CancelIcon />
                                  </Box>
                                  Reject
                                </Button>
                              )}
                            </RejectRequestInModal>
                            <ApproveRequestInModal
                              request={request}
                              product={product}
                            >
                              {({ approve }) => (
                                <Button
                                  level="primary"
                                  status="success"
                                  onClick={approve}
                                >
                                  <Box>
                                    <CheckIcon />
                                  </Box>
                                  Approve
                                </Button>
                              )}
                            </ApproveRequestInModal>
                          </Inline>
                        ) : null}
                      </Stack>
                    </form>
                  </Box>
                </Inline>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
