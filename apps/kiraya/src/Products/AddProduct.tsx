import {
  Alert,
  Box,
  Button,
  ButtonLink,
  CheckCircleSolidIcon,
  formikOnSubmitWithErrorHandling,
  FormImageFileField,
  Inline,
  Modal,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import * as Validator from 'yup';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { readFileAsDataURL } from 'libs/kiraya-ui/src/lib/util';
import {
  useProductImages,
  useUpdateProduct,
} from '@kiraya/data-store/products';
import { useProfile } from '@kiraya/data-store/users';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function AddImagesForProductInDialog({
  children,
  ...props
}: React.ComponentProps<typeof UploadImagesForm> & {
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
        title="Upload Images"
        size="sm"
        isDismissable={false}
      >
        <UploadImagesForm {...props} />
      </Modal>
    </>
  );
}

const MAX_FILE_SIZE = 5120; // 5MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
export const validateImageType = (value: string) => {
  if (value) {
    return SUPPORTED_FORMATS.includes(value);
  }
};

const imagesValidationSchema = Validator.object().shape({
  image_one: Validator.mixed()
    .test(
      'fileSize',
      'File is too large. Please add image with a file size of 5MB maximum',
      (value: File | null) => {
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
    .test(
      'fileType',
      'We support only JPG, JPEG and PNG formats. Please add image in listed format',
      (value: File | null) => {
        if (value && !validateImageType(value.type)) {
          return false;
        }
        return true;
      }
    )
    .required('Add at lease 1 image to proceed with your product'),
  image_two: Validator.mixed()
    .test(
      'fileSize',
      'File is too large. Please add image with a file size of 5MB maximum',
      (value: File | null) => {
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
    .test(
      'fileType',
      'We support only JPG, JPEG and PNG formats. Please add image in listed format',
      (value: File | null) => {
        if (value && !validateImageType(value.type)) {
          return false;
        }
        return true;
      }
    ),
  image_three: Validator.mixed()
    .test(
      'fileSize',
      'File is too large. Please add image with a file size of 5MB maximum',
      (value: File | null) => {
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
    .test(
      'fileType',
      'We support only JPG, JPEG and PNG formats. Please add image in listed format',
      (value: File | null) => {
        if (value && !validateImageType(value.type)) {
          return false;
        }
        return true;
      }
    ),
  image_four: Validator.mixed()
    .test(
      'fileSize',
      'File is too large. Please add image with a file size of 5MB maximum',
      (value: File | null) => {
        if (value && value.size / 1024 > MAX_FILE_SIZE) {
          return false;
        }
        return true;
      }
    )
    .test(
      'fileType',
      'We support only JPG, JPEG and PNG formats. Please add image in listed format',
      (value: File | null) => {
        if (value && !validateImageType(value.type)) {
          return false;
        }
        return true;
      }
    ),
});
function UploadImagesForm({
  files,
  productId,
  onSuccess,
}: {
  files?: File[];
  productId: string;
  onSuccess?: () => void;
}) {
  const { user } = useProfile();
  const { updateProductMedia } = useUpdateProduct(productId);
  const { addProductImage } = useProductImages(user.uid, productId);

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  return showSuccess ? (
    <>
      <ModalBody>
        <Stack gap="4" alignItems="center" justifyContent="center">
          <Box>
            <CheckCircleSolidIcon color="green500" size="18" />
          </Box>
          <Stack gap="2" textAlign="center">
            <Text fontSize="xl" fontWeight="semibold">
              You have successfully added your product.
            </Text>
            <Text fontSize="md">
              Your product is under review by our moderators. You can check
              status of your products{' '}
              <Link to="/profile/your-products">
                <Text as="span" color="blue900" fontWeight="semibold">
                  here.
                </Text>
              </Link>{' '}
              It can take upto 12-24 hrs.
            </Text>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button size="lg" level="primary">
          Your Products
        </Button>
      </ModalFooter>
    </>
  ) : (
    <Formik
      initialValues={{
        image_one: null as File | null,
        image_two: null as File | null,
        image_three: null as File | null,
        image_four: null as File | null,
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={imagesValidationSchema}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        try {
          const fileOne = values.image_one as File;
          const fileTwo = values.image_two as File;
          const fileThree = values.image_three as File;
          const fileFour = values.image_four as File;
          const files: string[] = [];
          if (fileOne !== null) {
            const { url } = await addProductImage(fileOne);
            files.push(url as string);
          }
          if (fileTwo !== null) {
            const { url } = await addProductImage(fileTwo);
            files.push(url as string);
          }
          if (fileThree !== null) {
            const { url } = await addProductImage(fileThree);
            files.push(url as string);
          }
          if (fileFour !== null) {
            const { url } = await addProductImage(fileFour);
            files.push(url as string);
          }
          await updateProductMedia(files);
          toast.success('Your product is added successfully.');
          setShowSuccess(true);
        } catch (e) {
          const err = e as Error;
          throw new Error(err.message);
        }
      })}
    >
      {({ status, isSubmitting, setFieldValue }) => (
        <Form noValidate>
          <>
            <ModalBody>
              <FormImageFileField
                name="image_one"
                type="file"
                label="+1"
                placeholder="Attach image"
                accept="image/png,image/jpeg,image/jpg"
                onRemove={() => {
                  setFieldValue('image_one', null);
                }}
              />
              <FormImageFileField
                name="image_two"
                type="file"
                label="+2"
                placeholder="Attach image"
                accept="image/png,image/jpeg,image/jpg"
                onRemove={() => {
                  setFieldValue('image_two', null);
                }}
              />
              <FormImageFileField
                name="image_three"
                type="file"
                label="+3"
                placeholder="Attach image"
                accept="image/png,image/jpeg,image/jpg"
                onRemove={() => {
                  setFieldValue('image_three', null);
                }}
              />
              <FormImageFileField
                name="image_four"
                type="file"
                label="+4"
                placeholder="Attach image"
                accept="image/png,image/jpeg,image/jpg"
                onRemove={() => {
                  setFieldValue('image_four', null);
                }}
              />
              {status ? <Alert status="error">{status}</Alert> : null}
            </ModalBody>
            <ModalFooter>
              <Button disabled={isSubmitting} size="lg" type="submit">
                {isSubmitting ? 'Saving...' : 'Done'}
              </Button>
              <Button disabled={isSubmitting} size="lg">
                Cancel
              </Button>
            </ModalFooter>
          </>
        </Form>
      )}
    </Formik>
  );
}
