import * as Sentry from '@sentry/browser';

const CONFIG = {
  ENV: 'development' as string,
};

export function init({
  env = 'development',
  dsn,
  appName,
  appVersion,
}: {
  env: string;
  dsn: string;
  appName: string;
  appVersion: string;
}) {
  CONFIG.ENV = env;
  // don't enable in development mode
  if (env !== 'development') {
    Sentry.init({
      environment: env,
      dsn: dsn,
      release: `${appName.replace('@', '').replace('/', '_')}@${appVersion}`,
      integrations: [
        // disable the promise rejection error reporting
        new Sentry.Integrations.GlobalHandlers({
          onunhandledrejection: false,
          onerror: false,
        }),
        // disable the console error in breadcrumbs
        new Sentry.Integrations.Breadcrumbs({
          console: false,
        }),
      ],
    });
  }
}

export const logError: typeof Sentry.captureException = function (...args) {
  if (CONFIG.ENV === 'development') {
    console.error(...args);
    return '';
  }
  return Sentry.captureException(...args);
};

export const logInfo: typeof Sentry.captureMessage = function (...args) {
  if (CONFIG.ENV === 'development') {
    console.log(...args);
    return '';
  }
  return Sentry.captureMessage(...args);
};

/**
 * Set the reporting user
 */
export function setLoggerIdentity(
  user: {
    uid: string;
    displayName?: string;
  } | null
) {
  Sentry.configureScope((scope) => {
    if (user) {
      const { uid, displayName } = user;
      scope.setUser({ id: uid, name: displayName });
    } else {
      scope.setUser(null);
    }
  });
}
