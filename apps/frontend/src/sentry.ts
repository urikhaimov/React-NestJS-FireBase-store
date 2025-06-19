import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;
const env = import.meta.env.MODE;
const release = import.meta.env.VITE_APP_RELEASE;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [
      browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    environment: env,
    release,
  });
}

export default Sentry;
