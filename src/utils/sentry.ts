import * as Sentry from '@sentry/node';
import { CaptureContext } from '@sentry/types';

const isSentryInit = () => !!Sentry.getCurrentHub().getClient();

export const wrapSentry = <T>(fn: (args: T) => void) =>
  isSentryInit() ? fn : () => {};

export const setContext = wrapSentry((options: Record<string, any>) =>
  Sentry.setContext('webhook', options));

export const addBreadcrumb = wrapSentry((options: Sentry.Breadcrumb) =>
  Sentry.addBreadcrumb({ category: 'webhook', ...options }));

export const captureException = wrapSentry((exception: any, captureContext?: CaptureContext | undefined) =>
  Sentry.captureException(exception, captureContext));
