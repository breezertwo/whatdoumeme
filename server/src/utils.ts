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

export function removeItemAndReturn<T>(arr: Array<T>, fn: (value: T, index: number) => unknown): T {
  const i = arr.findIndex(fn);
  if (i > -1) {
    return arr.splice(i, 1)[0];
  }
}

export function popRandom<T>(array: Array<T>): T {
  const i = (Math.random() * array.length) | 0;
  return array.splice(i, 1)[0];
}

// Array Extension
declare global {
  interface Array<T> {
    cycle(fn: (value: T, index: number) => unknown): T;
  }
}

if (!Array.prototype.cycle) {
  Array.prototype.cycle = function <T>(fn: (this: T[], value: T, index: number) => unknown) {
    const i = this.findIndex(fn);
    if (i === -1) return undefined;
    return this[(i + 1) % this.length];
  };
}
