import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  Request,
  GETRequestOptions,
  POSTRequestOptions,
  HttpRequest,
  SuccessResponse,
  HttpRequestError,
} from './types';

export interface AxiosHttpRequestOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  auth?: AxiosRequestConfig['auth'];
}

type Cancel = (reason?: string) => void;

class AxiosHttpRequestError<Data> extends Error implements HttpRequestError<Data> {
  readonly responseData: Data | null;
  readonly code: number | null;
  readonly response: AxiosError<Data>['response'];

  constructor(error: AxiosError<Data>) {
    super(error.message);

    this.name = 'HttpRequestError';
    this.code = error.response?.status ?? null;
    this.responseData = error.response?.data ?? null;
    this.response = error.response;
  }
}

export class AxiosHttpRequest implements HttpRequest {
  readonly #axios: AxiosInstance;

  constructor(options?: AxiosHttpRequestOptions) {
    this.#axios = axios.create(options);
    this.#axios.interceptors.response.use(
      (response) => response,
      (err) => {
        const error = this.#createError(err);
        throw error;
      },
    );
  }

  #createError<Data>(error: AxiosError<Data>): HttpRequestError<Data> {
    return new AxiosHttpRequestError(error);
  }

  #createRequest<Data>(response: Promise<SuccessResponse<Data>>, onCancel: Cancel): Request<Data> {
    return { response, cancel: (reason?: string) => onCancel(reason) };
  }

  get<Data>(url: string, options?: GETRequestOptions | undefined): Request<Data> {
    const controller = new AbortController();

    const response = this.#axios
      .get<Data>(url, {
        ...options,
        signal: controller.signal,
      })
      .then(({ data, status }) => ({ data, status }));

    return this.#createRequest(response, controller.abort);
  }

  post<Data, ResponseData = Data>(
    url: string,
    data: Data,
    options?: POSTRequestOptions | undefined,
  ): Request<ResponseData> {
    const controller = new AbortController();

    const response = this.#axios
      .post<ResponseData>(url, data, {
        ...options,
        signal: controller.signal,
      })
      .then(({ data, status }) => ({ data, status }));

    return this.#createRequest(response, controller.abort);
  }

  put<Data, ResponseData = Data>(
    url: string,
    data: Data,
    options?: POSTRequestOptions | undefined,
  ): Request<ResponseData> {
    const controller = new AbortController();

    const response = this.#axios
      .put<ResponseData>(url, data, {
        ...options,
        signal: controller.signal,
      })
      .then(({ data, status }) => ({ data, status }));

    return this.#createRequest(response, controller.abort);
  }
}
