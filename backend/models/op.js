const ProductSchema = new mongoose.Schema({
    model: { type: String, required: true, trim: true },
    make: { type: String, required: true, trim: true },
    yearOfManufacture: { 
      type: Number, 
      required: true, 
      min: 1900, 
      max: new Date().getFullYear() 
    },
    specifications: [
      { key: { type: String }, value: { type: String } } // Dynamic key-value pairs
    ],
    description: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 5000 // Longer descriptions for advanced use cases
    },
    features: { 
      type: [String], 
      default: [] // List of unique selling points or highlights 
    },
    technicalDetails: { 
      type: Map, 
      of: String, 
      default: {} // Key-value pairs for advanced technical details
    },
    category: { type: String, required: true }, // Product category
    subCategory: { type: String, default: null }, // Optional sub-category
    tags: { type: [String], default: [] }, // Keywords for SEO and search filters
    price: { type: Number, required: true, min: 0 },
    discount: { 
      type: {
        amount: { type: Number, min: 0, default: 0 }, 
        type: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' }
      }, 
      default: null 
    },
    stock: { type: Number, required: true, min: 0 }, // Inventory count
    dimensions: { 
      type: {
        height: { type: Number, default: null },
        width: { type: Number, default: null },
        depth: { type: Number, default: null },
        weight: { type: Number, default: null }
      },
      default: null 
    },
    images: { type: [String], default: [] }, // URLs to product images
    videos: { type: [String], default: [] }, // URLs to product videos
    manufacturerDetails: { 
      type: {
        name: { type: String },
        contactInfo: { type: String }
      },
      default: null 
    },
    ratings: { 
      type: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
      },
      default: null 
    },
    reviews: { 
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          comment: { type: String },
          rating: { type: Number, min: 1, max: 5 },
          date: { type: Date, default: Date.now }
        }
      ], 
      default: []
    },
    availability: { 
      type: String, 
      enum: ['in stock', 'out of stock', 'pre-order'], 
      default: 'in stock' 
    },
    returnPolicy: { type: String, default: 'No returns' }, // Text for policy details
    warranty: { type: String, default: null }, // Warranty info
    sellerDetails: { 
      type: {
        name: { type: String },
        contact: { type: String },
        location: { type: String }
      },
      default: null 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  