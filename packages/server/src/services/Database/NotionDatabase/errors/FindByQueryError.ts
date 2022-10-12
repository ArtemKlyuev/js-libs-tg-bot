export class FindByQueryError extends Error {
  constructor(query: string) {
    const message = `Не найдено библиотеки по запросу "${query}"`;

    super(message);

    this.name = 'FindByQueryError';
  }
}
