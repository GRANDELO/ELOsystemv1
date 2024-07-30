const express = require('express');
const router = express.Router();

// Dummy data for towns and areas (you can fetch this from your DB)
const townsAndAreas = [
  { town: 'Thika', areas: ['Ngoingwa', 'Makongeni', 'Juja'] },
  { town: 'Nairobi', areas: ['Westlands', 'Kilimani', 'Kasarani'] },
  // Add more towns and areas here...
];

router.get('/api/locations', (req, res) => {
  res.json(townsAndAreas);
});

module.exports = router;
