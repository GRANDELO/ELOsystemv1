import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageList = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h2>Uploaded Images</h2>
      <div>
        {images.map(image => (
          <img
            key={image._id}
            src={image.url}
            alt={image.filename}
            style={{ maxWidth: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageList;
