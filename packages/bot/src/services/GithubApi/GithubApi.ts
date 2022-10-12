import { Octokit } from '@octokit/rest';
import { Either, left, right } from '@sweet-monads/either';

type RepoInfo = Awaited<ReturnType<Octokit['repos']['get']>>['data'];

export class GithubApi {
  static readonly #octokit: Octokit = new Octokit();

  static async getRepoInfo(owner: string, name: string): Promise<Either<Error, RepoInfo>> {
    try {
      const response = await this.#octokit.repos.get({ owner, repo: name });

      return right(response.data);
    } catch (error) {
      return left(error);
    }
  }
}
