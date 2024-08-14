const mediaService = require('../services/mediaService');

// Fetch GIFs
async function getGifs(req, res) {
    const { query } = req.query;
    try {
        const gifs = await mediaService.fetchGifs(query);
        res.json(gifs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GIFs' });
    }
}

// Fetch Stickers
async function getStickers(req, res) {
    const { query } = req.query;
    try {
        const stickers = await mediaService.fetchStickers(query);
        res.json(stickers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stickers' });
    }
}

module.exports = {
    getGifs,
    getStickers,
};
