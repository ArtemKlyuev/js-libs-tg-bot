import { LocalStorage, LocalStorageForEachCallback } from './types';

export class LocalStorageService implements LocalStorage {
  get<T = string>(key: string, shouldParse?: boolean): T | null {
    const value = localStorage.getItem(key);

    if (!shouldParse) {
      return value as T | null;
    }

    try {
      const parsedValue = JSON.parse(value!) as T;
      return parsedValue;
    } catch (error) {
      console.error(`LocalStorage Service: Cannot parse value with key "${key}"`);
      return null;
    }
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  findKeyByIndex(index: number): string | null {
    return localStorage.key(index);
  }

  forEach(callback: LocalStorageForEachCallback): void {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)!;
      const value = this.get<string>(key)!;

      callback(key, value, i);
    }
  }

  entries(): [string, string][] | never[] {
    if (!localStorage.length) {
      return [];
    }

    const result: [string, string][] = [];

    this.forEach((key, value) => result.push([key, value]));

    return result;
  }

  get length(): number {
    return localStorage.length;
  }
}
