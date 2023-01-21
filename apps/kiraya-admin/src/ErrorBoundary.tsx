import { queryToSearch } from '@kiraya/util-general';
import { logError } from '@kiraya/util-logging';
import {
  ArrowDownIcon,
  InformationCircleIcon,
  Box,
  Stack,
  Text,
  Heading,
  Inline,
  MailIcon,
  Button,
  getButtonClassName,
} from '@kiraya/kiraya-ui';
import React from 'react';
import config from './config';

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void;
type ErrorHandlingComponent<Props> = (
  props: Props,
  error: Error | null,
  componentStack: string | null
) => React.ReactNode;

type ErrorState = { error: Error | null; componentStack: string | null };

export function Catch<Props extends Record<string, unknown>>(
  component: ErrorHandlingComponent<Props>,
  errorHandler?: ErrorHandler
): React.ComponentType<Props> {
  return class extends React.Component<Props, ErrorState> {
    state: ErrorState = {
      error: null,
      componentStack: null,
    };
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      if (errorHandler) {
        errorHandler(error, info);
      }
      // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.
      this.setState({ error, componentStack: info.componentStack });
    }
    render() {
      return component(this.props, this.state.error, this.state.componentStack);
    }
  };
}

// !QUICK FIX!
// I (sudkumar) don't know what is happening with firestore.
// When user logs in, fetchin the user profile
// throws an error
// `Missing or insufficient permissions.`
// This error automatically disappears when I
// refresh the page.
// So that's is what I am doing.
//
// TODO: Find out the real cause and fix it.
const dontRefresh = 'drfs';

const ErrorBoundary = Catch(function ErrorBoundary(
  props: {
    children: React.ReactNode;
    errorRenderer?: (props: {
      error: Error;
      isMissingPermissionsError: boolean;
      isNotFoundError: boolean;
      defaultRenderedMessage: React.ReactNode;
    }) => React.ReactNode;
  },
  error: Error | null,
  componentStack: string | null
) {
  if (error) {
    const isMissingPermissionsError = getIsMissingPermissionsError(error);
    const isNotFoundError = getIsNotFoundError(error);
    if (
      isMissingPermissionsError &&
      window.location.hash !== `#${dontRefresh}`
    ) {
      window.location.hash = dontRefresh;
      window.location.reload();
      return null;
    }
    if (config && !config) {
      logError(error, {
        contexts: {
          react: { componentStack },
        },
        tags: {
          on: 'render',
        },
      });
    }
    const defaultRenderedMessage = <DisplayError error={error} />;
    return (
      <>
        {props.errorRenderer
          ? props.errorRenderer({
              error,
              isMissingPermissionsError,
              defaultRenderedMessage,
              isNotFoundError,
            })
          : defaultRenderedMessage}
      </>
    );
  }
  return props.children;
});

export default ErrorBoundary;

function getIsMissingPermissionsError(error: Error) {
  return (
    error.message
      .toLowerCase()
      .indexOf('missing or insufficient permissions') !== -1
  );
}

function getIsNotFoundError(error: Error) {
  return error.message.toLowerCase().indexOf('not found') !== -1;
}

function DisplayError({ error }: { error: Error }) {
  const errorMessage = error.message;
  return (
    <Box
      maxWidth="3xl"
      marginX="auto"
      paddingX="4"
      paddingY="12"
      bgColor="white"
      rounded="md"
    >
      <Stack role="alert" aria-live="assertive" gap="8">
        <Stack gap="4">
          <Heading as="h2" fontSize="xl" fontWeight="medium">
            Oops... Something went wrong!
          </Heading>
          <Box
            style={{
              maxHeight: '200px',
            }}
            overflow="auto"
            borderWidth="2"
            borderColor="red100"
            padding="4"
            rounded="md"
          >
            <Text color="red900" fontSize="sm">
              {errorMessage}
            </Text>
          </Box>
          <Text>
            But please don't worry. We have been notified and the issue will be
            fixed soon.
          </Text>
          <Text>
            In the mean time, please try to{' '}
            <Text
              as="a"
              href="#refresh"
              color="blue900"
              fontWeight="medium"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const currentPath = window.location;
                  window.location = currentPath;
                }
              }}
            >
              refresh the page
            </Text>{' '}
            or{' '}
            <Text as="a" href="/" color="blue900" fontWeight="medium">
              use other modules
            </Text>
            .
          </Text>
          <Box>
            <Button
              level="primary"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
            >
              Reload Page
            </Button>
          </Box>
        </Stack>
        <hr />
        <Stack gap="4">
          <Heading as="h3" fontSize="lg" fontWeight="medium">
            <InformationCircleIcon size="6" color="gray500" /> Common cause and
            solutions
          </Heading>
          <Text>
            Here are some common problems which can cause these type of issues.
          </Text>
          <Stack as="dl" gap="1">
            <Text as="dt" fontWeight="medium" fontSize="md">
              1. You may be using an unsupported older version of application.
            </Text>
            <Text as="dd" fontSize="sm">
              <ArrowDownIcon rotate="270" /> Update your application by hard
              refreshing (hold <Text as="kbd">shift</Text> on keyboard while
              reloading) the page.
            </Text>
          </Stack>
        </Stack>
        <hr />
        <Stack gap="4">
          <Heading as="h3" fontSize="lg" fontWeight="medium">
            {/* <SupportIcon size="6" color="gray500" /> */}
            Need Help ?
          </Heading>
          <Text fontWeight="normal">
            <b>We have been notified for this incident.</b> If you need any
            further assistance, please contact our support at{' '}
            <Text
              as="a"
              color="blue900"
              fontWeight="medium"
              href={`mailto:yogi@gmail.com${queryToSearch({
                subject: `Facing Error: ${errorMessage}`,
                body: `Hi,

I am facing an issue while accessing ${window.location.href} page. Here are the some more details.

Message: ${errorMessage}
Stack trace:
${error.stack}
`,
              })}`}
            >
              {`yogi@gmail.com`}
            </Text>{' '}
            with the error details.
          </Text>
          <Box borderWidth="1" padding="4" rounded="md" overflow="auto">
            <Stack gap="4">
              <Box>
                <Text>Hi {config.appTitle} Team,</Text>
                <br />
                <Text>
                  I received following error when trying to access the page{' '}
                  {window.location.href}:
                </Text>
                <br />
                <Box>&gt; {error.message}</Box>
                <br />
                <Text>
                  Please look into it and contact me if you need more
                  information.
                </Text>
              </Box>
              <hr />
              <Inline gap="8">
                <a
                  href={`mailto:yoginderkumar2510@gmail.com?subject=${encodeURI(
                    'Error on web app'
                  )}&body=${encodeURI(`Hi ${config.appTitle} Team,

I received following error when trying to access the page ${window.location.href}:
---
${error.message}
---
Please look into it and contact me if you need more information.`)}`}
                  className={getButtonClassName({ level: 'secondary' })}
                >
                  <MailIcon /> Email
                </a>
              </Inline>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
