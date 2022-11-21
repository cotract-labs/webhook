# Webhook

Make Webhook requests with ease.

__Features__
- Automatic Sentry integration, breadcrumb and context
- Http header for HMAC SHA256 signature of payload
- Pass authorization bearer or add any http header
- id for request tracing and logging
- only get headers if you want to make the actual request yourself

## Getting started

Example usage

```ts
import Webhook from '@cotract/webhook';

(async () => {
  const res = await Webhook.post({
    url: 'https://example.com',
    payload: { wat: 'man' },
    secret: 'notsosecret',
  });

  // this works too
  // const webhook = new Webhook(options);
  // const response = await webhook.post();

  console.log(`${res.status} - ${res.statusText}`);
  console.log('Body: ', await res.text());
})();
```

`secret` is not required but recommended, since it adds the ability for receivers to validate that you are the sender.
If `secret` is past then a header `X-Webhook-Hmac-Sha256` is added to the request.

__Headers only__

Only request headers

```ts
Webhook.headers({
  url: 'https://example.com',
  payload: { wat: 'man' },
  secret: 'notsosecret',
});
// {
//   'Content-Type': 'application/json',
//   Accept: 'application/json',
//   'User-Agent': 'Webhook',
//   'X-Webhook-Timestamp': '2022-11-21T19:58:51.009Z',
//   'X-Webhook-Id': 'a2f151bf-d25c-4d76-a8b9-309d6c1d8608',
//   'X-Webhook-Url': 'https://example.com',
//   'X-Webhook-Hmac-Sha256': '7a737f157afb85331d5542151753f0530986e24d1866b545d440497bc386e997'
// }
```

__Options__

- `url` (required) - URL to post to
- `payload` - JSON payload
- `secret` - secret to sign payload HMAC SHA256
- `authBearer` - Authorization Bearer
- `headers` - Add extra HTTP headers
- `id` - Tracing/request/correlation id
- `method` - HTTP Method, one of `POST`, `PUT` and `PATCH`
- `timestamp` - Timestamp for webhook request ISO string format (e.g `2022-11-21T20:15:25.760Z`)
- `userAgent` - user agent for the webhook request

```ts
Webhook.post({
  url: 'https://example.com',
  payload: { wat: 'man' },
  secret: 'notsosecret',
  authBearer: 'your-authorization-bearer',
  headers: { 'X-Webhook-Author': 'jacob' },
  id: 'tracing-or-request-id',
  method: 'POST',
  timestamp: new Date().toISOString(),
  userAgent: 'Important Webhook v1.0.0',
});
```
