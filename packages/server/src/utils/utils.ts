import { Db } from 'mongodb';
import { RedditMeme } from '../db';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ID_LENGTH = 6;
const UNIQUE_RETRIES = 9999;

export function generateUniqueId(previous?: string[]): string {
  previous = previous || [];
  let retries = 0;
  let id: string;

  while (!id && retries < UNIQUE_RETRIES) {
    id = generate();
    if (previous.indexOf(id) !== -1) {
      id = null;
      retries++;
    }
  }

  return id;
}

function generate(): string {
  let rtn = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
}

export const getRandomRedditMeme = async (db: Db): Promise<string> => {
  const randomMeme = (
    await db
      .collection('redditPosts')
      .aggregate<RedditMeme>([{ $sample: { size: 1 } }])
      .toArray()
  )[0];

  return randomMeme.url;
};

export const getRandomElementsNonDestructive = <T>(arr: Array<T>, n: number): Array<T> => {
  // src: https://stackoverflow.com/a/19270021/9088626
  let len = arr.length;
  const result = new Array<T>(n),
    taken = new Array(len);

  if (n > len) throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

// Array Extension
declare global {
  interface Array<T> {
    cycle(fn: (value: T) => unknown): T;
    removeAndReturn(fn: (value: T) => unknown): T;
    popRandom(): T;
    random(): T;
  }
}

if (!Array.prototype.cycle) {
  Array.prototype.cycle = function <T>(fn: (this: T[], value: T) => unknown) {
    const i = this.findIndex(fn);
    if (i > -1) return this[(i + 1) % this.length];
    return undefined;
  };
}

if (!Array.prototype.removeAndReturn) {
  Array.prototype.removeAndReturn = function <T>(fn: (this: T[], value: T) => unknown) {
    const i = this.findIndex(fn);
    if (i > -1) return this.splice(i, 1)[0];
    else return undefined;
  };
}

if (!Array.prototype.popRandom) {
  Array.prototype.popRandom = function () {
    const i = (Math.random() * this.length) | 0;
    return this.splice(i, 1)[0];
  };
}

if (!Array.prototype.random) {
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };
}
