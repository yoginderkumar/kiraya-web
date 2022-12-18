import { useProductsForHomeUsers } from '@kiraya/data-store/products';
import {
  ArrowRightIcon,
  Box,
  Button,
  Heading,
  Inline,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import React from 'react';
import { ProductCard, SkeletonProductCard } from '../Products/Products';

export default function Home() {
  const { isLoading, popularProducts } = useProductsForHomeUsers();

  console.log('products:', popularProducts);

  return (
    <Box
      maxWidth="full"
      overflowX="hidden"
      minWidth="full"
      paddingX="12"
      paddingY="4"
      backgroundColor="white"
    >
      <Stack gap="3" paddingBottom="6">
        <Inline justifyContent="between" alignItems="center">
          <Heading as="h3" fontSize="lg" fontWeight="semibold">
            Popular
          </Heading>
          <Button inline>
            <Inline alignItems="center">
              <Text fontSize="base">See All</Text>
              <ArrowRightIcon />
            </Inline>
          </Button>
        </Inline>
        <Inline as="ul" alignItems="center" className="overflow-x-auto" gap="6">
          {isLoading
            ? [1, 2, 3].map((item) => (
                <Box
                  key={item}
                  as="li"
                  className="w-full max-w-xs hover:shadow-2xl hover:rounded-lg"
                  rounded="md"
                >
                  <SkeletonProductCard />
                </Box>
              ))
            : popularProducts.length
            ? popularProducts.map((product) => (
                <Box
                  key={product.uid}
                  as="li"
                  className="w-full max-w-xs hover:shadow-2xl hover:rounded-lg"
                  rounded="md"
                >
                  <ProductCard
                    product={product}
                    onProductClick={(prodId) => console.log(prodId)}
                  />
                </Box>
              ))
            : null}
        </Inline>
      </Stack>
    </Box>
  );
}
