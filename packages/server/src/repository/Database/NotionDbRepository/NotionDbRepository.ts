import { left, right } from '@sweet-monads/either';

import {
  NotionDb,
  FiltersConfig,
  DbPropertyTypeValue,
  PropertyType,
  DbProperty,
  Option,
  TextDbPropertyValue,
} from '@services/Database';

import { DbProperty as DbPropertyModel } from '../../../models';

import {
  DatabaseRepository,
  SearchResult,
  PropertiesResult,
  AddResult,
  SearchLibraryResult,
  SearchByFiltersResult,
  RespositoryFiltersConfig,
  LibraryInfo,
} from '../Repository';
import {
  PropertySchema,
  MultiSelect,
  Number,
  RichText,
  Select,
  Title,
  URL,
} from './PropertySchema';

const propertyMap: Record<PropertyType, (value: any) => PropertySchema> = {
  multi_select: (value: string[]) => new MultiSelect(value),
  number: (value: number) => new Number(value),
  rich_text: (value: string) => new RichText(value),
  select: (value: string) => new Select(value),
  title: (value: string) => new Title(value),
  url: (value: string) => new URL(value),
};

const propertyMap2: Record<PropertyType, (value: any) => any> = {
  multi_select: (value: Option[]) => value.map(({ id, name }) => ({ id, name })),
  number: (value: number | null) => value,
  rich_text: (value: [TextDbPropertyValue] | []) => value[0]?.text.content ?? null,
  select: (value: Option | null) => (value ? { id: value.id, name: value.name } : value),
  title: (value: [TextDbPropertyValue]) => value[0].text.content,
  url: (value: string | null) => value,
};

class NotFoundByNameError extends Error {
  readonly code: number;
  readonly name: string;

  constructor({
    code,
    name,
    searchedLibrary,
  }: {
    name: string;
    searchedLibrary: string;
    code: number;
  }) {
    const errorMessage = `Не найдено библиотеки с именем "${searchedLibrary}"`;

    super(errorMessage);

    this.code = code;
    this.name = name;
  }
}

export class NotionDbRepository implements DatabaseRepository {
  readonly #db: NotionDb;

  constructor(db: NotionDb) {
    this.#db = db;
  }

  async getProperties(): Promise<PropertiesResult> {
    const response = await this.#db.getDatabaseInfo();

    return response.mapRight((dbInfo) => Object.values(dbInfo.properties));
  }

  async addLibrary(properties: DbPropertyModel[]): Promise<AddResult> {
    const result = properties
      .filter((prop) => Boolean(prop.value))
      .reduce((acc, curr) => {
        const schema = propertyMap[curr.type as PropertyType](curr.value);

        return { ...acc, [curr.id]: schema.toDbValue() };
      }, {});

    const response = await this.#db.insert(result);

    return response;
  }

  async searchLibraries(query: string): Promise<SearchResult> {
    const eitherLibraries = await this.#db.findByQuery(query);

    return eitherLibraries.mapRight((library) => {
      return library.map(({ data: properties }) => {
        return properties.map(({ id, name, type, ...rest }) => {
          const [_, value] = Object.entries(rest)[0];
          return { id, name, value: propertyMap2[type](value) };
        });
      });
    });
  }

  async searchLibraryByName(name: string): Promise<SearchLibraryResult> {
    const eitherLibraries = await this.searchLibraries(name);

    return eitherLibraries
      .mapRight((libraries) => {
        const library = libraries.find((library) => {
          const nameData = library.find(({ id }) => id === 'title');
          // @ts-expect-error we know that value exist and it's a string
          return nameData?.value.toLocaleLowerCase() === name;
        });

        if (!library) {
          return left(
            new NotFoundByNameError({
              name: 'NotFoundByNameError',
              searchedLibrary: name,
              code: 404,
            }),
          );
        }

        return right(library);
      })
      .join();
  }

  async searchLibraryByFilters({
    filters,
    sort,
  }: RespositoryFiltersConfig): Promise<SearchByFiltersResult> {
    // TODO: filters
    // const finalFilters: FiltersConfig = sort
    //   ? { filters: { and: [{}] }, sorts: [sort] }
    //   : { filters: { and: [{}] } };
    // const result = await this.#db.findByFilters(finalFilters);
    // return result.mapRight((res) => {
    //   return res.map(({ data }) => ({
    //     name: data.Name.title[0].plain_text,
    //     platform: data.Platform.select?.name!,
    //     tags: data.Tags.multi_select.map(({ name }) => name),
    //     repoURL: data['Repo link'].url,
    //     npmDownloads: data['NPM weekly downloads'].number,
    //     githubStars: data['github stars'].number,
    //     summary: data.Summary.rich_text[0]?.plain_text ?? null,
    //     status: data.Status.select?.name ?? null,
    //     score: data['Score /5'].select?.name ?? null,
    //     review: data.Review.rich_text[0]?.plain_text ?? null,
    //   }));
    // });
  }
}
