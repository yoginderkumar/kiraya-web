import { useLoginUser } from '@kiraya/data-store/auth';
import { useProfile } from '@kiraya/data-store/users';
import {
  Alert,
  Box,
  Button,
  FormField,
  formikOnSubmitWithErrorHandling,
  getButtonClassName,
  GoogleIcon,
  Inline,
  ModalBody,
  SpinnerIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import { EmailValidator, PasswordValidator } from '@kiraya/util-general';
import { Form, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Validator from 'yup';
import { UserProfileInModal } from '../../Auth';
import config from '../../config';

export default function SignUpPage() {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const { user } = useProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userFrom = useMemo(() => {
    return searchParams.get('from');
  }, [searchParams]);

  const { loginUsingGoogle, registerAndLoginUserWithEmailAndPassword } =
    useLoginUser();

  useEffect(() => {
    if (user && user.uid) {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function profileCreated() {
    navigate(`/${userFrom || ''}`);
    return;
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const user = await loginUsingGoogle();
      setIsGoogleLoading(false);
      if (user === undefined) {
        setIsNewUser(true);
        return;
      }
      if (user && user.uid) {
        toast.success(`Logged in successfully as ${user.displayName}`);
        profileCreated();
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
      <Inline
        minHeight="screen"
        height="full"
        backgroundColor="white"
        justifyContent="between"
        alignItems="center"
      >
        <Stack
          height="full"
          className="lg:w-1/2 xs:w-full"
          backgroundColor="white"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            borderWidth="1"
            gap="6"
            rounded="md"
            className="xl:w-[70%] lg:w-[80%] md:w-[50%]"
            padding="8"
          >
            <Box textAlign="center">
              <Text color="blue900" fontSize="xl" fontWeight="semibold">
                Sign up Here
              </Text>
            </Box>
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
                    setIsNewUser(true);
                    return;
                  }
                  return;
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
                  </ModalBody>
                  <Stack gap="4">
                    <Button
                      level="primary"
                      size="lg"
                      type="submit"
                      disabled={isSubmitting || isGoogleLoading}
                    >
                      {isSubmitting ? <SpinnerIcon color="white" /> : null} Sign
                      up
                    </Button>
                    <Inline textAlign="center" alignItems="center">
                      <Box
                        width="full"
                        className="h-[1px]"
                        backgroundColor="gray100"
                      />
                      <Text className="px-4">OR</Text>
                      <Box
                        width="full"
                        className="h-[1px]"
                        backgroundColor="gray100"
                      />
                    </Inline>
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
                    <Text fontSize="sm">
                      Already have an account.{' '}
                      <Link
                        to={`/login?from=${userFrom}`}
                        className={getButtonClassName({ inline: true })}
                      >
                        Click Here
                      </Link>
                    </Text>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Stack>
        <Box width="1/2" className="xs:hidden lg:block">
          <Stack>
            <Text color="blue900" fontSize="3xl" fontWeight="semibold">
              {config.appTitle.toUpperCase()}
            </Text>
          </Stack>
        </Box>
      </Inline>
      <UserProfileInModal defaultState={isNewUser} onSuccess={profileCreated} />
    </>
  );
}
