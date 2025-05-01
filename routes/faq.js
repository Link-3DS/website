const { Router } = require('express');

const router = Router();

router.get('/faq', (req, res) => {
    const renderData = {};
    res.render('faq', renderData);
});

module.exports = router;