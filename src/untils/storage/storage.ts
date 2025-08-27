import {MMKV} from 'react-native-mmkv';

export const mmkvStorage = new MMKV();

export const reduxStorage: Storage = {
  getItem: key => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    mmkvStorage.delete(key);
    return Promise.resolve();
  },
  setItem: (key, value) => {
    mmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
};
/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | undefined {
  return mmkvStorage.getString(key);
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    mmkvStorage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load(key: string): any {
  const data = mmkvStorage.getString(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(
  key: string,
  value: ArrayBuffer | boolean | number | string,
): boolean {
  try {
    mmkvStorage.set(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    mmkvStorage.delete(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    mmkvStorage.clearAll();
  } catch {}
}
