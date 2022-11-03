import { AxiosRequestConfig } from 'axios';

export interface SuccessResponse<Data> {
  status: number;
  data: Data;
}

export interface Request<Data> {
  response: Promise<SuccessResponse<Data>>;
  cancel: (reason?: string) => void;
}

export interface GETRequestOptions
  extends Omit<
    AxiosRequestConfig,
    'url' | 'method' | 'baseURL' | 'params' | 'data' | 'cancelToken' | 'signal'
  > {
  params?: Record<string, string | number>;
}

export interface POSTRequestOptions
  extends Omit<
    AxiosRequestConfig,
    'url' | 'method' | 'baseURL' | 'params' | 'data' | 'cancelToken' | 'signal'
  > {
  params?: Record<string, string | number>;
}

export interface HttpRequest {
  get<Data>(url: string, options?: GETRequestOptions | undefined): Request<Data>;
  post<Data>(url: string, data: Data, options?: POSTRequestOptions | undefined): Request<Data>;
  put<Data>(url: string, data: Data, options?: POSTRequestOptions | undefined): Request<Data>;
}
