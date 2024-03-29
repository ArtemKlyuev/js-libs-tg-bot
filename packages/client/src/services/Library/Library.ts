import { HttpRequest, Request } from 'common/services';
import {
  AddLibraryBody,
  AddLibrarySuccessResponse,
  AddLibraryErrorResponse,
  CheckExistingSuccessResponse,
  CheckExistingErrorResponse,
  GetPropertiesSuccessReply,
  GetPropertiesErrorReply,
  SearchLibraryReply,
} from 'server/types';

export type LibraryInfo = AddLibraryBody;
export type AddLibraryResponse = AddLibrarySuccessResponse | AddLibraryErrorResponse;
export type CheckExistingResponse = CheckExistingSuccessResponse | CheckExistingErrorResponse;
export type GetPropertiesResponse = GetPropertiesSuccessReply | GetPropertiesErrorReply;

export interface Library {
  add: (library: LibraryInfo) => Request<AddLibraryResponse>;
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
    return this.#httpRequest.get<GetPropertiesResponse>('/properties');
  }

  add(library: LibraryInfo): Request<AddLibraryResponse> {
    return this.#httpRequest.put<LibraryInfo, AddLibraryResponse>('/library/add', library);
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
