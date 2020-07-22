const port = 8010;
const Application = require('./src/app');

const app = new Application();

app.run(port);
