interface PropertyInfo {
  id: string | number;
  type: string;
  name: string;
  value: string | number | boolean | null;
}

interface PropertyA extends PropertyInfo {
  isomorphicName: string;
  setValue: (value: string | number | boolean | null) => void;
}

export class Property implements PropertyA {
  readonly #id: string | number;
  readonly #type: string;
  readonly #name: string;
  readonly #isomorphicName: string;
  #value: string | number | boolean | null;

  constructor(data: PropertyInfo) {
    for (const key in data) {
      const typedKey = key as keyof PropertyInfo;
      // @ts-expect-error
      this['#' + typedKey] = data[typedKey];
    }

    this.#isomorphicName = this.#name.toLowerCase();
  }

  setValue(value: string | number | boolean | null): void {
    this.#value = value;
  }
}
