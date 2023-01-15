import {
  Modal,
  ModalBody,
  Text,
  useOverlayTriggerState,
  formikOnSubmitWithErrorHandling,
  FormField,
  Button,
  GoogleIcon,
  Stack,
  SpinnerIcon,
  Box,
  PhoneInput,
  parsePhoneNumber,
  ModalFooter,
  Alert,
} from '@kiraya/kiraya-ui';
import { useLoginUser } from '@kiraya/data-store/auth';
import React, { useEffect, useMemo, useState } from 'react';
import { FieldProps, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { useSigninCheck, useUser } from 'reactfire';
import { useCreateProfile } from '@kiraya/data-store/users';
import * as Validator from 'yup';
import {
  EmailValidator,
  PasswordValidator,
  PhoneNumberValidator,
  queryToSearch,
} from '@kiraya/util-general';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthenticationInModal({
  children,
}: {
  children: (props: {
    onOpen: (type?: 'login' | 'signup') => void;
  }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  const [step, setStep] = useState<'login' | 'signup' | 'userProfile'>('login');
  function onClose() {
    setStep('login');
    state.close();
  }
  return (
    <>
      {children({
        onOpen: (type?: 'login' | 'signup') => {
          if (type) {
            setStep(type);
          }
          state.open();
        },
      })}
      <Modal
        isOpen={state.isOpen}
        onClose={onClose}
        title={
          step === 'login'
            ? 'Login here'
            : step === 'signup'
            ? 'Signup Here'
            : step === 'userProfile'
            ? 'Complete Your Profile'
            : ''
        }
        isDismissable
      >
        {step === 'login' ? (
          <LoginForm
            onSignupClick={() => setStep('signup')}
            onUserCompleteProfile={() => setStep('userProfile')}
          />
        ) : step === 'signup' ? (
          <SignupForm
            onLoginClick={() => setStep('login')}
            onUserCompleteProfile={() => setStep('userProfile')}
          />
        ) : step === 'userProfile' ? (
          <UserProfileForm onSuccess={() => onClose()} />
        ) : null}
      </Modal>
    </>
  );
}

function LoginForm({
  onSignupClick,
  onUserCompleteProfile,
}: {
  onSignupClick?: () => void;
  onUserCompleteProfile: () => void;
}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const { loginUsingGoogle, loginUsingEmailPassword } = useLoginUser();
  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const user = await loginUsingGoogle();
      setIsGoogleLoading(false);
      if (user === undefined) {
        onUserCompleteProfile();
        return;
      }
    } catch (e) {
      const err = e as Error;
      setIsGoogleLoading(false);
      toast.error(err.message);
    }
  }
  return (
    <>
      <Formik
        initialValues={{ email: '' as string, password: '' as string }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={Validator.object().shape({
          email: EmailValidator.required(),
          password: PasswordValidator.required(),
        })}
        onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
          try {
            await loginUsingEmailPassword(values.email, values.password);
          } catch (e) {
            const err = e as Error;
            throw new Error(err.message);
          }
        })}
      >
        {({ status, isSubmitting }) => (
          <Form noValidate>
            <ModalBody>
              <FormField
                autoFocus
                type="email"
                name="email"
                placeholder="Enter Email"
                label="Email"
              />
              <FormField
                type="password"
                name="password"
                placeholder="Enter Password"
                label="Password"
              />
              {status ? (
                <Alert status="error">
                  <Text fontSize="sm">{status}</Text>
                </Alert>
              ) : null}
              <Text>
                Don't have an account yet?{' '}
                <Button inline onClick={onSignupClick}>
                  Signup
                </Button>{' '}
                Here
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                level="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
              >
                {isSubmitting ? <SpinnerIcon color="white" /> : null} Login
              </Button>
              <Button
                size="lg"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <SpinnerIcon />
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with google
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </>
  );
}

function SignupForm({
  onLoginClick,
  onUserCompleteProfile,
}: {
  onLoginClick?: () => void;
  onUserCompleteProfile: () => void;
}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const { loginUsingGoogle, registerAndLoginUserWithEmailAndPassword } =
    useLoginUser();
  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const user = await loginUsingGoogle();
      setIsGoogleLoading(false);
      if (user === undefined) {
        onUserCompleteProfile();
        return;
      }
    } catch (e) {
      const err = e as Error;
      setIsGoogleLoading(false);
      toast.error(err.message);
    }
  }
  return (
    <Formik
      initialValues={{
        email: '' as string,
        password: '' as string,
        confirmPassword: '' as string,
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={Validator.object().shape({
        email: EmailValidator.required(),
        password: PasswordValidator.required(),
        confirmPassword: PasswordValidator.oneOf(
          [Validator.ref('password'), null],
          'Confirm password does not match.'
        ).required(),
      })}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        try {
          const user = await registerAndLoginUserWithEmailAndPassword(
            values.email,
            values.password
          );
          if (user === undefined) {
            onUserCompleteProfile();
            return;
          }
        } catch (e) {
          const err = e as Error;
          throw new Error(err.message);
        }
      })}
    >
      {({ status, isSubmitting }) => (
        <Form noValidate>
          <ModalBody>
            <FormField
              autoFocus
              type="email"
              name="email"
              placeholder="Enter Email"
              label="Email"
            />
            <FormField
              type="password"
              name="password"
              placeholder="Enter Password"
              label="Password"
            />
            <FormField
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              label="Confirm Password"
            />
            {status ? (
              <Alert status="error">
                <Text fontSize="sm">{status}</Text>
              </Alert>
            ) : null}
            <Stack gap="4">
              <Text>
                Already have an account.{' '}
                <Button inline onClick={onLoginClick}>
                  Login
                </Button>{' '}
                here
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              level="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
            >
              {isSubmitting ? <SpinnerIcon color="white" /> : null} Signup
            </Button>
            <Button
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <SpinnerIcon />
              ) : (
                <>
                  <GoogleIcon />
                  Continue with google
                </>
              )}
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

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
