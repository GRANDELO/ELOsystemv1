const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String }, // URL for an image
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogSchema);
