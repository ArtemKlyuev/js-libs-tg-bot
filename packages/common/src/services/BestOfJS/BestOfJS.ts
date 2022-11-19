import { HttpRequest } from '../HttpRequest';

import { BestOfJS, Project, Projects } from './types';

export class BestOfJSAPI implements BestOfJS {
  #httpRequest: HttpRequest;

  constructor(httpRequest: HttpRequest) {
    this.#httpRequest = httpRequest;
  }

  getProjects(): Promise<Projects> {
    return this.#httpRequest
      .get<Projects>('https://bestofjs-static-api.vercel.app/projects.json')
      .response.then(({ data }) => data);
  }

  async findByNPMName(name: string): Promise<Project | null> {
    try {
      const { projects } = await this.getProjects();
      // @ts-expect-error it's ok, error is catching
      return projects.find(({ npm }) => name.toLowerCase() === npm.toLowerCase())!;
    } catch (error) {
      console.error(`[BestOfJS]: can't find package by name "${name}"`, error);
      return null;
    }
  }
}
