import { Property } from './Propety';

interface Config<Name> {
  id?: string;
  name: Name;
  title: string;
}

export class Title<Name extends string> implements Property<Name, 'title'> {
  readonly type = 'title';
  readonly id: string | undefined;
  readonly name: Name;
  readonly title: string;

  constructor({ id, name, title }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.title = title;
  }

  toColumn() {
    return { [this.name]: { title: [{ text: { content: this.title } }] } };
  }
}
