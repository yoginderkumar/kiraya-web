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
import { HomeBanner } from '../assets/images';
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
      paddingX="12"
      paddingY="4"
      backgroundColor="white"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        className="max-h-[28%] h-[28%] rounded-lg min-w-full w-full"
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
          <Button inline>
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
        <Inline as="ul" alignItems="center" className="overflow-x-auto" gap="6">
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
          <Button inline>
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
    </Box>
  );
}
