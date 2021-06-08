import fetch from 'node-fetch';

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

export const fetchRandomMeme = async (): Promise<string> => {
  const body = await (await fetch(`https://reddit.com/r/meme/top/.json`)).json();
  const i = (Math.random() * body.data.children.length) | 0;
  const url = body.data.children[i].data.url;
  return url;
};
// Array Extension
declare global {
  interface Array<T> {
    cycle(fn: (value: T) => unknown): T;
    removeAndReturn(fn: (value: T) => unknown): T;
    popRandom(): T;
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
