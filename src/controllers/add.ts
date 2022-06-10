import { left, mergeInMany } from '@sweet-monads/either';

import { DatabaseRepository } from '@repository';
import { GithubApi, NPMRegistry } from '@services';

interface Dependencies {
  // dbRepository: DatabaseRepository;
  github: typeof GithubApi;
  NPMRegistry: typeof NPMRegistry;
}

interface Library {
  name: string;
  platform: string;
  tags: string[];
  status: string;
  rating?: string;
  review?: string;
}

export const addController = async (
  // { dbRepository, NPMRegistry, github }: Dependencies,
  { NPMRegistry, github }: Dependencies,
  library: Library,
): Promise<void> => {
  const npm = await NPMRegistry.getPackageInfo(library.name);
  const downloads = (
    await NPMRegistry.getPackageDownloads(library.name, { point: 'last-week' })
  ).mapRight(({ downloads }) => downloads);

  const a = (
    await npm
      .mapRight((lib) => {
        const { owner, name } = lib.gitRepository;
        console.log(owner, name);

        return { owner, name };
      })
      .asyncMap(async ({ owner, name }) => {
        if (!owner || !name) {
          return left(new Error('No owner or name'));
        }

        const res = await github.getRepoInfo(owner, name);

        return res.mapRight(({ html_url, stargazers_count }) => {
          return { ...library, repoURL: html_url, stars: stargazers_count };
        });
      })
  ).join();

  // a.mapLeft((error) => {
  //     console.log('npm ошибка', error);
  //   });

  const c = mergeInMany([a, downloads]);

  c.mapRight((res) => {}).mapLeft((err) => {});

  // const eitherLibrary = await dbRepository.searchLibrary(searchQuery);

  // return eitherLibrary;
};
