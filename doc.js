'use strict';

const express = require('express');
const app = express();
const port = 3000;


app.use(express.static('doc'));

app.listen(port, () => console.log(`App started and listening on port ${port}`));
