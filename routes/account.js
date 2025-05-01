const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
    
});

router.get('/login', (req, res) => {
    res.render('login', {
        errorMessage: null
    });
});

router.post('/login', async (req, res) => {
    
});

router.get('/register', async (req, res) => {
    res.render('register', {
        errorMessage: null
    });
});

router.post('/register', async (req, res) => {
    
});

module.exports = router;