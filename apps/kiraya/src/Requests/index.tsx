import {
  RentRequest,
  useApproveRequest,
  useCancelRequest,
  useProduct,
  useRejectRequest,
} from '@kiraya/data-store/products';
import { TUser, useGetUser } from '@kiraya/data-store/users';
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
  Time,
  Text,
  useOverlayTriggerState,
} from '@kiraya/kiraya-ui';
import { maskString } from '@kiraya/util-general';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SuspenseWithPerf } from 'reactfire';
import { UserAvatar } from '../Profile';

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
  closeModal,
}: {
  request: RentRequest;
  closeModal?: () => void;
}) {
  const { product } = useProduct(request.productId);
  const approveRequest = useApproveRequest(request.uid);
  const [raisedBy, setRaisedBy] = useState<
    | { name: string; phone: string; email: string; photoUrl?: string }
    | undefined
  >(undefined);

  const { title, description, pricePerMonth, productMedia } = product;
  const productImage = productMedia?.length ? productMedia[0] : '';
  const getUser = useGetUser(request.raisedBy.uid);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchUserDetails = useCallback(async () => {
    const user = await getUser();
    setRaisedBy({
      name: user?.displayName || '',
      phone: user?.phoneNumber || '',
      email: user?.email || '',
      photoUrl: user?.photoURL ? user.photoURL : undefined,
    });
  }, [getUser]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  async function approveThisRequest() {
    try {
      setIsSubmitting(true);
      await approveRequest();
      setIsSubmitting(false);
      toast.success('You have approved their request successfully.');
      closeModal?.();
    } catch (e) {
      const err = e as Error;
      setIsSubmitting(false);
      toast.error(err.message);
    }
  }

  return (
    <Box>
      {!raisedBy || !product ? (
        <Inline
          paddingY="24"
          alignItems="center"
          justifyContent="center"
          width="full"
        >
          <SpinnerIcon />
        </Inline>
      ) : (
        <>
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
              <Stack gap="2">
                <Text fontSize="base">Raised By :-</Text>
                <Inline
                  gap="4"
                  backgroundColor="gray100"
                  rounded="md"
                  padding="2"
                >
                  {raisedBy?.name || raisedBy?.photoUrl ? (
                    <Box alignSelf="center">
                      <UserAvatar
                        size="12"
                        name={raisedBy.name}
                        photoUrl={raisedBy.photoUrl}
                      />
                    </Box>
                  ) : null}
                  <Stack gap="1">
                    <Text className="line-clamp-1" fontSize="base">
                      {raisedBy?.name}
                    </Text>
                    <Text className="line-clamp-1" fontSize="sm">
                      {maskString(raisedBy?.email || '')}
                    </Text>
                    <Text className="line-clamp-1" fontSize="sm">
                      {maskString(raisedBy?.phone || '')}
                    </Text>
                  </Stack>
                </Inline>
              </Stack>
              <Stack gap="2">
                <Text fontSize="base">Request Details:-</Text>
                <Stack gap="1">
                  <Text className="line-clamp-1" fontSize="sm">
                    Request Raised On :-{' '}
                    <Time date={request.creationAt.toDate()} />
                  </Text>
                  <Text className="line-clamp-1" fontSize="sm">
                    Request Approved On :-{' '}
                    <Time date={request.updatedAt.toDate()} />
                  </Text>
                </Stack>
              </Stack>
              <Inline backgroundColor="green100" rounded="md" padding="2">
                <Text fontSize="sm" fontWeight="semibold">
                  You will be able to see user's details once you approve their
                  request.
                </Text>
              </Inline>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={approveThisRequest}
              size="lg"
              status="success"
            >
              {isSubmitting ? <SpinnerIcon color="white" /> : 'Approve'}
            </Button>
            <Button size="lg" disabled={isSubmitting} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      )}
    </Box>
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
    value: 'This product is not available anymore.',
    title: 'This product is not available anymore.',
  },
  {
    value: 'This product has been alloted to some other user.',
    title: 'This product has been alloted to some other user.',
  },
];
function RejectRequest({
  request,
  onSuccess,
}: {
  request: RentRequest;
  onSuccess?: () => void;
}) {
  const reject = useRejectRequest(request.uid);
  return (
    <Formik
      initialValues={{ reasonForRejection: reasonsToReject[0].value as string }}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await reject({ reasons: values.reasonForRejection });
        toast.success('You have rejected their request successfully.');
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

export function CancelRequestInModal({
  children,
  ...props
}: React.ComponentProps<typeof CancelRequest> & {
  children: (props: { cancel: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({ cancel: state.open })}
      <Modal isOpen={state.isOpen} onClose={state.close} title="Are you sure?">
        <SuspenseWithPerf
          fallback={
            <Box textAlign="center" paddingY="8">
              <SpinnerIcon />
            </Box>
          }
          traceId="loading_profile_to_update"
        >
          <CancelRequest closeModal={state.close} {...props} />
        </SuspenseWithPerf>
      </Modal>
    </>
  );
}

function CancelRequest({
  request,
  closeModal,
}: {
  request: RentRequest;
  closeModal?: () => void;
}) {
  const cancel = useCancelRequest(request.uid);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function cancelThisRequest() {
    try {
      setIsSubmitting(true);
      await cancel();
      setIsSubmitting(false);
      toast.success('You have canceled your request successfully.');
      closeModal?.();
    } catch (e) {
      const err = e as Error;
      setIsSubmitting(false);
      toast.error(err.message);
    }
  }
  return (
    <Box>
      <ModalBody>
        <Box backgroundColor="red100" rounded="md" padding="2">
          <Text fontSize="base" fontWeight="semibold">
            This action would cancel and delete the request you made for the
            product.
          </Text>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={cancelThisRequest}
          size="lg"
          status="error"
        >
          {isSubmitting ? <SpinnerIcon color="white" /> : 'Delete Request'}
        </Button>
        <Button size="lg" disabled={isSubmitting} onClick={closeModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Box>
  );
}

export function SeeUserDetailsInModal({
  request,
  children,
}: {
  request: RentRequest;
  children: (props: { open: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  const { product } = useProduct(request.productId);
  const { title, description, pricePerMonth, productMedia } = product;
  const productImage = productMedia?.length ? productMedia[0] : '';

  const [raisedBy, setRaisedBy] = useState<TUser | undefined>(undefined);

  const getUser = useGetUser(request.raisedBy.uid);
  const fetchUserDetails = useCallback(async () => {
    const user = await getUser();
    setRaisedBy(user);
  }, [getUser]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);
  return (
    <>
      {children({ open: state.open })}
      {!raisedBy || !product ? (
        <Inline
          paddingY="24"
          alignItems="center"
          justifyContent="center"
          width="full"
        >
          <SpinnerIcon />
        </Inline>
      ) : (
        <Modal
          isOpen={state.isOpen}
          onClose={state.close}
          title={`Approved Rent Request for - ${raisedBy.displayName}`}
        >
          <SuspenseWithPerf
            fallback={
              <Box textAlign="center" paddingY="8">
                <SpinnerIcon />
              </Box>
            }
            traceId="loading_profile_to_update"
          >
            <Box>
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
                      <img
                        src={productImage}
                        alt={title}
                        height={60}
                        width={60}
                      />
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
                  <Stack gap="2">
                    <Text fontSize="base">Raised By :-</Text>
                    <Inline
                      gap="4"
                      backgroundColor="gray100"
                      rounded="md"
                      padding="2"
                    >
                      {raisedBy?.displayName || raisedBy?.photoURL ? (
                        <Box alignSelf="center">
                          <UserAvatar
                            size="12"
                            name={raisedBy.displayName || ''}
                            photoUrl={raisedBy.photoURL || ''}
                          />
                        </Box>
                      ) : null}
                      <Stack gap="1">
                        <Text className="line-clamp-1" fontSize="base">
                          {raisedBy?.displayName}
                        </Text>
                        <Text className="line-clamp-1" fontSize="sm">
                          {raisedBy?.email}
                        </Text>
                        <Text className="line-clamp-1" fontSize="sm">
                          {raisedBy?.phoneNumber}
                        </Text>
                      </Stack>
                    </Inline>
                  </Stack>
                  <Stack gap="2">
                    <Text fontSize="base">Request Details:-</Text>
                    <Stack gap="1">
                      <Text className="line-clamp-1" fontSize="sm">
                        Request Raised On :-{' '}
                        <Time date={request.creationAt.toDate()} />
                      </Text>
                      <Text className="line-clamp-1" fontSize="sm">
                        Request Approved On :-{' '}
                        <Time date={request.updatedAt.toDate()} />
                      </Text>
                    </Stack>
                  </Stack>
                  <Inline backgroundColor="green100" rounded="md" padding="2">
                    <Text fontSize="sm" fontWeight="semibold">
                      You can contact potential user for your product on the
                      provided details.
                    </Text>
                  </Inline>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" onClick={state.close} size="lg">
                  Okay, Got It.
                </Button>
              </ModalFooter>
            </Box>
          </SuspenseWithPerf>
        </Modal>
      )}
    </>
  );
}
