const express = require('express');
const app = express();
const path = require('path');

var router = require('./routes/router');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', router.create);

app.listen(3000, () => console.log('Listening on port 3000'))
