import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../api";
import "./styles/BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        navigate("/blogs");
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete the post. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="loading">⏳ Loading post, please wait...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!post) {
    return <div className="error">Post not found.</div>;
  }

  return (
    <div className="post-container">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">✍️ {post.author}</span>
          {post.createdAt && (
            <span className="post-date">
              🕒 {new Date(post.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>
      <article
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="post-actions">
        <Link to={`/edit/${id}`} className="btn edit-btn">
          ✏️ Edit
        </Link>
        <button onClick={handleDelete} className="btn delete-btn">
          🗑️ Delete
        </button>
        <button onClick={() => navigate(-1)} className="btn back-btn">
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
