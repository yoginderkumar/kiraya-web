import { useLoginUser } from '@kiraya/data-store/auth';
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
import toast from 'react-hot-toast';
import React, { useEffect, useMemo, useState } from 'react';
import * as Validator from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '@kiraya/data-store/users';
import { UserProfileInModal } from '../../Auth';
import { SideBanner } from '../../assets/images';

export default function LoginPage() {
  const { user } = useProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user && user.uid) {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userFrom = useMemo(() => {
    return searchParams.get('from');
  }, [searchParams]);

  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const { loginUsingGoogle, loginUsingEmailPassword } = useLoginUser();
  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const user = await loginUsingGoogle();
      setIsGoogleLoading(false);

      if (user === undefined) {
        console.log('User: ', user);
        setIsNewUser(true);
        return;
      }

      if (user !== undefined && user.uid) {
        toast.success(`Logged in as ${user.displayName}`);
        navigate(`/${userFrom || ''}`);
        return;
      }
    } catch (e) {
      const err = e as Error;
      setIsGoogleLoading(false);
      toast.error(err.message);
    }
  }

  function profileCreated() {
    navigate(`/${userFrom || ''}`);
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
                Login Here
              </Text>
            </Box>
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
                  const user = await loginUsingEmailPassword(
                    values.email,
                    values.password
                  );
                  if (user) {
                    toast.success(`Logged in as ${user.displayName}`);
                    navigate(`/${userFrom || ''}`);
                  }
                } catch (e) {
                  const err = e as Error;
                  throw new Error(err.message);
                }
              })}
            >
              {({ status, values, isSubmitting }) => (
                <Form noValidate>
                  <ModalBody>
                    <FormField
                      autoFocus
                      type="email"
                      name="email"
                      secondaryLabel="required"
                      placeholder="Enter Email"
                      label="Email"
                    />
                    <FormField
                      type="password"
                      name="password"
                      secondaryLabel="required"
                      placeholder="Enter Password"
                      label="Password"
                    />
                    {status ? (
                      <Alert status="error">
                        <Text fontSize="sm">{status}</Text>
                      </Alert>
                    ) : null}
                    <Text fontSize="sm">
                      Forgot password?{' '}
                      <Link
                        to={`/forgot-password?email=${values.email}`}
                        className={getButtonClassName({ inline: true })}
                      >
                        Click here
                      </Link>
                    </Text>
                  </ModalBody>
                  <Stack gap="4">
                    <Button
                      level="primary"
                      size="lg"
                      type="submit"
                      disabled={isSubmitting || isGoogleLoading}
                    >
                      {isSubmitting ? <SpinnerIcon color="white" /> : null}{' '}
                      Login
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
                      Don't have an account yet?{' '}
                      <Link
                        to={`/signup?from=${userFrom}`}
                        className={getButtonClassName({ inline: true })}
                      >
                        Click Here
                      </Link>{' '}
                    </Text>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Stack>
        <Box width="1/2" className="xs:hidden lg:block max-h-screen">
          <img
            src={SideBanner}
            alt="side_banner"
            className="w-full max-h-screen"
          />
        </Box>
      </Inline>
      <UserProfileInModal defaultState={isNewUser} onSuccess={profileCreated} />
    </>
  );
}
