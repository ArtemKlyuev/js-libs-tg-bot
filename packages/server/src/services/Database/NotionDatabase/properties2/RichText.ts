import { Property } from './Propety';

interface Config<Name> {
  id?: string;
  name: Name;
  text: string;
}

export class RichText<Name extends string> implements Property<Name, 'rich_text'> {
  readonly type = 'rich_text';
  readonly id: string | undefined;
  readonly name: Name;
  readonly text: string;

  constructor({ id, name, text }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.text = text;
  }

  toColumn() {
    return { [this.name]: { rich_text: [{ text: { content: this.text } }] } };
  }
}
