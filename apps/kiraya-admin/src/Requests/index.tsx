import {
  Product,
  useUpdateProductWithVerification,
  Verification,
} from '@kiraya/data-store/products';
import {
  Alert,
  Box,
  Button,
  Circle,
  formikOnSubmitWithErrorHandling,
  Inline,
  Modal,
  ModalBody,
  ModalFooter,
  SpinnerIcon,
  Stack,
  Text,
  useOverlayTriggerState,
} from '@kiraya/kiraya-ui';
import { Form, Formik } from 'formik';
import React from 'react';
import { toast } from 'react-hot-toast';
import { SuspenseWithPerf } from 'reactfire';

export function ApproveRequestInModal({
  children,
  ...props
}: React.ComponentProps<typeof ApproveRequest> & {
  children: (props: { approve: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({ approve: state.open })}
      <Modal
        isOpen={state.isOpen}
        onClose={state.close}
        title="Approve Request?"
      >
        <SuspenseWithPerf
          fallback={
            <Box textAlign="center" paddingY="8">
              <SpinnerIcon />
            </Box>
          }
          traceId="loading_profile_to_update"
        >
          <ApproveRequest {...props} closeModal={state.close} />
        </SuspenseWithPerf>
      </Modal>
    </>
  );
}

function ApproveRequest({
  request,
  product,
  closeModal,
}: {
  product: Product;
  request: Verification;
  closeModal?: () => void;
}) {
  const { approveVerification } = useUpdateProductWithVerification(
    request.productId,
    request.uid
  );

  const { productMedia, title, description, pricePerMonth } = product;
  const productImage = productMedia?.length ? productMedia[0] : '';

  return (
    <Formik
      initialValues={{}}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await approveVerification();
        toast.success('You have approved their request successfully.');
        closeModal?.();
      })}
    >
      {({ values, status, isSubmitting, setFieldValue }) => (
        <Form noValidate>
          <ModalBody>
            <Stack gap="4">
              <Text fontSize="md">Request Raised For :</Text>
              <Stack gap="2">
                <Text fontSize="base">Product Details</Text>
                <Inline
                  gap="4"
                  backgroundColor="gray100"
                  rounded="md"
                  padding="2"
                >
                  <img src={productImage} alt={title} height={60} width={60} />
                  <Stack gap="1">
                    <Text className="line-clamp-1" fontSize="base">
                      {title}
                    </Text>
                    <Text className="line-clamp-1" fontSize="sm">
                      {description}
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      ₹ {pricePerMonth}/m
                    </Text>
                  </Stack>
                </Inline>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              status="success"
            >
              {isSubmitting ? <SpinnerIcon color="white" /> : 'Approve'}
            </Button>
            <Button size="lg" disabled={isSubmitting} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export function RejectRequestInModal({
  children,
  ...props
}: React.ComponentProps<typeof RejectRequest> & {
  children: (props: { reject: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({ reject: state.open })}
      <Modal isOpen={state.isOpen} onClose={state.close} title="Are you sure?">
        <SuspenseWithPerf
          fallback={
            <Box textAlign="center" paddingY="8">
              <SpinnerIcon />
            </Box>
          }
          traceId="loading_profile_to_update"
        >
          <RejectRequest onSuccess={state.close} {...props} />
        </SuspenseWithPerf>
      </Modal>
    </>
  );
}

const reasonsToReject = [
  {
    value: 'This product does not qualify our quality.',
    title: 'This product does not qualify our quality.',
  },
  {
    value: 'This product has been duplicated from some other user.',
    title: 'This product has been duplicated from some other user.',
  },
  {
    value: 'Pictures added for product are not clear/distorted',
    title: 'Pictures added for product are not clear/distorted',
  },
];
function RejectRequest({
  request,
  onSuccess,
}: {
  request: Verification;
  onSuccess?: () => void;
}) {
  const { rejectVerification } = useUpdateProductWithVerification(
    request.productId,
    request.uid
  );
  return (
    <Formik
      initialValues={{ reasonForRejection: reasonsToReject[0].value as string }}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await rejectVerification([values.reasonForRejection]);
        toast.success('You have rejected their request successfully.');
        onSuccess?.();
      })}
    >
      {({ values, status, isSubmitting, setFieldValue }) => (
        <Form noValidate>
          <ModalBody>
            <Text fontSize="base" fontWeight="semibold">
              Select an option
            </Text>
            <Text fontSize="sm" className="pt-1 pb-2">
              Select a valid reason to reject the request
            </Text>
            <Stack gap="3" as="ul">
              {reasonsToReject.map(({ value, title }) => {
                const isSelected = value === values.reasonForRejection;
                return (
                  <Inline
                    key={value}
                    alignItems="center"
                    gap="3"
                    borderWidth="1"
                    rounded="md"
                    padding="2"
                    cursor="pointer"
                    backgroundColor={isSelected ? 'blue100' : undefined}
                    onClick={() => setFieldValue('reasonForRejection', value)}
                  >
                    <Box>
                      <Circle
                        size="4"
                        backgroundColor="white"
                        borderColor={isSelected ? 'blue900' : 'gray400'}
                        borderWidth={isSelected ? '4' : '2'}
                      />
                    </Box>
                    <Stack>
                      <Text fontSize="base" fontWeight="medium">
                        {title}
                      </Text>
                    </Stack>
                  </Inline>
                );
              })}
            </Stack>
            {status ? <Alert status="error">{status}</Alert> : null}
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              disabled={isSubmitting}
              type="submit"
              level="primary"
              status="error"
            >
              {isSubmitting ? <SpinnerIcon color="white" /> : 'Reject'}
            </Button>
            <Button size="lg" disabled={isSubmitting} onClick={onSuccess}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export function renderTextForProductReview(
  status: 'pending' | 'rejected' | 'approved'
): string {
  switch (status) {
    case 'pending':
      return 'This product is under review by team Kiraya';
    case 'rejected':
      return 'This product has been rejected by team Kiraya';
    case 'approved':
      return 'This product is approved and verified by team Kiraya';
  }
}

type REVIEW_STATUS = 'pending' | 'rejected' | 'approved';
export const reviewStatusColorStyles: {
  colors: {
    [key in REVIEW_STATUS]: React.ComponentProps<typeof Box>['color'];
  };
  backgroundColors: {
    [key in REVIEW_STATUS]: React.ComponentProps<typeof Box>['backgroundColor'];
  };
} = {
  colors: {
    pending: 'yellow800',
    rejected: 'red900',
    approved: 'green900',
  },
  backgroundColors: {
    pending: 'yellow100',
    rejected: 'red100',
    approved: 'green100',
  },
};
