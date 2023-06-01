require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/flights', async (req, res) => {
    try {
        const aviationUrl = "http://api.aviationstack.com/v1/flights?access_key=" + process.env.AVIATIONSTACK_ACCESS_KEY!! + "&dep_iata=YYC&arr_iata=SEA"
        const aviationResponse = await axios.get(aviationUrl, {timeout: 30000})
        res.status(201).json(aviationResponse.data.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flights' + error});
    }
});

module.exports = router 
export {};