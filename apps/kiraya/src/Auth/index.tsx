import {
  Modal,
  ModalBody,
  useOverlayTriggerState,
  formikOnSubmitWithErrorHandling,
  FormField,
  Button,
  SpinnerIcon,
  Box,
  PhoneInput,
  parsePhoneNumber,
  ModalFooter,
} from '@kiraya/kiraya-ui';
import React, { useEffect, useMemo } from 'react';
import { FieldProps, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { useSigninCheck, useUser } from 'reactfire';
import { useCreateProfile } from '@kiraya/data-store/users';
import * as Validator from 'yup';
import { PhoneNumberValidator, queryToSearch } from '@kiraya/util-general';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function UserProfileInModal({
  defaultState,
  children,
  onSuccess,
}: {
  defaultState?: boolean;
  children?: (props: {
    onOpen: (type?: 'login' | 'signup') => void;
  }) => React.ReactNode;
  onSuccess?: () => void;
}) {
  useEffect(() => {
    if (defaultState) {
      state.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultState]);
  const state = useOverlayTriggerState({});
  return (
    <>
      {children?.({
        onOpen: () => state.open(),
      })}
      <Modal
        isOpen={state.isOpen}
        onClose={state.close}
        title={'Complete Your Profile'}
        isDismissable={false}
      >
        <UserProfileForm
          onSuccess={() => (onSuccess ? onSuccess() : state.close())}
        />
      </Modal>
    </>
  );
}

function UserProfileForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: authUser } = useUser();
  const createProfile = useCreateProfile();
  const parsedPhoneNumber = useMemo(() => {
    if (authUser?.phoneNumber) {
      return parsePhoneNumber(
        authUser.phoneNumber,
        'IN'.toUpperCase() as never
      );
    }
  }, [authUser?.phoneNumber]);
  return (
    <Formik
      initialValues={{
        name: authUser?.displayName as string,
        email: authUser?.email,
        phoneNumber: authUser?.phoneNumber as string,
      }}
      validationSchema={Validator.object().shape({
        name: Validator.string()
          .required(`Please provide a name for your account`)
          .max(191, 'Name should be bellow 191 characters'),
        phoneNumber: PhoneNumberValidator.nullable(),
      })}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await createProfile({
          displayName: values.name,
          phoneNumber: values.phoneNumber,
        });
        toast.success('Complete profile!');
        onSuccess?.();
      })}
    >
      {({ isSubmitting, status }) => (
        <Form noValidate>
          <>
            <ModalBody>
              <FormField
                autoFocus
                type="text"
                name="name"
                placeholder="Enter Name"
                label="Name"
              />
              <FormField
                autoFocus
                type="email"
                name="email"
                disabled
                placeholder="Enter Email"
                label="Email"
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
                      defaultCountry={parsedPhoneNumber?.country || 'IN'}
                      placeholder="e.g. 8772321230"
                      className="space-x-4 ml-4"
                      required
                      type="tel"
                      autoFocus
                    />
                  </Box>
                )}
              />
              {status ? <p>Hello {status}</p> : null}
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={isSubmitting}
                level="primary"
                type="submit"
                size="lg"
              >
                {isSubmitting ? <SpinnerIcon color="white" /> : null}Proceed
              </Button>
            </ModalFooter>
          </>
        </Form>
      )}
    </Formik>
  );
}

export function ProtectedRoute({
  redirectTo = '/',
  children,
  redirectBack,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
  redirectBack?: boolean;
}) {
  const { status, data: signInCheckResult } = useSigninCheck();
  const location = useLocation();
  if (status === 'loading') {
    return (
      <span>
        <SpinnerIcon /> Auth Check...
      </span>
    );
  }
  if (signInCheckResult.signedIn === true) {
    return <>{children || <Outlet />}</>;
  }
  return (
    <Navigate
      to={`${redirectTo}${queryToSearch(
        redirectBack
          ? {
              next: location.pathname + location.search,
            }
          : {}
      )}`}
      replace
    />
  );
}
