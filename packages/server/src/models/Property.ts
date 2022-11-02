type Value = string[] | string | number | null;

interface PropertyInfo {
  readonly id: string | number;
  readonly type: string;
  readonly name: string;
  readonly value: Value;
}

interface PropertyHandlers {
  setValue: (value: Value) => void;
}

export type DbProperty = PropertyInfo & PropertyHandlers;

export class Property implements DbProperty {
  readonly #id: string | number;
  readonly #type: string;
  readonly #name: string;
  #value: Value;

  constructor({ id, name, type, value }: PropertyInfo) {
    this.#id = id;
    this.#name = name;
    this.#type = type;
    this.#value = value;
  }

  setValue(value: Value): void {
    this.#value = value;
  }

  get id(): string | number {
    return this.#id;
  }

  get type(): string {
    return this.#type;
  }

  get name(): string {
    return this.#name;
  }

  get value(): Value {
    return this.#value;
  }
}
