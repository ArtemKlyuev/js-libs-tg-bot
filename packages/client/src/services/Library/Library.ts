import { HttpRequest, Request } from 'common/services';
import {
  AddLibraryBody,
  CheckExistingSuccessResponse,
  CheckExistingErrorResponse,
  GetPropertiesSuccessReply,
  GetPropertiesErrorReply,
  SearchLibraryReply,
} from 'server/types';

export type LibraryInfo = AddLibraryBody;
export type CheckExistingResponse = CheckExistingSuccessResponse | CheckExistingErrorResponse;
export type GetPropertiesResponse = GetPropertiesSuccessReply | GetPropertiesErrorReply;

export interface Library {
  add: (library: LibraryInfo) => Request<LibraryInfo>;
  checkExisting: (name: string) => Request<CheckExistingResponse>;
  getProperties: () => Request<GetPropertiesResponse>;
  search: (query: string) => Request<SearchLibraryReply>;
}

export class LibraryService implements Library {
  readonly #httpRequest: HttpRequest;

  constructor(httpRequest: HttpRequest) {
    this.#httpRequest = httpRequest;
  }

  getProperties(): Request<GetPropertiesResponse> {
    return this.#httpRequest.get<GetPropertiesResponse>('/get-properties');
  }

  add(library: LibraryInfo): Request<LibraryInfo> {
    return this.#httpRequest.put<AddLibraryBody>('/library/add', library);
  }

  checkExisting(name: string): Request<CheckExistingResponse> {
    return this.#httpRequest.get<CheckExistingResponse>('/library/check-existing', {
      params: { name },
    });
  }

  search(query: string): Request<SearchLibraryReply> {
    return this.#httpRequest.get<SearchLibraryReply>('/library/search', {
      params: { query },
    });
  }
}
