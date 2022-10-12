import { Property } from './Propety';

interface Config<Name> {
  id?: string;
  name: Name;
  url: string;
}

export class URL<Name extends string> implements Property<Name, 'url'> {
  readonly type = 'url';
  readonly id: string | undefined;
  readonly name: Name;
  readonly url: string;

  constructor({ id, name, url }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.url = url;
  }

  toColumn() {
    return { [this.name]: { url: this.url } };
  }
}
