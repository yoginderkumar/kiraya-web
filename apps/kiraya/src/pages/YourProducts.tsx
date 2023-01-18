import { useProductsForOwner } from '@kiraya/data-store/products';
import {
  Box,
  Text,
  Stack,
  Inline,
  Button,
  Heading,
  getButtonClassName,
  PlusIcon,
  PageMeta,
} from '@kiraya/kiraya-ui';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../Products/Products';

export default function YourProducts() {
  const navigate = useNavigate();
  const { products } = useProductsForOwner();
  return (
    <>
      <PageMeta>
        <title>Your Products</title>
      </PageMeta>
      <Stack width="full" gap="4" backgroundColor="white">
        <Box
          as="header"
          paddingY="6"
          paddingX="8"
          borderBottomWidth="1"
          borderColor="gray100"
        >
          <Inline alignItems="center">
            <Stack flexGrow="1" gap="1">
              <Heading as="h2" fontSize="lg" fontWeight="semibold">
                Your Products{' '}
              </Heading>
              <Heading fontSize="sm" fontWeight="medium" color="gray500">
                <Link to="/profile">Profile</Link> | Your Products
              </Heading>
            </Stack>
            <Link
              to="add-product"
              className={getButtonClassName({ level: 'primary' })}
            >
              <Box>
                <PlusIcon />
              </Box>
              Add New
            </Link>
          </Inline>
        </Box>
        <Stack maxWidth="full" gap="8">
          <Stack maxWidth="full" gap="2">
            <Box paddingX="6">
              <Stack gap="6">
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
    </>
  );
}
