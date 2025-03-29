import * as Sentry from "@sentry/react";
import { Routes } from "react-router";

export const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);