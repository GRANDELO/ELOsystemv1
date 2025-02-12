const BlogPost = require("../models/BlogPost");

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single post
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post updated", updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
