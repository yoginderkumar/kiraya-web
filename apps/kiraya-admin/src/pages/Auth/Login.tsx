import { useLoginUser } from '@kiraya/data-store/auth';
import {
  Alert,
  Box,
  Button,
  FormField,
  formikOnSubmitWithErrorHandling,
  getButtonClassName,
  Inline,
  ModalBody,
  SpinnerIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import { EmailValidator, PasswordValidator } from '@kiraya/util-general';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import React, { useEffect, useMemo } from 'react';
import * as Validator from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '@kiraya/data-store/users';
import { SideBanner } from '../../assets/images';
import config from '../../config';

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

  const { loginUsingEmailPassword } = useLoginUser();

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
                Kiraya Dashboard (Admin)
              </Text>
            </Box>
            <Formik
              initialValues={{ email: '' as string, password: '' as string }}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={Validator.object().shape({
                email: EmailValidator.required().oneOf(
                  [config.adminEmail, null],
                  'Only access to Kiraya staff or admins'
                ),
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
                    return;
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <SpinnerIcon color="white" /> : null}{' '}
                      Login
                    </Button>
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
    </>
  );
}
