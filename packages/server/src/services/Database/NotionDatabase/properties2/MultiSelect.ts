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
  selectedOptions?: Option[];
}

export class MultiSelect<Name extends string> implements Property<Name, 'multi_select'> {
  readonly type = 'multi_select';
  readonly id: string | undefined;
  readonly name: Name;
  readonly selectedOptions: Option[] | undefined;
  readonly options: Option[] | undefined;

  constructor({ id, name, options, selectedOptions }: Config<Name>) {
    this.name = name;
    this.id = id;
    this.options = options;
    this.selectedOptions = selectedOptions;
  }

  toColumn() {
    return { [this.name]: { multi_select: this.selectedOptions!.map(({ name }) => ({ name })) } };
  }
}
