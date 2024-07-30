// src/components/FileList.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map(file => (
          <li key={file._id}>
            {file.filename} - <a href={`http://localhost:5000/image/${file.filename}`} target="_blank" rel="noopener noreferrer">View</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
