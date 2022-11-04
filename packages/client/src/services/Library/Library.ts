import { HttpRequest, Request } from 'common/services';
import {
  AddLibraryBody,
  CheckExistingLibraryReply,
  GetPropertiesSuccessReply,
  GetPropertiesErrorReply,
} from 'server/types';

export type LibraryInfo = AddLibraryBody;

export interface Library {
  add: (library: LibraryInfo) => Request<LibraryInfo>;
  checkExisting: (name: string) => Request<CheckExistingLibraryReply>;
  getProperties: () => Request<GetPropertiesSuccessReply | GetPropertiesErrorReply>;
}

export class LibraryService implements Library {
  readonly #httpRequest: HttpRequest;

  constructor(httpRequest: HttpRequest) {
    this.#httpRequest = httpRequest;
  }

  getProperties(): Request<GetPropertiesSuccessReply | GetPropertiesErrorReply> {
    return this.#httpRequest.get<GetPropertiesSuccessReply | GetPropertiesErrorReply>(
      '/get-properties',
    );
  }

  add(library: LibraryInfo): Request<LibraryInfo> {
    return this.#httpRequest.put<AddLibraryBody>('/library/add', library);
  }

  checkExisting(name: string): Request<CheckExistingLibraryReply> {
    return this.#httpRequest.get<CheckExistingLibraryReply>('/library/check-existing', {
      params: { name },
    });
  }
}
