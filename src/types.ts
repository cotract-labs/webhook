export interface WebhookArgs {
  url: string;
  authBearer?: string | null;
  headers?: Record<string, string>;
  id?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  payload?: Record<string, any>;
  secret?: string;
  timestamp?: string;
  userAgent?: string;
}

export interface WebhookOptions {
  authBearer?: string | null;
  body: string;
  headers: Record<string, string>;
  hmacSha256: string | null;
  id: string;
  json: Record<string, any>;
  method: string;
  timestamp: string;
  url: string;
  userAgent: string;
}

export interface WebhookHeaderArgs {
  url?: string;
  id: string;
  timestamp: string;
  userAgent: string;
  hmacSha256?: string | null;
  authBearer?: string | null;
}
