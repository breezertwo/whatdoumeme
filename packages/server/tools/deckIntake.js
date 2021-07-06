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

const cardsArray = [];
const memesArray = [];

const emptyDeck = {
  memeCards: [],
  whiteCards: [],
};

let cardCounter = 0;

fs.createReadStream('cardsRawData.csv')
  .pipe(csv())
  .on('data', (row) => {
    cardsArray.push({ text: row.CardTexts, cardId: `C${cardCounter++}` });
  })
  .on('end', () => {
    const fileDir = fs.readdirSync(imgPath);

    fileDir.forEach((filename, i) => {
      if (filename.match(/.(jpg|jpeg|png|gif)$/i)) {
        const newFileName = `meme${i}${path.extname(filename)}`;

        fs.renameSync(imgPath + filename, convImgPath + newFileName);
        memesArray.push({ name: newFileName, cardId: `M${i}` });
      } else {
        console.log(`${filename} is not an image`);
      }
    });

    emptyDeck.whiteCards = cardsArray;
    emptyDeck.memeCards = memesArray;

    const data = JSON.stringify(emptyDeck);

    fs.writeFileSync('deck.json', data);
    console.log('CSV and IMGs successfully processed');
  });
