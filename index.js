const express = require('express');
const path = require('path');
const logger = require('./logger');

const app = express();

const PORT = 8081

// routes
const home = require('./routes/home');

app.use(express.urlencoded({
	extended: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(home);

app.listen(PORT, () => {
    logger.log(`Website was started on port ${PORT}.`);
});