const axios = require('axios');

// Giphy API Configuration
const GIPHY_API_KEY = process.env.GIPHY_API_KEY || 'XIeJDczqwkG81aMbfgcbmdqrZRfVQs75';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

// Tenor API Configuration
const TENOR_API_KEY = process.env.TENOR_API_KEY || 'AIzaSyCtOXsVVRP1Hee_nCVoDenI8EhFFiSZs8o';
const TENOR_BASE_URL = 'https://tenor.googleapis.com/v2';

/**
 * Fetch GIFs from Giphy API
 * @param {string} query - The search query for GIFs.
 * @returns {Promise<Object>} - The API response from Giphy.
 */
async function fetchGifs(query) {
    const url = query
        ? `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=10`
        : `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=10`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching GIFs:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch GIFs');
    }
}

/**
 * Fetch stickers from Tenor API
 * @param {string} query - The search query for stickers.
 * @returns {Promise<Object>} - The API response from Tenor.
 */
async function fetchStickers(query) {
    const url = query
        ? `${TENOR_BASE_URL}/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=10`
        : `${TENOR_BASE_URL}/trending?key=${TENOR_API_KEY}&limit=10`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching stickers:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch stickers');
    }
}

module.exports = {
    fetchGifs,
    fetchStickers,
};
