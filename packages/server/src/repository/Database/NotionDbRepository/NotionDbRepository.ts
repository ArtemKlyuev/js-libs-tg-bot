import { MultiSelect2, NotionDb, Select2 } from '@services';

import {
  DatabaseRepository,
  SearchResult,
  PropertiesResult,
  Library,
  AddResult,
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

  async searchLibrary(query: string): Promise<SearchResult> {
    const result = await this.#db.findByQuery(query);

    return result.mapRight((res) => {
      return res.map(({ data }) => ({
        Name: data.Name.title[0].plain_text,
        Platform: data.Platform.select?.name ?? null,
        'Repo link': data['Repo link'].url,
        'NPM weekly downloads': data['NPM weekly downloads'].number,
        Tags: data.Tags.multi_select.map(({ name }) => name),
        Summary: data.Summary.rich_text[0]?.plain_text ?? null,
        Status: data.Status.select?.name ?? null,
        'Score /5': data['Score /5'].select?.name ?? null,
        Review: data.Review.rich_text[0]?.plain_text ?? null,
      }));
    });
  }
}
