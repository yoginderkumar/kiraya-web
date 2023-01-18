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
  formikOnSubmitWithErrorHandling,
  FormField,
  SearchSelect,
  FormAmountField,
  Circle,
  CancelIcon,
  PencilIcon,
  TrashIcon,
  ModalFooter,
  FormMediaFileField,
  DataLoadingFallback,
  SpinnerIcon,
  PreviewProductIcon,
  SaveIcon,
  PageMeta,
} from '@kiraya/kiraya-ui';
import { Form, Formik } from 'formik';
import React, { useMemo, useState } from 'react';
import * as Validator from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SuspenseWithPerf } from 'reactfire';
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
        fallback={<DataLoadingFallback label="Loading your product" />}
        traceId="loading_book_details"
      >
        <YourProduct key={productId} productId={productId} />
      </SuspenseWithPerf>
    </ErrorBoundary>
  );
}

const MAX_AMOUNT = 30000;
const MAX_FILE_SIZE = 5120; // 5MB
const availableDurations = [3, 6, 9, 12, 15];
const updateProductValidationSchema = Validator.object().shape({
  title: Validator.string()
    .required(`Please provide a name for your account`)
    .max(191, 'Name should be bellow 191 characters'),
  category: Validator.string().required(
    `Please choose a valid category for your product.`
  ),
  state: Validator.string().required(`Please choose a valid state.`),
  duration: Validator.array().min(
    1,
    'Please select any duration of your choice'
  ),
  files: Validator.array(
    Validator.mixed().test(
      'fileSize',
      'File is too large. Please add image with a file size of 5MB maximum',
      (value: File | null) => {
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
  ),
  pinCode: Validator.string().required(`Please enter a valid pin code.`),
  pricePerMonth: Validator.number()
    .required('Please enter the price per month')
    .positive('The amount should be a positive number')
    .max(
      MAX_AMOUNT,
      `Maximum amount limit (${MAX_AMOUNT}) reached. Please contact customer support for special requests.`
    ),
});

export function YourProduct({ productId }: { productId: string }) {
  const { product } = useProduct(productId);
  return (
    <>
      <PageMeta>
        <title>{product.title}</title>
      </PageMeta>
      <Stack width="full" gap="16" backgroundColor="white">
        <Stack maxWidth="full" gap="8" marginY="6">
          <Stack maxWidth="full" gap="2">
            <Box paddingX="6">
              <Heading fontSize="sm" fontWeight="medium" color="gray500">
                <Link to="/profile">Profile</Link> |{' '}
                <Link to="/profile/your-products">Your Products</Link> |{' '}
                {product.title}
              </Heading>
              <Stack gap="4" paddingY="4">
                <Text fontSize="lg" fontWeight="semibold">
                  Your Product
                </Text>
                <EditProductForm product={product} />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

function EditProductForm({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { progress, update } = useUpdateProduct(product.uid);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initialValues = useMemo(() => {
    return {
      title: product.title as string,
      tagInput: '' as string,
      description: product.description as string,
      tags: product.tags as string[],
      category: product.category.label as string,
      categoryObj: product.category as { id: string; label: string } | null,
      duration: product.duration as number[],
      pricePerMonth: product.pricePerMonth as number,
      files: [] as File[],
      imageUrls: product.productMedia as string[],
      state: product.address?.state.label as string,
      pinCode: product.address?.pinCode as string,
      stateObj: product.address?.state as { id: string; label: string } | null,
    };
  }, [product]);

  return (
    <Stack maxWidth="full" position="relative">
      <Formik
        initialValues={initialValues}
        validationSchema={updateProductValidationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={formikOnSubmitWithErrorHandling(async (values, actions) => {
          if (values.stateObj === null) {
            actions.setFieldError('state', 'Pick a valid state');
            return;
          }
          if (!values.imageUrls.length && !values.files.length) {
            actions.setFieldError('files', 'Please pick at least 1 image.');
            return;
          }
          const payload = {
            title: values.title,
            tags: values.tags,
            description: values.description,
            category: values.categoryObj || { id: 'some', label: 'test' },
            duration: values.duration,
            files: values.files,
            pricePerMonth: Number(values.pricePerMonth),
            address: {
              state: { ...values.stateObj },
              pinCode: values.pinCode,
            },
          };
          try {
            await update(payload);
            setIsEditing(false);
            toast.success('Your changes are saved successfully!');
          } catch (e) {
            toast.error('Something went wrong!');
            console.log(e);
          }
        })}
      >
        {({
          values,
          status,
          isSubmitting,
          resetForm,
          submitForm,
          setValues,
          setFieldValue,
        }) => (
          <Form noValidate>
            <Inline gap="4">
              <Stack className="w-2/3">
                <Inline width="full" gap="4">
                  <Box width="full">
                    <FormField
                      name="title"
                      label="Enter Title"
                      disabled={!isEditing}
                      placeholder="Please enter title"
                    />
                  </Box>
                  <Box width="full">
                    <FormField
                      name="description"
                      disabled={!isEditing}
                      label="Enter Description"
                      placeholder="Please enter description here"
                    />
                  </Box>
                </Inline>
                <FormField
                  name="category"
                  placeholder="Choose Category"
                  label={`Choose Category`}
                  disabled={!isEditing}
                  renderInput={({ field, form }) => {
                    return (
                      <SearchSelect
                        searchPlaceholder="Choose Category"
                        control="input"
                        readonly={!isEditing}
                        value={values.categoryObj}
                        options={categories}
                        onChange={(option) => {
                          setFieldValue('category', option?.label);
                          setFieldValue('categoryObj', option);
                          setFieldValue('tags', [
                            ...values.tags,
                            option?.label,
                          ]);
                          if (option === null) {
                            setFieldValue('category', '');
                          }
                        }}
                      />
                    );
                  }}
                />
                <Inline gap="4">
                  <Box width="full">
                    <FormField
                      name="state"
                      disabled={!isEditing}
                      placeholder="Choose Location"
                      label={`Location`}
                      renderInput={() => {
                        return (
                          <SearchSelect
                            searchPlaceholder="Choose Location"
                            control="input"
                            value={values.state}
                            options={states}
                            readonly={!isEditing}
                            onChange={(option) => {
                              setFieldValue('state', option?.label);
                              setFieldValue('stateObj', option);
                            }}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box width="full">
                    <FormField
                      name="pinCode"
                      label="Pin Code"
                      disabled={!isEditing}
                      placeholder="Please enter pin code"
                    />
                  </Box>
                </Inline>
                <FormField
                  name="duration"
                  label="Choose Duration"
                  disabled={!isEditing}
                  renderInput={() => (
                    <Inline gap="2">
                      <Inline
                        borderWidth="1"
                        rounded="md"
                        className="max-w-fit"
                        alignItems="center"
                        justifyContent="between"
                      >
                        {availableDurations.map((option, index) => (
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
                              if (!isEditing) {
                                return;
                              }
                              setFieldValue(
                                'duration',
                                values.duration.includes(option)
                                  ? values.duration.filter(
                                      (time) => time !== option
                                    )
                                  : [...values.duration, option]
                              );
                            }}
                          >
                            <Text
                              fontWeight="semibold"
                              color={
                                values.duration.includes(option)
                                  ? 'white'
                                  : undefined
                              }
                            >
                              {option}
                            </Text>
                          </Inline>
                        ))}
                      </Inline>
                      <Inline alignSelf="stretch" alignItems="end">
                        <Text fontSize="sm">Months</Text>
                      </Inline>
                    </Inline>
                  )}
                />
                <FormAmountField
                  name="pricePerMonth"
                  rawName="pricePerMonth"
                  label="Price (per month)"
                  secondaryLabel="required"
                  required
                  disabled={!isEditing}
                  placeholder="eg. 890 or 100"
                />
                <Stack marginBottom="6" paddingBottom="24">
                  <FormField
                    noMargin
                    name="tagInput"
                    tabIndex={0}
                    label="Choose Tags"
                    disabled={!isEditing}
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
                            setFieldValue(
                              'tags',
                              values.tags.filter(
                                (filterTag) => filterTag !== tag
                              )
                            );
                          }}
                        >
                          <CancelIcon size="3" color="white" />
                        </Circle>
                      </Inline>
                    ))}
                  </Inline>
                </Stack>
              </Stack>
              <Stack width="1/3">
                <FormMediaFileField
                  label="Choose Images"
                  name="files"
                  disabled={!isEditing}
                  imageFiles={values.files}
                  savedImages={values.imageUrls}
                  maxMediaFiles={4}
                  onRemove={(index) =>
                    setFieldValue(
                      'imageUrls',
                      values.imageUrls.filter((_, i) => i !== index)
                    )
                  }
                />
              </Stack>
            </Inline>
            <ModalFooter
              position="fixed"
              bottom="0"
              left="0"
              className="w-[100%]"
              backgroundColor="white"
              paddingY="6"
              paddingX="4"
            >
              {!isEditing ? (
                <>
                  <Button
                    level="primary"
                    onClick={() => setIsEditing(true)}
                    size="lg"
                    title="Edit Your Product"
                  >
                    <Box>
                      <PencilIcon />
                    </Box>
                    Update
                  </Button>
                  <Button
                    size="lg"
                    status="success"
                    title="Preview Your Product"
                    onClick={() => navigate(`/products/${product.uid}`)}
                  >
                    <Box>
                      <PreviewProductIcon />
                    </Box>
                    Preview Product
                  </Button>
                  <DeleteProductInModal
                    productId={product.uid}
                    onSuccess={() => navigate('/profile/your-products')}
                  >
                    {({ onOpen }) => (
                      <Button
                        size="lg"
                        status="error"
                        title="Cancel Editing"
                        onClick={onOpen}
                      >
                        <Box>
                          <TrashIcon />
                        </Box>
                        Delete
                      </Button>
                    )}
                  </DeleteProductInModal>
                </>
              ) : (
                <>
                  <Button
                    level="primary"
                    onClick={submitForm}
                    size="lg"
                    title="Save Changes"
                    disabled={
                      JSON.stringify(initialValues) ===
                        JSON.stringify(values) || isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <SpinnerIcon color="white" />
                        Saving... ({progress}
                        %)
                      </>
                    ) : (
                      <>
                        <Box>
                          <SaveIcon />
                        </Box>
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    title="Cancel Editing"
                    onClick={() => {
                      setIsEditing(false);
                      setValues({ ...initialValues });
                    }}
                  >
                    <Box>
                      <CancelIcon />
                    </Box>
                    Cancel
                  </Button>
                </>
              )}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
