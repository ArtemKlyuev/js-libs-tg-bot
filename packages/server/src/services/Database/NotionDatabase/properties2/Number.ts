import { Property } from './Propety';

interface Config<Name> {
  id?: string;
  name: Name;
  number: number;
}

export class Number<Name extends string> implements Property<Name, 'number'> {
  readonly type = 'number';
  readonly id: string | undefined;
  readonly name: Name;
  readonly number: number;

  constructor({ id, name, number }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.number = number;
  }

  toColumn() {
    return { [this.name]: { number: this.number } };
  }
}
