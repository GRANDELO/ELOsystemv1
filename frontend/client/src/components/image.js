import React from 'react';
import FileList from './FileList';
import FileUpload from './FileUpload';

function Img() {
  const [updateList, setUpdateList] = React.useState(false);

  const handleUploadSuccess = () => {
    setUpdateList(!updateList);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <FileList updateList={updateList} />
    </div>
  );
}

export default Img;
