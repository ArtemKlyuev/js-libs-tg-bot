import { AxiosRequestConfig, AxiosBasicCredentials } from 'axios';
import { Either } from '@sweet-monads/either';

import { RequestError } from './RequestError';

export interface SuccessResponse<T = unknown> {
  status: number;
  data: T;
}

export type Response<Data, Error> = Either<RequestError<Error>, SuccessResponse<Data>>;

export type RequestOptions = Omit<
  AxiosRequestConfig,
  'url' | 'method' | 'data' | 'params' | 'signal'
>;

export interface Config {
  baseURL?: string;
  /**
   * миллисекунды
   */
  timeout?: number;
  headers?: Record<string, string | number | boolean>;
  withCredentials?: boolean;
  auth?: AxiosBasicCredentials;
}

export type Request<Data, Error> = { cancel: () => void; response: Promise<Response<Data, Error>> };

export interface GETRequestOptions {
  params?: Record<string, string | number | boolean>;
  options?: RequestOptions;
}

export interface HTTPRequest {
  setConfig: (config: Config) => void;
  get<Data, Error = unknown>(url: string, options?: GETRequestOptions): Request<Data, Error>;
}
