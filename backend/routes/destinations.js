const express = require('express');
const router = express.Router();
const { groupProductsByOriginAndDestination } =  require('../controllers/location_pac');

router.get('/destinations', async (req, res) => {
    try {
      const groupedProducts = await groupProductsByOriginAndDestination();
      res.status(200).json({ data: groupedProducts });
    } catch (error) {
      console.error('Error fetching destinations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router