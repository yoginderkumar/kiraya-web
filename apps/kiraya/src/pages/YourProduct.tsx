import { useProduct } from '@kiraya/data-store/products';
import { Box, Text, Stack, Inline, Button, Heading } from '@kiraya/kiraya-ui';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
// import ErrorBoundary from '../ErrorBoundary';
// import { ProductSlider } from '../Products/Products';

export default function YourProductPage() {
  const { productId } = useParams();
  if (!productId) return null;
  return (
    <SuspenseWithPerf
      fallback={'Loading your product'}
      traceId="loading_book_details"
    >
      <YourProduct key={productId} productId={productId} />
    </SuspenseWithPerf>
  );
}

export function YourProduct({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const { product } = useProduct(productId);
  console.log('Produc: ', product);
  return (
    <Stack width="full" gap="16" backgroundColor="white">
      <Stack maxWidth="full" gap="8" marginY="6">
        <Stack maxWidth="full" gap="2">
          <Box paddingX="6">
            <Box paddingY="4">
              <Heading fontSize="sm" fontWeight="medium" color="gray500">
                <Link to="/profile">Profile</Link> |{' '}
                <Link to="/profile/your-products">Your Products</Link> | Product
              </Heading>
            </Box>
            <Stack gap="6">
              <Text fontSize="lg" fontWeight="semibold">
                Your Product
              </Text>
              <Box>{/* <ProductSlider /> */}</Box>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
