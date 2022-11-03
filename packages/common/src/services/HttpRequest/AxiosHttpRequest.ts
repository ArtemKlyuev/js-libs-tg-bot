import axios, { AxiosInstance } from 'axios';

import {
  Request,
  GETRequestOptions,
  POSTRequestOptions,
  HttpRequest,
  SuccessResponse,
} from './types';

export interface AxiosHttpRequestOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

type Cancel = (reason?: string) => void;

export class AxiosHttpRequest implements HttpRequest {
  readonly #axios: AxiosInstance;

  constructor(options?: AxiosHttpRequestOptions) {
    this.#axios = axios.create(options);
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

  post<Data>(url: string, data: Data, options?: POSTRequestOptions | undefined): Request<Data> {
    const controller = new AbortController();

    const response = this.#axios
      .post<Data>(url, data, {
        ...options,
        signal: controller.signal,
      })
      .then(({ data, status }) => ({ data, status }));

    return this.#createRequest(response, controller.abort);
  }

  put<Data>(url: string, data: Data, options?: POSTRequestOptions | undefined): Request<Data> {
    const controller = new AbortController();

    const response = this.#axios
      .put<Data>(url, data, {
        ...options,
        signal: controller.signal,
      })
      .then(({ data, status }) => ({ data, status }));

    return this.#createRequest(response, controller.abort);
  }
}
