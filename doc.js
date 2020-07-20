const express = require('express');

const app = express();
const port = 3000;
const logger = require('./src/logger');

app.use(express.static('doc'));

app.listen(port, () => logger.info(`App started and listening on port ${port}`));
