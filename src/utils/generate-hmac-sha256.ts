import crypto from 'crypto';
import { addBreadcrumb } from './sentry';

export const generateHmacSha256 = (apiSecret: string, body: crypto.BinaryLike): string => {
  const hmac = crypto.createHmac('SHA256', apiSecret);
  hmac.update(body);
  return hmac.digest('hex');
};
