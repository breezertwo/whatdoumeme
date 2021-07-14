/* Quick and dirty intake tool to get from images and card texts to the desired deck.json structure
 * HOWTO: Place images in subdir 'img'
 * Place card text in csv with each card beeing in one row. Make sure to name first row: 'CardTexts'
 * Create subdir 'imgConv'
 * Run 'node .\deckIntake.js'
 */

const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const imgPath = __dirname + '/img/';
const convImgPath = __dirname + '/imgConv/';

const emptyDeck = {
  memeCards: [],
  whiteCards: [],
};

let cardCounter = 0;

const fileDir = fs.readdirSync(imgPath);

fileDir.forEach(async (filename, i) => {
  if (filename.match(/.(jpg|jpeg|png|gif)$/i)) {
    const newFileName = `meme${i}${path.extname(filename)}`;

    await fs.promises.rename(imgPath + filename, convImgPath + newFileName);
    emptyDeck.memeCards.push({ name: newFileName, cardId: `M${i}` });
  } else {
    console.log(`${filename} is not an image`);
  }
});

fs.createReadStream('./cardsRawData.csv')
  .pipe(csv())
  .on('data', (row) => {
    emptyDeck.whiteCards.push({ text: row.CardTexts, cardId: `C${cardCounter++}` });
  })
  .on('end', () => {
    const data = JSON.stringify(emptyDeck);

    fs.writeFileSync('deck.json', data);
    console.log('CSV and IMGs successfully processed');
  });
