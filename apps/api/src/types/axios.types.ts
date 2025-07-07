export type AxiosError = {
  message: string;
  name: string;
  stack?: string;
  config: Record<string, any>;
  code?: string;
  response?: AxiosResponse<any>;
  isAxiosError: boolean;
};

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

export type HTTPHeaders = Record<string, string | string[]>;

export interface AxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: HTTPHeaders;
  config: Record<string, any>;
  request?: any;
}
