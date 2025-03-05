const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');
const NodeCache = require("node-cache");
const { Storage } = require("@google-cloud/storage");

const myCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours
const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET_URL || "grandbucket-83f9f";

async function fetchImages() {
  const [files] = await storage.bucket(BUCKET_NAME).getFiles();
  return files.map(file => file.publicUrl()); // Returns list of image URLs
}

// Function to Get Cached Images
async function getCachedImages(fetchImagesFunction) {
  let cachedImages = myCache.get("images");

  if (!cachedImages) {
      console.log("Fetching fresh images...");
      cachedImages = await fetchImagesFunction();
      myCache.set("images", cachedImages); // Store in cache
  } else {
      console.log("Using cached images...");
  }

  return cachedImages;
}


router.get('/performance/:username', productController.getProductPerformanceByUsername);
//router.post('/products', upload.array('images', 6), productController.createProduct);

// Route to handle uploading of logo and background images
// router.post(
//     '/updateshoplogoUrl',
//     upload.fields([
//       { name: 'logo', maxCount: 1 },
//       { name: 'background', maxCount: 1 },
//     ]),
//     productController.updateshoplogoUrl
//   );

//router.put('/update-images/:username', upload.array('images', 2), productController.updateUserImages); // Expecting 2 images: logo and background

//router.get('/products', productController.getAllProducts);
//router.get('/images/:filename', productController.getImage);
router.get('/products/:id', productController.getNewProductById);
router.patch('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

// Track product searches
router.post('/track', productController.trackProductInteraction);
router.get('/filtered', productController.getFilteredProducts);
router.get('/autocomplete', productController.autocomplete);

// ✅ Route: Cache and Retrieve Product Images
router.get('/products', async (req, res) => {
  try {
    const cachedImages = await getCachedImages();
    const products = await productController.getAllProducts(req, res, cachedImages);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Route: Get Individual Image (Use Cached if Available)
router.get('/images/:filename', async (req, res) => {
  try {
    let cachedImages = myCache.get("images");
    if (cachedImages) {
      const imageUrl = cachedImages.find(url => url.includes(req.params.filename));
      if (imageUrl) {
        return res.redirect(imageUrl);
      }
    }

    // If not cached, fetch from storage
    const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${req.params.filename}`;
    res.redirect(imageUrl);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// ✅ Route: Upload New Product Images and Update Cache
router.post('/products', upload.array('images', 6), async (req, res) => {
  try {
    await productController.createProduct(req, res);

    // Refresh cache after upload
    myCache.del("images");
    await getCachedImages();

  } catch (error) {
    res.status(500).json({ error: "Failed to upload images" });
  }
});

// ✅ Route: Upload Logo & Background and Update Cache
router.post(
  '/updateshoplogoUrl',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      await productController.updateshoplogoUrl(req, res);

      // Refresh cache after logo/background upload
      myCache.del("images");
      await getCachedImages();

    } catch (error) {
      res.status(500).json({ error: "Failed to update shop logo/background" });
    }
  }
);

// ✅ Route: Update User Images and Refresh Cache
router.put('/update-images/:username', upload.array('images', 2), async (req, res) => {
  try {
    await productController.updateUserImages(req, res);

    // Refresh cache after image update
    myCache.del("images");
    await getCachedImages();

  } catch (error) {
    res.status(500).json({ error: "Failed to update user images" });
  }
});
module.exports = router;


