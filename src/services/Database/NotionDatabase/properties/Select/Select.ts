import { Property } from '../Propety';

import { SelectAddSignature, SelectSearchSignature, SelectSignature } from './types';

interface Config {
  id?: string;
  name: string;
  options?: object[];
  selectedOption?: object;
}

export class Select<Name extends string> implements Property<Name, 'select'> {
  readonly type = 'select';
  readonly id: string | undefined;
  readonly selectedOption: string | undefined;
  readonly options: string[] | undefined;
  // readonly rawData: SelectSignature | SelectAddSignature | SelectSearchSignature;

  constructor(
    readonly name: string,
    properties: SelectSignature | SelectAddSignature | SelectSearchSignature,
  ) {
    // this.rawData = properties;

    if ('id' in properties) {
      this.id = properties.id;
    }

    if ('select' in properties && 'options' in properties.select!) {
      this.options = properties.select.options.map(({ name }) => name);
    }
  }
}
