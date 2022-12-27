import { useProduct } from '@kiraya/data-store/products';
import {
  Box,
  Button,
  DataLoadingFallback,
  Inline,
  LocationIcon,
  RaiseIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import ErrorBoundary from '../ErrorBoundary';

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

function ProductDashboard({ productId }: { productId: string }) {
  const { product } = useProduct(productId);
  const {
    title,
    duration,
    address,
    pricePerMonth,
    description,
    // ownerInfo,
    productMedia,
  } = product;
  const [activeImage, setActiveImage] = useState<{
    index: number;
    url: string;
  } | null>(productMedia?.length ? { index: 0, url: productMedia[0] } : null);

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
        <Inline gap="4">
          <Stack gap="6" width="1/2">
            <Box className="max-w-xl h-[464px] max-h-[464px]">
              <img
                src={activeImage?.url}
                className="w-full h-full object-cover rounded-xl"
                alt={`product_${title}`}
              />
            </Box>
            {productMedia?.length ? (
              <Inline
                as="ul"
                gap="6"
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
                    <img
                      src={media}
                      alt={`media_list_${index}`}
                      className="h-full w-full rounded-lg"
                    />
                  </Box>
                ))}
              </Inline>
            ) : null}
          </Stack>
          <Stack width="1/2" paddingTop="6" gap="4">
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
            <Inline borderWidth="1" maxWidth="sm">
              Helo
            </Inline>
            <Box maxWidth="lg">
              <Button
                level="primary"
                status="success"
                style={{ borderRadius: 100 }}
              >
                <Box>
                  <RaiseIcon />
                </Box>
                Raise a rent request
              </Button>
            </Box>
          </Stack>
        </Inline>
      </Stack>
    </Box>
  );
}
