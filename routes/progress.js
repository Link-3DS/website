const { Router } = require('express');

const router = Router();

const { getGithubProjectsCache } = require('../cache');

router.get('/progress', async (req, res) => {
    try {
        const progressLists = await getGithubProjectsCache();

        const renderData = {
            progressLists: progressLists
        };
        
        res.render('progress', renderData);
    } catch (error) {
        console.error('Error retrieving GitHub projects:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;