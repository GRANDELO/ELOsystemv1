const redis = require("redis");
const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


const GCS_BUCKET_URL = process.env.GCS_BUCKET_URL;

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true, 
});

redisClient.connect().catch(console.error);


router.get('/images', async (req, res) => {
   const { filename } = req.query;
   if (!filename) return res.status(400).json({ error: "Filename is required" });

   const imageUrl = `${GCS_BUCKET_URL}/${filename}`;

   try {
    // Check if image exists in Redis cache
    const cachedImage = await redisClient.get(filename);
    if (cachedImage) {
      console.log("Serving from cache");
      return res.send(Buffer.from(cachedImage, "base64"));
    }

    // Fetch image from GCS
    console.log("Fetching from GCS");
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = Buffer.from(response.data).toString("base64");

    // Store in Redis (cache for 24 hours)
    await redisClient.setEx(filename, 86400, imageData);

    res.send(Buffer.from(imageData, "base64"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" });
  }

});

module.exports = router;