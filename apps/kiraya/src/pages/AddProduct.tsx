import { useCreateProduct } from '@kiraya/data-store/products';
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
} from '@kiraya/kiraya-ui';
import { Form, Formik } from 'formik';
import React, { KeyboardEventHandler, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import * as Validator from 'yup';
import { categories } from '../Products/data';
import { AddImagesForProductInDialog } from '../Products/AddProduct';

const MAX_AMOUNT = 30000;
const availableDurations = [3, 6, 9, 12, 15];
const addProductValidationSchema = Validator.object().shape({
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
      <Stack maxWidth="full" gap="8" margin="6">
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
  const { create } = useCreateProduct();
  const [step, setStep] = useState<'listing' | 'images'>('listing');
  const [productId, setProductId] = useState<string>('');
  return (
    <Stack maxWidth="sm">
      {step === 'listing' ? (
        <Formik
          initialValues={{
            title: '' as string,
            tagInput: '' as string,
            description: '' as string,
            tags: [] as string[],
            category: {} as { id: string; label: string },
            duration: [] as number[],
            pricePerMonth: '' as string,
            files: [] as File[],
          }}
          validationSchema={addProductValidationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
            const { productId } = await create({
              title: values.title,
              tags: values.tags,
              description: values.description,
              category: values.category,
              duration: values.duration,
              pricePerMonth: Number(values.pricePerMonth),
            });
            if (productId) {
              setProductId(productId);
              setStep('images');
              toast.success('Saved your listing.');
            }
          })}
        >
          {({ status, values, isSubmitting, submitForm, setFieldValue }) => (
            <Form noValidate>
              <>
                <FormField
                  name="title"
                  label="Enter Title"
                  placeholder="Please enter title"
                />
                <FormField
                  name="description"
                  label="Enter Description"
                  placeholder="Please enter description here"
                />
                <FormField
                  name="category"
                  placeholder="Choose Category"
                  label={`Choose Category`}
                  renderInput={({ field, form }) => {
                    return (
                      <SearchSelect
                        searchPlaceholder="Choose Category"
                        control="input"
                        value={values.category}
                        options={categories}
                        onChange={(option) => {
                          setFieldValue('category', option);
                          setFieldValue('tags', [
                            ...values.tags,
                            option?.label,
                          ]);
                        }}
                      />
                    );
                  }}
                />
                <FormField
                  name="duration"
                  label="Choose Duration"
                  renderInput={() => (
                    <Inline gap="2" alignItems="center">
                      <Inline
                        borderWidth="1"
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
                                : undefined
                            }
                            onClick={() =>
                              setFieldValue(
                                'duration',
                                values.duration.includes(option)
                                  ? values.duration.filter(
                                      (time) => time !== option
                                    )
                                  : [...values.duration, option]
                              )
                            }
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
                  rawName="priceRaw"
                  label="Price (per month)"
                  secondaryLabel="required"
                  required
                  placeholder="eg. 890 or 100"
                />
                <Stack marginBottom="6">
                  <FormField
                    noMargin
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
                {status ? <Alert status="error">{status}</Alert> : null}
                <Inline gap="4" alignItems="center">
                  <Button size="lg" fullWidth disabled={isSubmitting}>
                    <GearIcon />
                    Calculate Rent
                  </Button>
                  <Button
                    size="lg"
                    level="primary"
                    type="button"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <SpinnerIcon />
                    ) : (
                      <>
                        <PlusIcon />
                        Add
                      </>
                    )}
                  </Button>
                </Inline>
              </>
            </Form>
          )}
        </Formik>
      ) : (
        <Box>
          <AddImagesForProductInDialog productId={productId}>
            {({ onOpen }) => (
              <Button onClick={onOpen}>
                <Box>
                  <CameraIcon />
                </Box>
                Upload Images
              </Button>
            )}
          </AddImagesForProductInDialog>
        </Box>
      )}
    </Stack>
  );
}
