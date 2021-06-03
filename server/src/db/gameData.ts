import fs from 'fs';
import { Deck } from '../interfaces/game';

const rawdata = fs.readFileSync('tools/deck.json');
export const deck: Deck = JSON.parse(rawdata.toString());

/*
Example Deck
------------

const deck: Deck = {
  memeCards: [
    {
      name: 'meme0.jpg',
      cardId: 'M0',
    },
    ...
  ],
  whiteCards: [
    {
      text: 'When your heart says yes but the restraining order says no',
      cardId: 'C0',
    },
    ...
  ],
};
*/
