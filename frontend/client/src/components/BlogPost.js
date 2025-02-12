import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../api";
import "./styles/BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      const data = await fetchPostById(id);
      setPost(data);
    };
    getPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      navigate("/");
    }
  };

  if (!post)
    return <h2 className="loading">⏳ Loading post, please wait...</h2>;

  return (
    <div className="post-container">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-author">
          ✍️ <strong>By:</strong> {post.author}
        </p>
      </header>

      <main className="post-content">
        <p>{post.content}</p>
      </main>

      <div className="post-actions">
        <Link to={`/edit/${id}`} className="edit-btn">✏️ Edit</Link>
        <button onClick={handleDelete} className="delete-btn">🗑️ Delete</button>
        <Link to="/blogs" className="back-btn">⬅ Back</Link>
      </div>
    </div>
  );
};

export default BlogPost;
