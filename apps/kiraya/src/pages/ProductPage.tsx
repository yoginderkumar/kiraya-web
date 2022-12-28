import { useProduct } from '@kiraya/data-store/products';
import { useProfile } from '@kiraya/data-store/users';
import {
  Alert,
  ApprovedIcon,
  Box,
  Button,
  Circle,
  DataLoadingFallback,
  formikOnSubmitWithErrorHandling,
  Inline,
  LocationIcon,
  PhoneIcon,
  RaiseIcon,
  SendIcon,
  SkeletonImage,
  SpinnerIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import { maskString } from '@kiraya/util-general';
import { useSendRentRequest } from '@kiraya/data-store/products';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';
import { UserAvatar } from '../Profile';
import { useFormik } from 'formik';

export default function ProductsPage() {
  const { productId } = useParams();
  if (!productId) return null;
  return (
    <ErrorBoundary>
      <SuspenseWithPerf
        fallback={<DataLoadingFallback label="Loading book details" />}
        traceId="loading_book_details"
      >
        <ProductDashboard key={productId} productId={productId} />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

function howDoesThisWorks(): Array<{
  id: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  title: string;
  subTitle: string;
}> {
  return [
    {
      id: 'send_request',
      icon: <SendIcon />,
      color: 'white',
      backgroundColor: '#D7A06E',
      title: 'Send Request',
      subTitle: ' You will send a "Rent Request" to the owner',
    },
    {
      id: 'approved_request',
      icon: <ApprovedIcon />,
      color: 'white',
      backgroundColor: '#21B15E',
      title: 'Get Approved',
      subTitle: 'Owner of the product will review your request and approve it.',
    },
    {
      id: 'contact_owner',
      icon: <PhoneIcon />,
      color: 'white',
      backgroundColor: '#137AC6',
      title: 'Contact Owner',
      subTitle:
        'You will be able to see owner details in your profile. Contact them as per your convenience',
    },
  ];
}

function ProductDashboard({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const sendRequest = useSendRentRequest();
  const { user } = useProfile();
  const { product } = useProduct(productId);
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

  const { isSubmitting, submitForm, status } = useFormik({
    initialValues: {},
    onSubmit: formikOnSubmitWithErrorHandling(async () => {
      await sendRequest({
        productId: productId,
        raisedBy: {
          uid: user.uid,
          name: user?.displayName || 'missing',
        },
      });
      toast.success(`You have sent a request to the owner successfully`);
    }),
  });

  function onSendRequestClick() {
    if (user === undefined) {
      toast.error('You need to login first!');
      navigate(`/login?from=products/${productId}`);
      return;
    }
    if (user.uid === product.ownerId) {
      toast.error('You cannot rent your own product!');
      return;
    }
    submitForm();
  }

  return (
    <Box
      maxWidth="full"
      overflowX="hidden"
      minWidth="full"
      paddingX="12"
      paddingY="10"
      backgroundColor="white"
    >
      <Stack gap="3" paddingBottom="6">
        <Inline gap="4" justifyContent="between">
          <Stack gap="6" className="w-[30%]">
            <Box
              rounded="md"
              backgroundColor="gray100"
              className="w-[425px] h-[420px] max-h-[420px]"
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
                className="w-[425px]"
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
                    onClick={() => setActiveImage({ index, url: media })}
                  >
                    {/* {loadingImage ?  : null} */}
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
          <Stack className="w-[40%]" paddingX="4" paddingTop="6" gap="4">
            <Text fontWeight="semibold" className="line-clamp-2" fontSize="3xl">
              {title}
            </Text>
            {description?.length ? (
              <Text className="pl-2">{description}</Text>
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
              <Text color="blue900" fontWeight="semibold" fontSize="md">
                Price Per Month
              </Text>
              <Text color="blue900" fontWeight="semibold">
                ₹{pricePerMonth}
              </Text>
            </Stack>
            <Stack gap="2" width="full">
              <Text fontWeight="semibold" fontSize="lg">
                How does this works?
              </Text>
              <Inline gap="2">
                {howDoesThisWorks().map((item) => (
                  <Stack
                    textAlign="center"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="blue50"
                    width="1/3"
                    gap="2"
                    rounded="lg"
                    paddingY="3"
                    paddingX="4"
                  >
                    <Circle
                      style={{
                        color: item.color,
                        background: item.backgroundColor,
                        borderRadius: 100,
                      }}
                    >
                      {item.icon}
                    </Circle>
                    <Stack gap="1">
                      <Text fontSize="sm" fontWeight="semibold">
                        {item.title}
                      </Text>
                      <Text
                        color="gray600"
                        fontSize="sm"
                        className="line-clamp-3"
                      >
                        {item.subTitle}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Inline>
            </Stack>
          </Stack>
          <Box paddingTop="6" className="w-[25%]">
            <form noValidate key="raise_request">
              <Stack gap="4" rounded="md" padding="6" borderWidth="1">
                <Text fontWeight="semibold" fontSize="lg">
                  Owner Details
                </Text>
                <Inline gap="3">
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
                        className="line-clamp-1"
                      >
                        {maskString(ownerInfo.email)}
                      </Text>
                    ) : null}
                    {ownerInfo.phoneNumber ? (
                      <Text
                        color="gray500"
                        fontWeight="semibold"
                        fontSize="sm"
                        className="line-clamp-1"
                      >
                        {maskString(ownerInfo.phoneNumber)}
                      </Text>
                    ) : null}
                  </Stack>
                </Inline>
                <Box maxWidth="lg">
                  <Button style={{ borderRadius: 100 }}>More from owner</Button>
                </Box>
                {status ? (
                  <Alert status="error" margin="0">
                    {status}
                  </Alert>
                ) : null}
                <Box maxWidth="lg">
                  <Button
                    level="primary"
                    status="success"
                    style={{ borderRadius: 100 }}
                    onClick={onSendRequestClick}
                  >
                    {isSubmitting ? (
                      <>
                        <Box>
                          <SpinnerIcon />
                        </Box>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Box>
                          <RaiseIcon />
                        </Box>
                        Send Rent Request
                      </>
                    )}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Inline>
      </Stack>
    </Box>
  );
}
