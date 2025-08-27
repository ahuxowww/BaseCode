import type {StateStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const zustandStorage: StateStorage = {
  getItem: name => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return mmkvStorage.delete(name);
  },
  setItem: (name, value) => {
    return mmkvStorage.set(name, value);
  },
};
