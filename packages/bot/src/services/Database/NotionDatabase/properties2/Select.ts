import { Property } from './Propety';

interface Option {
  name: string;
  id?: string;
  color?: string;
}

interface Config<Name> {
  id?: string;
  name: Name;
  options?: Option[];
  selectedOption?: Option;
}

export class Select<Name extends string> implements Property<Name, 'select'> {
  readonly type = 'select';
  readonly id: string | undefined;
  readonly name: Name;
  readonly selectedOption: Option | undefined;
  readonly options: Option[] | undefined;

  constructor({ id, name, options, selectedOption }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.options = options;
    this.selectedOption = selectedOption;
  }

  toColumn() {
    return { [this.name]: { select: { name: this.selectedOption!.name } } };
  }
}
