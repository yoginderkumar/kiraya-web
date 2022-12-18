import { useProductsForOwner } from '@kiraya/data-store/products';
import { Box, Text, Stack, Inline, Button, Heading } from '@kiraya/kiraya-ui';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../Products/Products';

export default function YourProducts() {
  const navigate = useNavigate();
  const { products } = useProductsForOwner();
  console.log('Propd: ', products);
  return (
    <Stack width="full" gap="16" backgroundColor="white">
      <Stack maxWidth="full" gap="8" marginY="6">
        <Stack maxWidth="full" gap="2">
          <Box paddingX="6">
            <Box paddingY="4">
              <Heading fontSize="sm" fontWeight="medium" color="gray500">
                <Link to="/profile">Profile</Link> | Your Products
              </Heading>
            </Box>
            <Stack gap="6">
              <Text fontSize="lg" fontWeight="semibold">
                Your Products
              </Text>
              {products.length ? (
                <Inline gap="6" as="ul" flexWrap="wrap">
                  {products.map((product) => {
                    return (
                      <Box
                        key={product.uid}
                        as="li"
                        className="w-[30%] hover:shadow-2xl hover:rounded-lg"
                        rounded="md"
                      >
                        <ProductCard
                          product={product}
                          onProductClick={(prodId) => navigate(prodId)}
                        />
                      </Box>
                    );
                  })}
                </Inline>
              ) : (
                <Inline alignItems="center" gap="1">
                  <Text fontSize="md">You have no products to offer</Text>
                  <Button inline onClick={() => navigate('add-product')}>
                    Add Product
                  </Button>
                  <Text>. So, that anyone can rent it from you.</Text>
                </Inline>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
