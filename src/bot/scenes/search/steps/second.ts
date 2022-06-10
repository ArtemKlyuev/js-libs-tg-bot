import { Scene } from '../../Scene';

import { searchController } from '@controllers';
import { LibraryData } from '@repository';

import { notionDbRepository } from '../../../bot';

class LibraryView {
  readonly #libraryData: Record<string, string | number | null>;

  constructor(rawLibraryData: LibraryData) {
    this.#libraryData = {
      ...rawLibraryData,
      'NPM weekly downloads': this.#normalizeNPMDownloads(rawLibraryData['NPM weekly downloads']),
      Tags: this.#createTags(rawLibraryData.Tags),
    };
  }

  #normalizeNPMDownloads(downloads: number | null): string | null {
    if (downloads === null) {
      return null;
    }

    return new Intl.NumberFormat().format(downloads);
  }

  #normalizeTag(tag: string): string {
    return tag.replace(/(\s|')/g, '_');
  }

  #createTags(tags: string[]): string {
    return tags.map((tag) => `#${this.#normalizeTag(tag)}`).join(', ');
  }

  toString(): string {
    return Object.entries(this.#libraryData)
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n\n');
  }
}

export const secondStep = Scene.createStep();

secondStep.on('text', async (ctx) => {
  const eitherSearchResult = await searchController(notionDbRepository, ctx.message.text);

  await ctx.reply('Ищу...');

  await eitherSearchResult
    .mapRight((libraries) => libraries.map((library) => new LibraryView(library).toString()))
    .mapLeft((error) => ctx.reply(error.message))
    .asyncMap(async (libraries) => {
      const replies = libraries.map((library) =>
        ctx.reply(library, { disable_web_page_preview: true }),
      );

      await Promise.all(replies);
    });

  await ctx.reply('Готово!');

  return await ctx.scene.leave();
});
