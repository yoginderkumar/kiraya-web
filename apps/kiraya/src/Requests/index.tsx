import {
  RentRequest,
  useApproveRequest,
  useProduct,
} from '@kiraya/data-store/products';
import { useGetUser } from '@kiraya/data-store/users';
import {
  Box,
  Button,
  Inline,
  Modal,
  ModalBody,
  ModalFooter,
  SpinnerIcon,
  Stack,
  Text,
  useOverlayTriggerState,
} from '@kiraya/kiraya-ui';
import { maskString } from '@kiraya/util-general';
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

  console.log('read: ', raisedBy);

  return !raisedBy || !product ? (
    <Inline
      paddingY="24"
      alignItems="center"
      justifyContent="center"
      width="full"
    >
      <SpinnerIcon />
    </Inline>
  ) : (
    <Box>
      <ModalBody>
        <Stack gap="4">
          <Text fontSize="md">Request Raised For :</Text>
          <Stack gap="2">
            <Text fontSize="base">Product Details</Text>
            <Inline gap="4" backgroundColor="gray100" rounded="md" padding="2">
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
            <Inline gap="4" backgroundColor="gray100" rounded="md" padding="2">
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
    </Box>
  );
}
