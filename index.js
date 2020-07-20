const port = 8010;

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const express = require('./src/app');

const buildSchemas = require('./src/schemas');

const logger = require('./src/logger');

db.serialize(() => {
  buildSchemas(db);

  const app = express(db);

  app.listen(port, () => logger.log(`App started and listening on port ${port}`));
});
