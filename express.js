const express = require('express');
const app = express();
const portNumber = 3000;
const sourceDir = __dirname + '/dist';

app.use(express.static(sourceDir));

app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
  console.log(`Serving content from /${sourceDir}/`);
});
