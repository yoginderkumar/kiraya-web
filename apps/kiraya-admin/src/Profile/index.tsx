import { useProfile } from '@kiraya/data-store/users';
import {
  Box,
  Button,
  Circle,
  FormField,
  Modal,
  ModalBody,
  ModalFooter,
  PhoneInput,
  SpinnerIcon,
  Text,
  UserIcon,
} from '@kiraya/kiraya-ui';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { FieldProps, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import * as Validator from 'yup';
import { SuspenseWithPerf } from 'reactfire';
import { PhoneNumberValidator } from '@kiraya/util-general';
import { getColorForString } from 'generate-colors';

export function UpdateProfileInDialog({
  children,
}: {
  children: (props: { update: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({ update: state.open })}
      <Modal
        isOpen={state.isOpen}
        onClose={state.close}
        title="Update Profile Details"
      >
        <SuspenseWithPerf
          fallback={
            <Box textAlign="center" paddingY="8">
              <SpinnerIcon />
            </Box>
          }
          traceId="loading_profile_to_update"
        >
          <UpdateProfile onSuccess={state.close} onCancel={state.close} />
        </SuspenseWithPerf>
      </Modal>
    </>
  );
}

const updateProfileValidationSchema = Validator.object().shape({
  displayName: Validator.string()
    .required('Please provide your name.')
    .max(191, 'Please use 191 or fewer characters for the name'),
  phoneNumber: PhoneNumberValidator.nullable(),
});

export function UpdateProfile({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel: () => void;
}) {
  const { user, update } = useProfile();
  const initialValues = useMemo(() => {
    return {
      displayName: user.displayName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    };
  }, [user]);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateProfileValidationSchema}
      onSubmit={async ({ phoneNumber, ...values }) => {
        await update({ ...values, phoneNumber });
        onSuccess?.();
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <ModalBody>
            <FormField
              name="displayName"
              label="Your Name"
              placeholder="First Last Name"
              type="text"
              required
            />
            <FormField
              name="email"
              label="Email"
              placeholder="e.g. username@example.com"
              type="email"
              readOnly
            />
            <FormField
              name="phoneNumber"
              renderInput={({
                field: { onChange, ...otherFieldProps },
                form,
              }: FieldProps<string>) => (
                <Box>
                  <PhoneInput
                    {...otherFieldProps}
                    id="phoneNumber"
                    onChange={(phoneNumber) =>
                      form.setFieldValue(otherFieldProps.name, phoneNumber)
                    }
                    defaultCountry={'IN'}
                    placeholder="e.g. 8772321230"
                    className="space-x-4 ml-4"
                    required
                    type="tel"
                    autoFocus
                  />
                </Box>
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            {onCancel ? (
              <Button type="button" onClick={() => onCancel()} size="lg">
                Cancel
              </Button>
            ) : null}
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

type UserAvatarProps = {
  uid?: string;
  photoUrl?: string;
  name: string;
  size?: React.ComponentProps<typeof Box>['size'];
  fontSize?: React.ComponentProps<typeof Text>['fontSize'];
};
export function UserAvatar({
  uid,
  name,
  size,
  fontSize,
  photoUrl,
}: UserAvatarProps) {
  const [r, g, b] = getColorForString(uid || name || photoUrl || 'ku');
  return (
    <Circle
      size={size || '14'}
      key={uid || `avatar_${photoUrl}_${name}`}
      style={{
        color: `rgb(${r}, ${g}, ${b})`,
        background: `rgba(${r}, ${g}, ${b}, .1)`,
        borderRadius: 500,
      }}
    >
      {photoUrl?.length ? (
        <img
          src={photoUrl}
          className="rounded-full"
          referrerPolicy="no-referrer"
          alt={name}
        />
      ) : name.length ? (
        <Text
          textTransform="uppercase"
          fontSize={fontSize || 'lg'}
          fontWeight="semibold"
        >
          {name[0]}
        </Text>
      ) : (
        <UserIcon />
      )}
    </Circle>
  );
}
