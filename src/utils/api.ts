import { toSnakeCase } from '@/utils/strings';

// export const defaultApiServer = `${import.meta.env.VITE_API_SERVER_HOST}:${import.meta.env.VITE_API_SERVER_PORT}`;
// export const defaultApiServer = `${import.meta.env.VITE_API_SERVER_HOST}`;
//
// export type ApiConfig = {
//   url: URL;
//   options?: RequestInit;
// };
//
// export type ApiOptions = {
//   endpointServer: string;
//   endpointPath: Endpoint;
//   endpointValue: string;
//   body?: string;
//   queryParams?: Record<string, string | number | boolean>;
//   requestOptions?: RequestInit;
// };
//
// export enum EndpointsEnum {
//   aiTransactions = '/ai/transactions',
//   transactions = '/transactions',
//   categories = '/categories',
// }

export type Rows = {
  row: Array<string>
};

export type TableResponse = {
  columns: string[],
  rows: string[][]
};

export type TransactionsResponse = {
  input: string,
  answer: string,
  transactions: Array<Transaction>,
  tableResponse: TableResponse
};

export type CategoriesResponse = {
  categories: Array<Category>;
};

// export type EndpointsTypes = {
//   aiTransactions: TransactionsResponse;
//   transactions: TransactionsResponse;
//   categories: CategoriesResponse;
// };
//
// export type EndpointEnumKey = keyof typeof EndpointsEnum;
// export type Endpoint = `${EndpointsEnum}`;
//
// export function apiConfigConstructor(userApiOptions: ApiOptions): ApiConfig {
//   const url = new URL(
//     `${userApiOptions.endpointServer}${userApiOptions.endpointPath}${userApiOptions.endpointValue}`,
//   );
//
//   const queryParams = userApiOptions.queryParams || {};
//
//   Object.entries(queryParams).map(([qpName, qpValue]) => {
//     url.searchParams.append(toSnakeCase(qpName), `${qpValue}`);
//   });
//
//   const options: RequestInit = {
//     ...userApiOptions.requestOptions,
//     body: JSON.stringify(userApiOptions.body),
//   };
//
//   const config = {
//     url,
//     options,
//   };
//
//   return config;
// }
//
// export async function fetchWithTimeout(
//   input: RequestInfo | URL,
//   init?: RequestInit & { timeout?: number },
// ): Promise<Response> {
//   const { timeout = 8000 } = init || { timeout: 8000 };
//
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//
//   const response = await fetch(input, {
//     ...init,
//     signal: controller.signal,
//   });
//   clearTimeout(id);
//
//   return response;
// }
//
// export async function apiFetch<T = Record<string, unknown>>(
//   userApiConfig: ApiConfig,
// ): Promise<T> {
//   const apiConfig = {
//     ...userApiConfig,
//     options: {
//       ...(userApiConfig && userApiConfig.options),
//       timeout: 60000,
//     },
//   };
//
//   try {
//     const response = await fetchWithTimeout(apiConfig.url, apiConfig.options);
//     const responseData: T = await response.json();
//
//     return responseData;
//   } catch (error) {
//     const errorMessage = `💢 Error: ${error}`;
//     console.error(errorMessage);
//     throw errorMessage;
//   }
// }
