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
import { useNavigate } from 'react-router-dom';
import { HomeBanner } from '../assets/images';
import { ProductCard, SkeletonProductCard } from '../Products/Products';

const categories = [
  'books',
  'musicalInstruments',
  'homeAppliances',
  'furniture',
  'decor',
  'storage',
];

export default function Home() {
  const { isLoading, popularProducts } = useProductsForHomeUsers();

  const navigate = useNavigate();

  function onProductClick(prodId: string) {
    navigate(`/products/${prodId}`);
    return;
  }

  return (
    <Box
      maxWidth="full"
      overflowX="hidden"
      minWidth="full"
      paddingX="12"
      paddingY="4"
      backgroundColor="white"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        className="min-h-[44%] h-[44%]"
      >
        <img className="h-full rounded-lg" src={HomeBanner} alt="Home Banner" />
      </Box>
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
                  className="min-w-[25%] max-w-xs hover:shadow-2xl hover:rounded-lg"
                  rounded="md"
                >
                  <ProductCard
                    product={product}
                    onProductClick={onProductClick}
                  />
                </Box>
              ))
            : null}
        </Inline>
      </Stack>
    </Box>
  );
}
