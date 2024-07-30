import React from 'react';
import ImageList from './ImageList';
import ImageUpload from './ImageUpload';

function Img() {
  const [updateList, setUpdateList] = React.useState(false);

  const handleUploadSuccess = () => {
    setUpdateList(prevState => !prevState);
  };

  return (
    <div>
      <h1>Image Upload and Display</h1>
      <ImageUpload onUpload={handleUploadSuccess} />
      <ImageList updateList={updateList} />
    </div>
  );
}

export default Img;
