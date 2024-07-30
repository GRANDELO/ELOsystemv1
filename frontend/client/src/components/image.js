import React from 'react';
import ImageList from './ImageList';
import ImageUpload from './ImageUpload';

const mmm = () => {
  const handleUpload = () => {
    // Trigger a refresh of the image list
    // Assuming ImageList is re-rendered automatically, you might want to use state management
    // to control this better if necessary.
   window.location.reload();
  };

  return (
    <div>
      <h1>Image Upload and Display</h1>
      <ImageUpload onUpload={handleUpload} />
      <ImageList />
    </div>
  );
};

export default mmm;
