import { useEffect, useState } from "react";
import { fetchPosts } from "../api";
import { Link } from "react-router-dom";
import './styles/BlogList.css'; 

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    getPosts();
  }, []);

  return (
    <div className="page-container">
      <header className="blog-header">
        <h1 className="blog-title">Welcome to Our Blog</h1>
        <p className="blog-subtitle">Stay updated with the latest posts and insights</p>
      </header>

      <main className="blog-list-container">
        <div className="top-bar">
          <h2 className="blog-list-title">Latest Blog Posts</h2>
          <Link to="/create" className="create-post-link">➕ Create New Post</Link>
        </div>

        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="blog-post">
              <h3 className="blog-post-title">{post.title}</h3>
              <p className="blog-post-content">{post.content.substring(0, 100)}...</p>
              <Link to={`/blog/${post._id}`} className="read-more-link">Read More →</Link>
            </div>
          ))
        ) : (
          <p className="no-posts">No posts available. Be the first to write one!</p>
        )}
      </main>

      <footer className="blog-footer">
        <p>&copy; {new Date().getFullYear()} Blog Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BlogList;
