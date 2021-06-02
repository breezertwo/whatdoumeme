const csv = require('csv-parser');
const fs = require('fs');

const cardsArray = [];

const emptyDeck = {
  memeCards: [],
  whiteCards: [],
};

fs.createReadStream('cardsRawData.csv')
  .pipe(csv())
  .on('data', (row) => {
    cardsArray.push({ text: row.CardTexts, cardId: '' });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    emptyDeck.whiteCards = cardsArray;
    let data = JSON.stringify(emptyDeck);
    fs.writeFileSync('deck.json', data);
  });
