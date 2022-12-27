const version = process.env.REACT_APP_VERSION || '1.0.0';

const config = {
  appTitle: 'Kiraya',
  appVersion: version,
  appName: '@kiraya/web',
  appEnv: 'development',
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: 'AIzaSyDwrXJ9pLxI89qQEgdbCGLMDkcAPNsOIGc',
    appId: '1:328657533775:web:97f8c79df89c2ab563633a',
    authDomain: 'kiraya-dev.firebaseapp.com',
    databaseURL: 'https://kiraya-dev-default-rtdb.firebaseio.com/',
    // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    messagingSenderId: '328657533775',
    projectId: 'kiraya-dev',
    storageBucket: 'kiraya-dev.appspot.com',
    // vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    // cloudFunctionsRegion: process.env.REACT_APP_CLOUD_FUNCTIONS_REGION,
    // cloudFunctionsUSRegion: process.env.REACT_APP_CLOUD_FUNCTIONS_REGION_US,
    // supportPhoneNumberKey: 'support_number',
  },
  errorReporting: {
    sentry: {
      dsn: 'https://eb6dfe754c4843f58fa79dafcf6ab2c7@o4504317790650368.ingest.sentry.io/4504317798121472',
    },
  },
};

export default config;
