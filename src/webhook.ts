import fetch from 'cross-fetch';
import { WebhookArgs, WebhookHeaderArgs, WebhookOptions } from './types';
import { generateHmacSha256 } from './utils/generate-hmac-sha256';
import { objectReject } from './utils/object-reject';
import { randomUUID } from './utils/random-uuid';
import { addBreadcrumb, setContext } from './utils/sentry';

const webhookHeaders = ({ url, id, authBearer, timestamp, hmacSha256, userAgent }: WebhookHeaderArgs): Record<string, string> => {
  let signatureHeaders, authHeaders, urlHeaders = {};
  if (hmacSha256) {
    addBreadcrumb({ message: 'Generating HMAC Sha256 signature' });
    signatureHeaders = { 'X-Webhook-Hmac-Sha256': hmacSha256 };
  }

  if (authBearer) {
    authHeaders = { Authorization: `Bearer ${authBearer}` };
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': userAgent,
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Id': id,
    'X-Webhook-Url': url,
    ...signatureHeaders,
    ...authHeaders,
  };
  return objectReject(headers, (_, v) => v === undefined || v === null);
};

export class Webhook {
  public readonly options: WebhookOptions;

  static async post(args: WebhookArgs) {
    return new Webhook(args).post();
  }

  static headers(args: WebhookArgs) {
    return new Webhook(args).headers();
  }

  constructor(args: WebhookArgs) {
    const {
      url,
      headers: extraHeaders = {},
      authBearer,
      payload: json = {},
      method = 'POST',
      userAgent = 'Webhook',
      id = randomUUID(),
      timestamp = new Date().toISOString(),
    } = args;

    const body = JSON.stringify(json);
    const hmacSha256 = args.secret ? generateHmacSha256(args.secret, body) : null;
    const headers = {
      ...webhookHeaders({ url, id, authBearer, timestamp, hmacSha256, userAgent }),
      ...extraHeaders,
    };

    this.options = { id, url, headers, body, json, timestamp, hmacSha256, userAgent, method, authBearer };
  }

  async post(): Promise<Response> {
    const { id, url, method, headers, body, timestamp, hmacSha256 } = this.options;

    setContext({ id, url, method, timestamp, hmacSha256 });
    addBreadcrumb({
      message: 'Posting webhook',
      data: { id, url, method, headers, hmacSha256 },
    });

    const response = await fetch(url, { method, headers, body });
    const { status, statusText} = response;
    addBreadcrumb({
      message: 'Response',
      data: { status, statusText },
    });

    return response;
  }

  headers() {
    return this.options.headers;
  }
}
