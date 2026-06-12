/*
 * File: environment.ts
 * Description: Development environment specific configs.
 * To Implement: Keep local API URL updated to point to the backend container or dotnet run.
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
