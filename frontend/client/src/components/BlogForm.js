import { useState, useEffect } from "react";
import { createPost, updatePost, fetchPostById } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import './styles/BlogForm.css'; // Add the custom CSS

const BlogForm = ({ isEditing }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEditing) {
      const getPost = async () => {
        const data = await fetchPostById(id);
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
      };
      getPost();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content, author };

    if (isEditing) {
      await updatePost(id, postData);
    } else {
      await createPost(postData);
    }
    
    navigate("/blogs");
  };

  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">{isEditing ? "Edit Post" : "Create a New Post"}</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="blog-form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="blog-form-textarea"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          className="blog-form-input"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit" className="blog-form-button">
          {isEditing ? "Update" : "Post"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
