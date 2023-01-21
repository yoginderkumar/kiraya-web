import { useLoginUser } from '@kiraya/data-store/auth';
import {
  Alert,
  Box,
  Button,
  FormField,
  formikOnSubmitWithErrorHandling,
  Inline,
  ModalBody,
  PageMeta,
  SpinnerIcon,
  Stack,
  Text,
} from '@kiraya/kiraya-ui';
import { EmailValidator } from '@kiraya/util-general';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import * as Validator from 'yup';

export default function ForgotPasswordPage() {
  const [searchString] = useSearchParams();
  const { sendResetPasswordLink } = useLoginUser();
  const defaultEmail: string = useMemo(() => {
    return searchString.get('email') || '';
  }, [searchString]);
  return (
    <>
      <PageMeta>
        <title>Reset Your Password</title>
      </PageMeta>
      <Inline
        minHeight="screen"
        height="full"
        backgroundColor="white"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          height="full"
          width="full"
          maxWidth="xl"
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
                Forgot Password?
              </Text>
            </Box>
            <Formik
              initialValues={{ email: defaultEmail || ('' as string) }}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={Validator.object().shape({
                email: EmailValidator.required(),
              })}
              onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
                await sendResetPasswordLink(values.email);
                toast.success(
                  `We have sent you a reset link on ${values.email}`
                );
              })}
            >
              {({ status, isSubmitting }) => (
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <SpinnerIcon color="white" /> : null}{' '}
                      Reset Password
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Stack>
      </Inline>
    </>
  );
}
