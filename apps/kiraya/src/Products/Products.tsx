import {
  Product,
  ProductCategory,
  useDeleteProduct,
} from '@kiraya/data-store/products';
import {
  Alert,
  Box,
  Button,
  FormField,
  formikOnSubmitWithErrorHandling,
  ImageSlider,
  Inline,
  LocationIcon,
  Modal,
  ModalBody,
  ModalFooter,
  SkeletonDescription,
  SkeletonImage,
  SkeletonTitle,
  Stack,
  Text,
  useOverlayTriggerState,
} from '@kiraya/kiraya-ui';
import React, { useState } from 'react';
import { Categories } from './data';
import { iconsForCategories } from './index';
import { Form, Formik } from 'formik';
import { useProfile } from '@kiraya/data-store/users';
import { toast } from 'react-hot-toast';
import { getColorForString } from 'generate-colors';

export function ProductCard({
  product,
  onProductClick,
}: {
  product: Product;
  onProductClick: (productId: string) => void;
}) {
  const {
    uid,
    title,
    category,
    productMedia,
    description,
    duration,
    address,
    pricePerMonth,
  } = product;
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  return (
    <Box
      borderWidth="1"
      rounded="md"
      cursor="pointer"
      onClick={() => onProductClick(uid)}
      className="w-[340px] min-w-[340px] hover:shadow-2xl hover:rounded-lg"
    >
      <Box className="w-full h-60" position="relative">
        {productMedia?.length ? (
          <>
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
            {imageLoading ? <SkeletonImage /> : null}
            <img
              src={productMedia[0]}
              alt={title}
              className={`${
                imageLoading ? 'hidden' : 'block'
              } w-full h-60 object-contain`}
              onLoad={() => setImageLoading(false)}
            />
          </>
        ) : (
          <Text>No Media Available</Text>
        )}
      </Box>
      <Stack width="full" padding="3" gap="2">
        {imageLoading ? (
          <SkeletonTitle />
        ) : (
          <Inline alignItems="center" gap="1">
            {iconsForCategories({
              id: category.id as Categories,
              size: '4',
              color: 'gray500',
            })}
            <Text fontSize="sm" color="gray500" fontWeight="semibold">
              {category.label}
            </Text>
          </Inline>
        )}

        <Box height="12">
          {imageLoading ? (
            <SkeletonTitle />
          ) : (
            <Text className="line-clamp-2" fontWeight="semibold">
              {title}
            </Text>
          )}
        </Box>
        <Box height="8">
          {imageLoading ? (
            <SkeletonDescription />
          ) : (
            <Text
              fontSize="sm"
              className="break-all line-clamp-2"
              color={description?.length ? undefined : 'gray500'}
            >
              {description || 'There is no description to this product.'}
            </Text>
          )}
        </Box>
        <Inline alignItems="center" justifyContent="between">
          <Stack gap="1">
            {imageLoading ? (
              <>
                <SkeletonTitle />
                <SkeletonDescription />
              </>
            ) : (
              <>
                <Text fontSize="base" fontWeight="semibold">
                  Available for?
                </Text>
                <Inline gap="1" alignItems="end">
                  <Text fontSize="base">
                    {Math.min(...duration) === Math.max(...duration)
                      ? Math.max(...duration)
                      : `${Math.min(...duration)} - ${Math.max(...duration)}`}
                  </Text>
                  <Text color="gray500" fontSize="sm" fontWeight="semibold">
                    Months
                  </Text>
                </Inline>
              </>
            )}
          </Stack>
          {address ? (
            <Stack gap="1" textAlign="right">
              {imageLoading ? null : (
                <>
                  <Box>
                    <LocationIcon size="5" color="red500" />
                  </Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {address.state.label}
                  </Text>
                </>
              )}
            </Stack>
          ) : null}
        </Inline>
        <Box borderTopWidth="1" paddingTop="3">
          <Inline alignItems="center" justifyContent="between">
            <Text fontWeight="semibold" fontSize="base" color="blue900">
              Price
            </Text>
            {imageLoading ? (
              <SkeletonTitle />
            ) : (
              <Text fontWeight="medium">₹ {pricePerMonth}/m</Text>
            )}
          </Inline>
        </Box>
      </Stack>
    </Box>
  );
}

export function CategoryCard({
  category,
  onCategoryClick,
}: {
  category: ProductCategory;
  onCategoryClick: (category: ProductCategory) => void;
}) {
  const { id, label } = category;
  const [r, g, b] = getColorForString(id);
  return (
    <Stack
      rounded="lg"
      cursor="pointer"
      alignItems="center"
      gap="4"
      justifyContent="center"
      className="w-44 h-44 hover:shadow-2xl hover:rounded-lg"
      padding="3"
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, .5)`,
      }}
      borderWidth="1"
      onClick={() => onCategoryClick(category)}
    >
      <Stack
        height="12"
        width="12"
        rounded="full"
        alignItems="center"
        justifyContent="center"
        style={{
          color: `rgb(${r}, ${g}, ${b})`,
          background: `white`,
        }}
      >
        {iconsForCategories({
          id: category.id as Categories,
          size: '6',
          color: 'blue900',
        })}
      </Stack>
      <Box textAlign="center" height="12">
        <Text fontWeight="semibold" color="white">
          {label}
        </Text>
      </Box>
    </Stack>
  );
}

export function SkeletonProductCard() {
  return (
    <div
      role="status"
      className="p-4 w-full max-w-xs rounded-lg border border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700"
    >
      <div className="flex justify-center items-center mb-4 h-44 bg-gray-300 rounded dark:bg-gray-700">
        <svg
          className="w-12 h-12 text-gray-200 dark:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 640 512"
        >
          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
        </svg>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700"></div>
      <div className="flex items-center my-4 space-x-3">
        <div>
          <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
          <div className="w-48 h-2 bg-gray-100 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>
      <hr />
      <div className="mt-4">
        <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
        <div className="w-48 h-2 bg-gray-100 rounded-full dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function ProductSlider({ images }: { images: string[] }) {
  return (
    <Box rounded="md" bgColor="red">
      <ImageSlider width="1/3" images={images} />;
    </Box>
  );
}

export function DeleteProductInModal({
  children,
  ...props
}: React.ComponentProps<typeof DeleteImageForm> & {
  children: (props: { onOpen: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({
        onOpen: () => {
          state.open();
        },
      })}
      <Modal
        isOpen={state.isOpen}
        onClose={state.close}
        title="Delete your product?"
        size="sm"
        isDismissable
      >
        <DeleteImageForm {...props} onClose={state.close} />
      </Modal>
    </>
  );
}

function DeleteImageForm({
  productId,
  onClose,
  onSuccess,
}: {
  productId: string;
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useProfile();
  const deleteProduct = useDeleteProduct(productId);
  return (
    <Formik
      initialValues={{
        email: '' as string,
      }}
      onSubmit={formikOnSubmitWithErrorHandling(async (values, actions) => {
        if (values.email !== user.email) {
          actions.setFieldError('email', 'Please enter a valid email address.');
          return;
        }
        await deleteProduct();
        toast.success('You have deleted a product successfully!');
        onSuccess?.();
      })}
    >
      {({ status, values, isSubmitting }) => (
        <Form noValidate>
          <ModalBody>
            <Stack gap="6">
              <Text>
                Please enter your email address in order to delete product from
                your account
              </Text>
              <FormField
                name="email"
                label="Enter Email"
                placeholder="Please enter email address"
              />
              {status ? (
                <Alert status="error" margin="0">
                  {status}
                </Alert>
              ) : null}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={Boolean(!values.email.length) || isSubmitting}
              type="submit"
              status="error"
              size="lg"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button disabled={isSubmitting} onClick={onClose} size="lg">
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}
