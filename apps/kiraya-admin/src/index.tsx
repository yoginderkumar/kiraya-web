import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { init as initLogging } from '@kiraya/util-logging';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import config from './config';
import { Inline, SpinnerIcon } from '@kiraya/kiraya-ui';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HelmetProvider>
    <FirebaseAppProvider firebaseConfig={config.firebaseConfig} suspense>
      <Router>
        <SuspenseWithPerf
          traceId={'cashbook-auth-wait'}
          fallback={
            <Inline
              minHeight="screen"
              alignItems="center"
              justifyContent="center"
              gap="4"
            >
              <SpinnerIcon size="8" /> Loading...
            </Inline>
          }
        >
          <App />
        </SuspenseWithPerf>
        <Toaster
          position="bottom-center"
          reverseOrder
          toastOptions={{
            style: {
              background: '#2c324b',
              color: '#fff',
            },
            success: {
              duration: 5000,
            },
          }}
        />
      </Router>
    </FirebaseAppProvider>
  </HelmetProvider>
);

initLogging({
  env: config.appEnv as string,
  dsn: config.errorReporting.sentry.dsn as string,
  appName: config.appTitle,
  appVersion: config.appVersion,
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
