const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    const renderData = {};
    res.render('home', renderData);
});

module.exports = router;