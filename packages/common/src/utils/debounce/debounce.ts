import { DebouncedFunc, DebounceSettings } from 'lodash';
import lodashDebounce from 'lodash/debounce';

export type Settings = DebounceSettings;
export type DebouncedFunction<Callback extends (...args: any[]) => any> = DebouncedFunc<Callback>;

export const debounce = lodashDebounce;
