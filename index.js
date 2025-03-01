const express = require('express');
const path = require('path');
const cache = require('./cache');
const logger = require('./logger');
const config = require('./config.json');

const app = express();

// routes
const home = require('./routes/home');
const progress = require('./routes/progress');

app.use(express.urlencoded({
	extended: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(home);
app.use(progress);

app.listen(config.port, () => {
    logger.log(`Website was started on port ${config.port}.`);
});