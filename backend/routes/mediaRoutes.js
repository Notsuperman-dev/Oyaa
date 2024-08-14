const express = require('express');
const mediaController = require('../controllers/mediaController');
const router = express.Router();

router.get('/gifs', mediaController.getGifs);
router.get('/stickers', mediaController.getStickers);

module.exports = router;
