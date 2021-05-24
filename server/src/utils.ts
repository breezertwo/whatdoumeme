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

export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
