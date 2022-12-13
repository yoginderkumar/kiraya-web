import { Product } from '@kiraya/data-store/products';
import {
  Box,
  Button,
  Inline,
  LocationIcon,
  PencilIcon,
  Stack,
  Text,
  TrashIcon,
} from '@kiraya/kiraya-ui';
// import Slider from 'react-slick';
import React from 'react';
import { Categories } from './data';
import { iconsForCategories } from './index';

export function ProductCard({
  product,
  onProductClick,
}: {
  product: Product;
  onProductClick: (productId: string) => void;
}) {
  const { productMedia } = product;
  return (
    <Box
      className="w-1/4"
      cursor="pointer"
      onClick={() => onProductClick(product.uid)}
    >
      <Stack gap="2">
        {productMedia?.length ? (
          <Box className="w-full h-52 relative">
            {product.isUnderReview ? (
              <Box
                position="absolute"
                backgroundColor="yellow100"
                className="top-[16px]"
                right="0"
                roundedLeft="md"
                paddingX="3"
              >
                <Text color="yellow800" fontSize="sm" fontWeight="semibold">
                  Under Review
                </Text>
              </Box>
            ) : (
              <Box
                position="absolute"
                backgroundColor="green100"
                className="top-[16px]"
                right="0"
                roundedLeft="md"
                paddingX="3"
              >
                <Text color="green500" fontSize="sm" fontWeight="semibold">
                  Reviewed
                </Text>
              </Box>
            )}
            <img
              className="rounded-lg w-full h-52 object-cover"
              src={productMedia[0]}
              alt={product.title}
            />
          </Box>
        ) : null}
        <Stack gap="2">
          <Inline gap="2" alignItems="center">
            {iconsForCategories({
              id: product.category.id as Categories,
              size: '6',
              color: 'gray500',
            })}
            <Text fontSize="sm" color="gray500" fontWeight="semibold">
              {product.category.label}
            </Text>
          </Inline>
          <Stack gap="1">
            <Text fontSize="md" fontWeight="semibold">
              {product.title}
            </Text>
            {product.description?.length ? (
              <Text fontSize="sm">{product.description}</Text>
            ) : null}
          </Stack>
          <Inline alignItems="center" justifyContent="between">
            <Stack gap="1">
              <Text fontSize="base" fontWeight="semibold">
                Available for?
              </Text>
              <Inline gap="3" alignItems="center">
                {product.duration.map((period) => (
                  <Text fontSize="base" key={period}>
                    {period}
                  </Text>
                ))}
                <Text fontSize="base">Months</Text>
              </Inline>
            </Stack>
            <Stack gap="1" textAlign="right">
              <Box>
                <LocationIcon size="5" color="red500" />
              </Box>
              <Text fontSize="base">Delhi</Text>
            </Stack>
          </Inline>
          <Box className="h-[2px]" backgroundColor="gray100" />
          <Inline alignItems="center" justifyContent="between">
            <Text fontWeight="semibold" fontSize="base" color="blue900">
              Per Month
            </Text>
            <Text fontWeight="medium">₹ {product.pricePerMonth}</Text>
          </Inline>
        </Stack>
      </Stack>
    </Box>
  );
}

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };
// export function ProductSlider() {
//   return (
//     <Slider {...settings}>
//       <div>
//         <h3>1</h3>
//       </div>
//       <div>
//         <h3>2</h3>
//       </div>
//       <div>
//         <h3>3</h3>
//       </div>
//       <div>
//         <h3>4</h3>
//       </div>
//       <div>
//         <h3>5</h3>
//       </div>
//       <div>
//         <h3>6</h3>
//       </div>
//     </Slider>
//   );
// }
