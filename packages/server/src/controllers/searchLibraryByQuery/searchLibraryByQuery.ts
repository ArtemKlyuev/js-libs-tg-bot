import { DatabaseRepository, SearchResult } from '@repository';

interface NameToConfig {
  [name: string]: {
    order: number;
  };
}

const nameToConfig: NameToConfig = {
  name: { order: 1 },
  platform: { order: 2 },
  summary: { order: 3 },
  'repo link': { order: 4 },
  tags: { order: 5 },
  'npm weekly downloads': { order: 6 },
  'github stars': { order: 7 },
  status: { order: 8 },
  'score /5': { order: 9 },
  review: { order: 10 },
};

export const searchLibraryByQuery = async (
  // TODO: add filters
  query: string,
  databaseRepository: DatabaseRepository,
): Promise<SearchResult> => {
  const eitherLibrary = await databaseRepository.searchLibraries(query);

  return eitherLibrary.mapRight((libs) =>
    libs.map((props) =>
      props.sort((propA, propB) => {
        const orderA = nameToConfig[propA.name.toLowerCase()].order;
        const orderB = nameToConfig[propB.name.toLowerCase()].order;

        return orderA - orderB;
      }),
    ),
  );
};
