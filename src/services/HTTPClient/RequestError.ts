import { AxiosError } from 'axios';

export class RequestError<ErrorData = unknown> extends Error {
  /**
   * @example
   *
   * 200, 404
   */
  readonly status: number | null = null;
  readonly headers: {} | null = null;
  /**
   * @example
   *
   * "A Timeout Occurred"
   */
  readonly statusText: string | null = null;
  /**
   * @example
   *
   * "ERR_BAD_RESPONSE", "ECONNABORTED"
   */
  readonly code: string | null = null;
  /**
   * @example
   *
   * { code: 524, description: 'A Timeout Occurred' }
   */
  readonly data: ErrorData | null = null;

  constructor(error: AxiosError<ErrorData>) {
    super(error.message);
    // this.message = error.message;

    if (error.code) {
      this.code = error.code;
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { response } = error;

      this.status = response.status;
      this.statusText = response.statusText;
      this.headers = response.headers;
      this.data = response.data;
    }
  }
}
