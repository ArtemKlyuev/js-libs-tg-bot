export type LocalStorageForEachCallback = (key: string, value: string, index: number) => void;

export interface LocalStorage {
  get: <T = string>(key: string, shouldParse?: boolean) => T | null;
  set: (key: string, value: any) => void;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  clear: () => void;
  findKeyByIndex: (index: number) => string | null;
  forEach: (callback: LocalStorageForEachCallback, shouldParse?: boolean) => void;
  entries: () => [string, string][] | never[];
  readonly size: number;
}
