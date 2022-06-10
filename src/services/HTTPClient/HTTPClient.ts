import axios, { AxiosError, AxiosInstance } from 'axios';
import { left, right } from '@sweet-monads/either';

import { HTTPRequest, Config, RequestOptions, Response, Request, GETRequestOptions } from './types';
import { RequestError } from './RequestError';

type $RequestOptions = RequestOptions & { signal: AbortSignal };

export class HTTPClient implements HTTPRequest {
  readonly #axiosInstance: AxiosInstance;

  constructor(config: Config) {
    this.#axiosInstance = axios.create(config);
  }

  setConfig(config: Config): void {
    Object.entries(config).forEach(([key, value]) => {
      if (key in this.#axiosInstance.defaults) {
        // @ts-expect-error
        this.#axiosInstance.defaults[key] = value;
      }
    });
  }

  async #get<Data, Error>(
    url: string,
    params?: Record<string, string | number | boolean>,
    options?: $RequestOptions,
  ): Promise<Response<Data, Error>> {
    try {
      const { data, status } = await this.#axiosInstance.get<Data>(url, {
        params,
        ...options,
      });

      return right({ data, status });
    } catch (error) {
      return left(new RequestError(error as AxiosError<Error>));
    }
  }

  get<Data, Error>(url: string, { params, options }: GETRequestOptions): Request<Data, Error> {
    const abortController = new AbortController();

    return {
      cancel: () => abortController.abort(),
      response: this.#get<Data, Error>(url, params, { ...options, signal: abortController.signal }),
    };
  }
}
