import { LocalStorage, LocalStorageForEachCallback } from './types';

export const LocalStorageService: LocalStorage = class LocalStorageService {
  static get<T = string>(key: string, shouldParse?: boolean): T | null {
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

  static set(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  static has(key: string): boolean {
    return key in localStorage;
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }

  static findKeyByIndex(index: number): string | null {
    return localStorage.key(index);
  }

  static forEach(callback: LocalStorageForEachCallback): void {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)!;
      const value = this.get<string>(key)!;

      callback(key, value, i);
    }
  }

  static entries(): [string, string][] | never[] {
    if (!localStorage.length) {
      return [];
    }

    const result: [string, string][] = [];

    this.forEach((key, value) => result.push([key, value]));

    return result;
  }

  static get size(): number {
    return localStorage.length;
  }
};
