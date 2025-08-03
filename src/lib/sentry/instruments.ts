import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";

Sentry.init({
  dsn: import.meta.env.VITE_REACT_SENTRY_DSN,
  integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
});
