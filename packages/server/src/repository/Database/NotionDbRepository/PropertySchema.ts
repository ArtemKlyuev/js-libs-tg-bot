import {
  MultiSelectDbValue,
  NumberDbValue,
  RichTextDbValue,
  SelectDbValue,
  TitleDbValue,
  URLDbValue,
} from '@services/Database';

export interface PropertySchema<DbValue = any> {
  toDbValue: () => DbValue;
}

export class RichText implements PropertySchema<RichTextDbValue> {
  readonly #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  toDbValue(): RichTextDbValue {
    return { rich_text: [{ text: { content: this.#value }, type: 'text' }] };
  }
}

export class Title implements PropertySchema<TitleDbValue> {
  readonly #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  toDbValue(): TitleDbValue {
    return { title: [{ text: { content: this.#value }, type: 'text' }] };
  }
}

export class Number implements PropertySchema<NumberDbValue> {
  readonly #value: number;

  constructor(value: number) {
    this.#value = value;
  }

  toDbValue(): NumberDbValue {
    return { number: this.#value };
  }
}

export class Select implements PropertySchema<SelectDbValue> {
  readonly #value: { name: string };

  constructor(name: string) {
    this.#value = { name };
  }

  toDbValue(): SelectDbValue {
    return { select: this.#value };
  }
}

export class MultiSelect implements PropertySchema<MultiSelectDbValue> {
  readonly #value: { name: string }[];

  constructor(value: string[]) {
    this.#value = value.map((name) => ({ name }));
  }

  toDbValue(): MultiSelectDbValue {
    return { multi_select: this.#value };
  }
}

export class URL implements PropertySchema<URLDbValue> {
  readonly #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  toDbValue(): URLDbValue {
    return { url: this.#value };
  }
}
