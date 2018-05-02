const express = require('express');
const app = express();
var router = require('./routes/router');

app.use('/', router.create);

app.listen(3000, () => console.log('Listening on port 3000'))
