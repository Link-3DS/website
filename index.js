const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const config = require('./config.json');

const app = express();

// routes
const home = require('./routes/home');
const progress = require('./routes/progress');
const faq = require('./routes/faq');
const account = require('./routes/account');

app.use(express.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(home);
app.use(progress);
app.use(faq);
app.use('/account', account);

app.listen(config.port, () => {
    logger.log(`website was started on port ${config.port}.`);
});