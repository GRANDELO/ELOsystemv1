// src/App.js
import React from 'react';
import './App.css';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';

function App() {
  const [updateList, setUpdateList] = React.useState(false);

  const handleUploadSuccess = () => {
    setUpdateList(!updateList);
  };

  return (
    <div className="App">
      <h1>File Upload</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <FileList key={updateList} />
    </div>
  );
}

export default App;
