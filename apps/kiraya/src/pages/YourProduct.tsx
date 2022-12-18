import {
  Product,
  useProduct,
  useUpdateProduct,
} from '@kiraya/data-store/products';
import {
  Box,
  Text,
  Stack,
  Inline,
  Button,
  Heading,
  Image,
  formikOnSubmitWithErrorHandling,
  FormField,
  SearchSelect,
  FormAmountField,
  Circle,
  CancelIcon,
  PencilIcon,
  TrashIcon,
  LocationIcon,
  ModalFooter,
  Alert,
} from '@kiraya/kiraya-ui';
import { pluralize } from '@kiraya/util-general';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import * as Validator from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
import config from '../config';
import { states } from '../constants/address';
import ErrorBoundary from '../ErrorBoundary';
import { categories } from '../Products/data';
import { DeleteProductInModal } from '../Products/Products';
import { toast } from 'react-hot-toast';

export default function YourProductPage() {
  const { productId } = useParams();
  if (!productId) return null;
  return (
    <ErrorBoundary>
      <SuspenseWithPerf
        fallback={'Loading your product'}
        traceId="loading_book_details"
      >
        <YourProduct key={productId} productId={productId} />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

const MAX_AMOUNT = 30000;
const availableDurations = [3, 6, 9, 12, 15];

const updateProductValidationSchema = Validator.object().shape({
  title: Validator.string()
    .required(`Please provide a name for your account`)
    .max(191, 'Name should be bellow 191 characters'),
  category: Validator.object()
    .shape({
      id: Validator.string(),
    })
    .required('Please add a category'),
  duration: Validator.array().min(
    1,
    'Please select any duration of your choice'
  ),
  state: Validator.object()
    .shape({
      id: Validator.string(),
    })
    .required('Please select a state'),
  pinCode: Validator.string()
    .required(`Please provide a pin code for this product`)
    .length(6, 'Please enter a valid Pincode.'),
  pricePerMonth: Validator.number()
    .required('Please enter the price per month')
    .positive('The amount should be a positive number')
    .max(
      MAX_AMOUNT,
      `Maximum amount limit (${MAX_AMOUNT}) reached. Please contact customer support for special requests.`
    ),
});

export function YourProduct({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const { product } = useProduct(productId);
  const { updateProductData } = useUpdateProduct(product.uid);
  const initialValues = useMemo(() => {
    console.log('Produc: ', product.duration);
    return {
      tagInput: '' as string,
      title: product.title as string,
      tags: product.tags as string[],
      pricePerMonth: product.pricePerMonth as number,
      description: product.description as string,
      duration: product.duration as number[],
      category: product.category as { id: string; label: string },
      state: product.address?.state as { id: string; label: string },
      pinCode: product.address?.pinCode as string,
    };
  }, [product]);

  console.log('Ibni: ', initialValues.duration);
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
              <Formik
                initialValues={{
                  isEditEnabled: false as boolean,
                  ...initialValues,
                }}
                validationSchema={updateProductValidationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={formikOnSubmitWithErrorHandling(
                  async (values, actions) => {
                    await updateProductData({
                      title: values.title,
                      tags: values.tags,
                      pricePerMonth: values.pricePerMonth,
                      description: values.description,
                      duration: values.duration,
                      category: values.category,
                      address: { state: values.state, pinCode: values.pinCode },
                    });
                    toast.success('You have updated the product successfully!');
                    actions.setValues({ ...values, ...initialValues });
                    actions.setFieldValue('isEditEnabled', false);
                  }
                )}
              >
                {({
                  status,
                  values,
                  isSubmitting,
                  setValues,
                  setFieldValue,
                }) => (
                  <Form noValidate>
                    <Stack>
                      <Inline gap="6" justifyContent="between">
                        <Stack width="1/2" gap="1" paddingY="2">
                          <Inline alignItems="center" gap="4" width="full">
                            <Box width="full">
                              <FormField
                                readOnly={!values.isEditEnabled}
                                name="title"
                                label="Title"
                                placeholder="Please enter title"
                              />
                            </Box>
                            <Box width="full">
                              <FormField
                                readOnly={!values.isEditEnabled}
                                name="description"
                                label="Description"
                                placeholder="Please enter description here"
                              />
                            </Box>
                          </Inline>
                          <FormField
                            readOnly={!values.isEditEnabled}
                            name="category"
                            placeholder="Choose Category"
                            label={`Category`}
                            renderInput={({ field, form }) => {
                              return (
                                <SearchSelect
                                  searchPlaceholder="Choose Category"
                                  control="input"
                                  readonly={Boolean(!values.isEditEnabled)}
                                  value={values.category}
                                  options={categories}
                                  onChange={(option) => {
                                    setFieldValue('category', option);
                                  }}
                                />
                              );
                            }}
                          />
                          <Inline gap="4">
                            <FormField
                              readOnly={!values.isEditEnabled}
                              name="state"
                              placeholder="Choose Location"
                              label={`Location`}
                              renderInput={() => {
                                return (
                                  <SearchSelect
                                    searchPlaceholder="Choose Location"
                                    control="input"
                                    readonly={Boolean(!values.isEditEnabled)}
                                    value={values.state}
                                    options={states}
                                    onChange={(option) => {
                                      setFieldValue('state', option);
                                    }}
                                  />
                                );
                              }}
                            />
                            <Box width="full">
                              <FormField
                                readOnly={!values.isEditEnabled}
                                name="pinCode"
                                label="Pin Code"
                                placeholder="Please enter pin code"
                              />
                            </Box>
                          </Inline>
                          <FormAmountField
                            name="pricePerMonth"
                            rawName="pricePerMonth"
                            label="Price (per month)"
                            secondaryLabel="required"
                            readOnly={!values.isEditEnabled}
                            value={product.pricePerMonth}
                            placeholder="eg. 890 or 100"
                          />
                          <Stack marginBottom="6">
                            <FormField
                              noMargin
                              readOnly={!values.isEditEnabled}
                              name="tagInput"
                              tabIndex={0}
                              label="Choose Tags"
                              placeholder="Enter your tags"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setFieldValue('tagInput', '');
                                  setFieldValue('tags', [
                                    ...values.tags,
                                    values.tagInput,
                                  ]);
                                }
                                e.stopPropagation();
                              }}
                            />
                            <Inline gap="2" flexWrap="wrap" marginTop="3">
                              {values.tags.map((tag) => (
                                <Inline
                                  key={tag}
                                  paddingX="3"
                                  paddingY="1"
                                  rounded="md"
                                  gap="2"
                                  alignItems="center"
                                  backgroundColor="gray100"
                                >
                                  <Text fontWeight="medium" fontSize="sm">
                                    {tag}
                                  </Text>
                                  <Circle
                                    size="4"
                                    cursor="pointer"
                                    backgroundColor="gray500"
                                    onClick={() => {
                                      if (values.isEditEnabled) {
                                        setFieldValue(
                                          'tags',
                                          values.tags.filter(
                                            (filterTag) => filterTag !== tag
                                          )
                                        );
                                      }
                                    }}
                                  >
                                    <CancelIcon size="3" color="white" />
                                  </Circle>
                                </Inline>
                              ))}
                            </Inline>
                          </Stack>
                        </Stack>
                        <Stack gap="6" className="w-1/3" paddingBottom="12">
                          {product.productMedia?.length ? (
                            <Stack gap="3">
                              <Inline flexWrap="wrap" gap="4">
                                {product.productMedia.map((image) => (
                                  <Box key={image} className="w-[45%]">
                                    <Image
                                      rounded="md"
                                      imageLabel={product.title}
                                      thumbUrl={image}
                                      imageUrl={image}
                                    />
                                  </Box>
                                ))}
                              </Inline>
                              <Box paddingY="3">
                                <FormField
                                  noMargin
                                  name="duration"
                                  readOnly={!values.isEditEnabled}
                                  label="Duration"
                                  renderInput={() => (
                                    <Inline gap="2">
                                      <Inline
                                        borderWidth="1"
                                        rounded="md"
                                        className="max-w-fit"
                                        alignItems="center"
                                        justifyContent="between"
                                      >
                                        {availableDurations.map(
                                          (option, index) => (
                                            <Inline
                                              key={option}
                                              paddingY="1"
                                              width="10"
                                              height="10"
                                              rounded="md"
                                              justifyContent="center"
                                              alignItems="center"
                                              textAlign="center"
                                              cursor="pointer"
                                              borderRightWidth="1"
                                              borderColor="white"
                                              backgroundColor={
                                                values.duration.includes(option)
                                                  ? index % 2 === 0
                                                    ? 'green500'
                                                    : 'blue900'
                                                  : 'transparent'
                                              }
                                              onClick={() => {
                                                if (values.isEditEnabled) {
                                                  setFieldValue(
                                                    'duration',
                                                    values.duration.includes(
                                                      option
                                                    )
                                                      ? values.duration.filter(
                                                          (time) =>
                                                            time !== option
                                                        )
                                                      : [
                                                          ...values.duration,
                                                          option,
                                                        ]
                                                  );
                                                }
                                              }}
                                            >
                                              <Text
                                                fontWeight="semibold"
                                                color={
                                                  values.duration.includes(
                                                    option
                                                  )
                                                    ? 'white'
                                                    : undefined
                                                }
                                              >
                                                {option}
                                              </Text>
                                            </Inline>
                                          )
                                        )}
                                      </Inline>
                                      <Inline
                                        alignSelf="stretch"
                                        alignItems="end"
                                      >
                                        <Text fontSize="sm">Months</Text>
                                      </Inline>
                                    </Inline>
                                  )}
                                />
                              </Box>
                            </Stack>
                          ) : null}
                          {product.isUnderReview ? (
                            <Box
                              paddingY="1"
                              paddingX="2"
                              rounded="md"
                              backgroundColor="yellow100"
                              color="yellow800"
                            >
                              <Text fontSize="sm">
                                Your product is under review by the team at{' '}
                                <Text as="span" fontWeight="semibold">
                                  {config.appTitle}.{' '}
                                </Text>
                                Check our review process{' '}
                                <Text
                                  as="span"
                                  fontWeight="semibold"
                                  color="blue900"
                                >
                                  Here
                                </Text>
                              </Text>
                            </Box>
                          ) : (
                            <Box
                              paddingY="1"
                              paddingX="2"
                              rounded="md"
                              backgroundColor="green100"
                              color="green900"
                            >
                              <Text fontSize="sm">
                                Your product is reviewed by the team at{' '}
                                <Text as="span" fontWeight="semibold">
                                  {config.appTitle}.{' '}
                                </Text>
                                Editing this product will put this under review
                                again. Check our review process{' '}
                                <Text
                                  as="span"
                                  fontWeight="semibold"
                                  color="blue900"
                                >
                                  Here
                                </Text>
                              </Text>
                            </Box>
                          )}
                          {status ? (
                            <Alert status="error" marginBottom="0">
                              {status}
                            </Alert>
                          ) : null}
                          {values.isEditEnabled ? (
                            <Box as="hr" bgColor="gray500" width="full" />
                          ) : null}
                          {values.isEditEnabled ? (
                            <Inline gap="4" width="full" justifyContent="end">
                              <Button
                                size="lg"
                                disabled={isSubmitting}
                                onClick={() => {
                                  setValues({ ...values, ...initialValues });
                                  setFieldValue('isEditEnabled', false);
                                }}
                              >
                                <Box>
                                  <CancelIcon />
                                </Box>
                                Cancel
                              </Button>
                              <Button
                                disabled={isSubmitting}
                                size="lg"
                                type="submit"
                              >
                                {isSubmitting ? 'Saving...' : 'Save'}
                              </Button>
                            </Inline>
                          ) : (
                            <Inline gap="4">
                              <Button
                                fullWidth
                                onClick={() => {
                                  setFieldValue('isEditEnabled', true);
                                }}
                                size="lg"
                                disabled={values.isEditEnabled}
                              >
                                <PencilIcon />
                                Edit
                              </Button>
                              <DeleteProductInModal
                                productId={product.uid}
                                onSuccess={() => {
                                  navigate('/profile/your-products/');
                                }}
                              >
                                {({ onOpen }) => (
                                  <Button
                                    size="lg"
                                    onClick={onOpen}
                                    fullWidth
                                    status="error"
                                  >
                                    <Box>
                                      <TrashIcon />
                                    </Box>
                                    Delete
                                  </Button>
                                )}
                              </DeleteProductInModal>
                            </Inline>
                          )}
                        </Stack>
                      </Inline>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
