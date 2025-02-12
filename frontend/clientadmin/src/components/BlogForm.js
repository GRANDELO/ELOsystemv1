import React, { useState, useEffect, useRef, useCallback } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // This is optional if you're loading via CDN in index.html
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPost, updatePost, fetchPostById } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/BlogForm.css";

// Ensure highlight.js is available globally for Quill's syntax module.
if (typeof window !== "undefined") {
  window.hljs = hljs;
}

// Dummy upload function – replace with your actual API call.
const uploadToCloudinary = async (file) => {
  console.log("Uploading file:", file);
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const placeholderUrl = "https://via.placeholder.com/300";
        console.log("File uploaded, returning URL:", placeholderUrl);
        resolve(placeholderUrl);
      }, 1500);
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return "";
  }
};

const BlogForm = ({ isEditing }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const quillRef = useRef(null);

  // Load draft from localStorage if available
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, []);

  // Autosave draft every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("blogDraft", content);
      console.log("Draft autosaved");
    }, 10000);
    return () => clearInterval(interval);
  }, [content]);

  // If editing, fetch the existing post data
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
    localStorage.removeItem("blogDraft");
    navigate("/blogs");
  };

  // Custom image handler to upload images and insert the URL into the editor
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        if (!url) {
          console.error("Image upload failed, no URL returned");
          return;
        }
        console.log("Inserting image with URL:", url);
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1, "user");
        setContent(editor.root.innerHTML);
      }
    };
  }, []);

  // Enhanced toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    syntax: true,
    // imageResize: { parchment: ReactQuill.Quill.import("parchment") },
  };

  const formats = [
    "header",
    "font",
    "size",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">
        {isEditing ? "Edit Post" : "Create a New Post"}
      </h2>
      <div className="toggle-preview">
        <button type="button" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? "Switch to Edit Mode" : "Preview"}
        </button>
      </div>
      <form className="blog-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="blog-form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {previewMode ? (
          <div
            className="blog-preview"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Compose your blog post here..."
            className="blog-form-quill"
          />
        )}
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
