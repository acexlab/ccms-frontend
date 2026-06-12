/*
 * File: environment.prod.ts
 * Description: Production environment specific configs.
 * To Implement: In production the Angular app is served from the same origin as the API via NGINX ingress path-based routing, so /api resolves correctly without a full URL.
 */

export const environment = {
  production: true,
  apiUrl: '/api'
};
