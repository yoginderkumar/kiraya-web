import {
  ProductCategory,
  useProductsForCategories,
  useProductsForHomeUsers,
} from '@kiraya/data-store/products';
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
import { HomeBanner, HomeBannerBottom } from '../assets/images';
import { whyYouShouldRent } from '../constants/address';
import { categories } from '../Products/data';
import { CategoryCard, ProductCard } from '../Products/Products';

export default function Home() {
  const { popularProducts } = useProductsForHomeUsers();
  const { categorizedProducts } = useProductsForCategories('homeAppliances');

  const navigate = useNavigate();

  function onProductClick(prodId: string) {
    navigate(`/products/${prodId}`);
    return;
  }

  function onCategoryClick(category: ProductCategory) {
    navigate(`/search?category=${category.id}`);
    return;
  }

  return (
    <Box
      maxWidth="full"
      overflowX="hidden"
      minWidth="full"
      paddingX={{ md: '12', xs: '4' }}
      paddingY="4"
      backgroundColor="white"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        className="min-w-full w-full rounded-lg"
      >
        <img
          className="h-full overflow-hidden w-full rounded-lg"
          src={HomeBanner}
          alt="Home Banner"
        />
      </Box>
      <Stack gap="3" paddingY="6">
        <Inline justifyContent="between" alignItems="center">
          <Heading as="h3" fontSize="lg" fontWeight="semibold">
            Rent By Popular
          </Heading>
          <Button inline onClick={() => navigate(`/search?type=popular`)}>
            <Inline alignItems="center">
              <Text fontSize="base">See All</Text>
              <ArrowRightIcon />
            </Inline>
          </Button>
        </Inline>
        <Inline as="ul" alignItems="center" className="overflow-x-auto" gap="6">
          {popularProducts.length
            ? popularProducts.map((product) => (
                <ProductCard
                  product={product}
                  key={product.uid}
                  onProductClick={onProductClick}
                />
              ))
            : null}
        </Inline>
      </Stack>
      <Stack gap="3" paddingBottom="6">
        <Inline justifyContent="between" alignItems="center">
          <Heading as="h3" fontSize="lg" fontWeight="semibold">
            Rent By Category
          </Heading>
        </Inline>
        <Inline
          as="ul"
          alignItems="center"
          flexWrap="wrap"
          className="overflow-x-auto"
          gap="6"
        >
          {categories.map((category) => (
            <CategoryCard
              category={category}
              onCategoryClick={onCategoryClick}
            />
          ))}
        </Inline>
      </Stack>
      <Stack gap="3" paddingBottom="6">
        <Inline justifyContent="between" alignItems="center">
          <Heading as="h3" fontSize="lg" fontWeight="semibold">
            Rent By Home Appliances
          </Heading>
          <Button
            inline
            onClick={() => navigate(`/search?category=homeAppliances`)}
          >
            <Inline alignItems="center">
              <Text fontSize="base">See All</Text>
              <ArrowRightIcon />
            </Inline>
          </Button>
        </Inline>
        {categorizedProducts.length ? (
          <Inline
            as="ul"
            alignItems="center"
            className="overflow-x-auto"
            gap="6"
          >
            {categorizedProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.uid}
                onProductClick={onProductClick}
              />
            ))}
          </Inline>
        ) : null}
      </Stack>
      <Stack gap="3" paddingY="6">
        <Inline justifyContent="center" paddingBottom="3" alignItems="center">
          <Heading
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            className="text-center"
          >
            Why You Should Rent?
          </Heading>
        </Inline>
        {whyYouShouldRent.length ? (
          <Inline
            as="ul"
            justifyContent="between"
            alignItems="center"
            flexWrap="wrap"
            className="overflow-x-auto gap-y-4"
          >
            {whyYouShouldRent.map((reason) => (
              <Stack
                key={reason.id}
                textAlign="center"
                borderRadius="md"
                borderWidth="1"
                width="full"
                marginX="4"
                padding="6"
                gap="4"
                maxWidth="sm"
                justifyContent="center"
              >
                <Text fontSize="md" fontWeight="semibold">
                  {reason.title}
                </Text>
                <Text fontSize="sm" className="px-4">
                  {reason.text}
                </Text>
              </Stack>
            ))}
          </Inline>
        ) : null}
      </Stack>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        className="min-w-full w-full rounded-lg"
      >
        <img
          className="h-full overflow-hidden w-full rounded-lg"
          src={HomeBannerBottom}
          alt="Home Banner"
        />
      </Box>
    </Box>
  );
}
