import {
  ProductCategory,
  useCreateNewProduct,
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
  PlusIcon,
  GearIcon,
  CameraIcon,
  SpinnerIcon,
  Alert,
  CancelIcon,
  Circle,
  FormImageFileField,
  FormMediaFileField,
  ModalFooter,
  ResetIcon,
} from '@kiraya/kiraya-ui';
import { Form, Formik, useFormik } from 'formik';
import React, {
  KeyboardEventHandler,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import * as Validator from 'yup';
import { categories } from '../Products/data';
import { states } from '../constants/address';

const MAX_AMOUNT = 30000;
const MAX_FILE_SIZE = 5120; // 5MB
const availableDurations = [3, 6, 9, 12, 15];
const addProductValidationSchema = Validator.object().shape({
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
        console.log('Called?: ', value);
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
  ).min(1, 'Please pick at least 1 image'),
  pinCode: Validator.string().required(`Please enter a valid pin code.`),
  pricePerMonth: Validator.number()
    .required('Please enter the price per month')
    .positive('The amount should be a positive number')
    .max(
      MAX_AMOUNT,
      `Maximum amount limit (${MAX_AMOUNT}) reached. Please contact customer support for special requests.`
    ),
});

export default function AddProduct() {
  return (
    <Stack width="full" gap="16" backgroundColor="white">
      <Stack maxWidth="full" gap="8" marginY="6">
        <Stack maxWidth="full" gap="2">
          <Box paddingX="6">
            <Heading fontSize="sm" fontWeight="medium" color="gray500">
              <Link to="/profile">Profile</Link> |{' '}
              <Link to="/profile/your-products">Your Products</Link> | Add
              Product
            </Heading>
            <Stack gap="4" paddingY="4">
              <Text fontSize="lg" fontWeight="semibold">
                Add Product
              </Text>
              <AddProductForm />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function AddProductForm() {
  const { status, progress, createProductsWithImages } = useCreateNewProduct();
  const isLoading =
    status === 'progress' ||
    progress?.bytesTransferred !== progress?.totalBytes;

  const { values, isSubmitting, resetForm, submitForm, setFieldValue } =
    useFormik({
      initialValues: {
        title: '' as string,
        tagInput: '' as string,
        description: '' as string,
        tags: [] as string[],
        category: '' as string,
        categoryObj: null as { id: string; label: string } | null,
        duration: [] as number[],
        pricePerMonth: '' as string,
        files: [] as File[],
        state: '' as string,
        pinCode: '' as string,
        stateObj: null as { id: string; label: string } | null,
      },
      validationSchema: addProductValidationSchema,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: formikOnSubmitWithErrorHandling(async (values, actions) => {
        if (values.stateObj === null) {
          throw new Error('Pick a valid state');
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
        await createProductsWithImages({
          ...payload,
        });
      }),
    });

  useEffect(() => {
    if (status === 'completed') {
      resetForm();
      toast.success('Added your product successfully!');
    }
  }, [status, resetForm]);

  return (
    <Stack maxWidth="full" position="relative">
      <form noValidate key="add-product">
        <Inline gap="4">
          <Stack className="w-2/3">
            <Inline width="full" gap="4">
              <Box width="full">
                <FormField
                  name="title"
                  label="Enter Title"
                  placeholder="Please enter title"
                />
              </Box>
              <Box width="full">
                <FormField
                  name="description"
                  label="Enter Description"
                  placeholder="Please enter description here"
                />
              </Box>
            </Inline>
            <FormField
              name="category"
              placeholder="Choose Category"
              label={`Choose Category`}
              renderInput={({ field, form }) => {
                return (
                  <SearchSelect
                    searchPlaceholder="Choose Category"
                    control="input"
                    value={values.categoryObj}
                    options={categories}
                    onChange={(option) => {
                      setFieldValue('category', option?.label);
                      setFieldValue('categoryObj', option);
                      setFieldValue('tags', [...values.tags, option?.label]);
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
                  placeholder="Choose Location"
                  label={`Location`}
                  renderInput={({ field, form }) => {
                    return (
                      <SearchSelect
                        searchPlaceholder="Choose Location"
                        control="input"
                        value={values.state}
                        options={states}
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
                  placeholder="Please enter pin code"
                />
              </Box>
            </Inline>
            <FormField
              name="duration"
              label="Choose Duration"
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
              placeholder="eg. 890 or 100"
            />
            <Stack marginBottom="6" paddingBottom="24">
              <FormField
                noMargin
                name="tagInput"
                tabIndex={0}
                label="Choose Tags"
                placeholder="Enter your tags"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFieldValue('tagInput', '');
                    setFieldValue('tags', [...values.tags, values.tagInput]);
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
                          values.tags.filter((filterTag) => filterTag !== tag)
                        );
                      }}
                    >
                      <CancelIcon size="3" color="white" />
                    </Circle>
                  </Inline>
                ))}
              </Inline>
            </Stack>
            {status ? <Alert status="error">{status}</Alert> : null}
          </Stack>
          <Stack>
            <FormMediaFileField
              label="Choose Images"
              name="files"
              imageFiles={values.files}
              maxMediaFiles={4}
            />
          </Stack>
        </Inline>

        <ModalFooter
          position="sticky"
          bottom="0"
          width="full"
          backgroundColor="white"
          // paddingY="6"
          paddingX="4"
        >
          <Button
            level="primary"
            onClick={submitForm}
            size="lg"
            disabled={isLoading || isSubmitting}
          >
            {(isLoading || isSubmitting) && progress !== null ? (
              <>
                <SpinnerIcon color="white" />
                Submitting... (
                {Math.round(
                  (progress.bytesTransferred / progress.totalBytes) * 100
                )}
                %)
              </>
            ) : (
              'Submit'
            )}
          </Button>
          <Box position="relative">
            <Button size="lg" disabled>
              <Box
                backgroundColor="green900"
                className="bottom-[75%] right-0"
                paddingX="3"
                opacity="100"
                paddingY="1"
                rounded="md"
                position="absolute"
              >
                <Text fontSize="sm" color="white">
                  Coming Soon
                </Text>
              </Box>
              <GearIcon />
              Calculate Rent
            </Button>
          </Box>
          <Button size="lg" status="error" onClick={() => resetForm()}>
            <Box>
              <ResetIcon />
            </Box>
            Reset Form
          </Button>
        </ModalFooter>
      </form>
    </Stack>
  );
}
