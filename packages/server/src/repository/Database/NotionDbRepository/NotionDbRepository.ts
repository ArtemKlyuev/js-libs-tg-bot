import { left, right } from '@sweet-monads/either';

import { MultiSelect2, NotionDb, Select2, FindByQueryError } from '@services';

import {
  DatabaseRepository,
  SearchResult,
  PropertiesResult,
  Library,
  AddResult,
  SearchLibraryResult,
  SearchByFiltersResult,
  RespositoryFiltersConfig,
} from '../Repository';

export class NotionDbRepository implements DatabaseRepository {
  readonly #db: NotionDb;

  constructor(db: NotionDb) {
    this.#db = db;
  }

  #retrieveSelectOptions(property: Select2): string[] {
    return property.select.options.map(({ name }) => name);
  }

  #retrieveMultiSelectOptions(property: MultiSelect2): string[] {
    return property.multi_select.options.map(({ name }) => name);
  }

  async getProperties(): Promise<PropertiesResult> {
    const response = await this.#db.getDatabaseInfo();

    return response.mapRight((dbInfo) => {
      const platforms = this.#retrieveSelectOptions(dbInfo.properties.Platform);
      const tags = this.#retrieveMultiSelectOptions(dbInfo.properties.Tags);
      const statuses = this.#retrieveSelectOptions(dbInfo.properties.Status);
      const scores = this.#retrieveSelectOptions(dbInfo.properties['Score /5']);

      return { platforms, tags, statuses, scores };
    });
  }

  async addLibrary(library: Library): Promise<AddResult> {
    const response = await this.#db.insert({
      ...library,
      stars: library.githubStars,
    });

    return response;
  }

  async searchLibraries(query: string): Promise<SearchResult> {
    const result = await this.#db.findByQuery(query);

    return result.mapRight((res) => {
      return res.map(({ data }) => ({
        name: data.Name.title[0].plain_text,
        platform: data.Platform.select?.name!,
        tags: data.Tags.multi_select.map(({ name }) => name),
        repoURL: data['Repo link'].url,
        npmDownloads: data['NPM weekly downloads'].number,
        githubStars: data['github stars'].number,
        summary: data.Summary.rich_text[0]?.plain_text ?? null,
        status: data.Status.select?.name ?? null,
        score: data['Score /5'].select?.name ?? null,
        review: data.Review.rich_text[0]?.plain_text ?? null,
      }));
    });
  }

  async searchLibraryByName(name: string): Promise<SearchLibraryResult> {
    const eitherLibraries = await this.searchLibraries(name);

    return eitherLibraries
      .mapRight((libraries) => {
        const library = libraries.find((library) => library.name.toLowerCase() === name);

        if (!library) {
          return left(new FindByQueryError(name));
        }

        return right(library);
      })
      .join();
  }

  async searchLibraryByFilters({
    filters,
    sorts,
  }: RespositoryFiltersConfig): Promise<SearchByFiltersResult> {
    const result = await this.#db.findByFilters({ filters: { and: [{}] }, sorts: [sorts] });

    return result.mapRight((res) => {
      return res.map(({ data }) => ({
        name: data.Name.title[0].plain_text,
        platform: data.Platform.select?.name!,
        tags: data.Tags.multi_select.map(({ name }) => name),
        repoURL: data['Repo link'].url,
        npmDownloads: data['NPM weekly downloads'].number,
        githubStars: data['github stars'].number,
        summary: data.Summary.rich_text[0]?.plain_text ?? null,
        status: data.Status.select?.name ?? null,
        score: data['Score /5'].select?.name ?? null,
        review: data.Review.rich_text[0]?.plain_text ?? null,
      }));
    });
  }
}
