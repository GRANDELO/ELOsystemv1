import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance'; // Replace with your Axios setup
import Dropzone from 'react-dropzone';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };


  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    description: {
      model: '',
      make: '',
      yearOfManufacture: '',
      specifications: [{ key: '', value: '' }],
      pdescription: '',
      features: [''],
      technicalDetails: {},
      tags: [''],
      dimensions: { height: '', width: '', depth: '', weight: '' },
      manufacturerDetails: { name: '', contactInfo: '' },
      warranty: '',
    },
  });

  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const token = sessionStorage.getItem('userToken');
          const response = await axiosInstance.get(`/products/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFormData(response.data.product);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [parent, child, index] = name.split('.');
    if (parent === 'description') {
      if (index !== undefined) {
        const updatedArray = [...formData.description[child]];
        updatedArray[index] = value;
        setFormData({
          ...formData,
          description: { ...formData.description, [child]: updatedArray },
        });
      } else {
        setFormData({
          ...formData,
          description: { ...formData.description, [child]: value },
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: [...prev.description[field], ''],
      },
    }));
  };

  const handleRemoveField = (field, index) => {
    const updatedArray = formData.description[field].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [field]: updatedArray },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('userToken');
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', JSON.stringify(formData.description));
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (id) {
        await axiosInstance.put(`/products/products/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Product updated successfully');
      } else {
        await axiosInstance.post(`/products`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Product created successfully');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error uploading product:', error.message);
      setMessage(`Error uploading product: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Price:
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>
      <label>
          Category:
          <select id="category" name="category" value={formData.category} onChange={handleChange} required >
            {/* Category options */}
            <optgroup label="Electronics">
              <option value="mobile-phones">Mobile Phones</option>
              <option value="computers">Computers</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="audio-video">Audio & Video</option>
              <option value="wearable-technology">Wearable Technology</option>
            </optgroup>
            <optgroup label="Fashion">
              <option value="mens-clothing">Men's Clothing</option>
              <option value="womens-clothing">Women's Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
              <option value="jewelry">Jewelry</option>
            </optgroup>
            <optgroup label="Home & Kitchen">
              <option value="furniture">Furniture</option>
              <option value="kitchenware">Kitchenware</option>
              <option value="home-decor">Home Decor</option>
              <option value="bedding">Bedding</option>
            </optgroup>
            <optgroup label="Books & Media">
              <option value="books">Books</option>
              <option value="movies-tv">Movies & TV</option>
              <option value="music">Music</option>
              <option value="video-games">Video Games</option>
            </optgroup>
            <optgroup label="Toys & Games">
              <option value="action-figures">Action Figures</option>
              <option value="educational-toys">Educational Toys</option>
              <option value="board-games">Board Games</option>
              <option value="puzzles">Puzzles</option>
              <option value="outdoor-toys">Outdoor Toys</option>
            </optgroup>
            <optgroup label="Sports & Outdoors">
              <option value="fitness-equipment">Fitness Equipment</option>
              <option value="outdoor-gear">Outdoor Gear</option>
              <option value="sportswear">Sportswear</option>
              <option value="cycling">Cycling</option>
            </optgroup>
            <optgroup label="Beauty & Personal Care">
              <option value="skincare">Skincare</option>
              <option value="haircare">Haircare</option>
              <option value="makeup">Makeup</option>
              <option value="personal-hygiene">Personal Hygiene</option>
            </optgroup>
            <optgroup label="Automotive">
              <option value="car-parts">Car Parts</option>
              <option value="accessories">Accessories</option>
              <option value="tools-equipment">Tools & Equipment</option>
              <option value="maintenance-care">Maintenance & Care</option>
            </optgroup>
            <optgroup label="Health">
              <option value="medical-supplies">Medical Supplies</option>
              <option value="wellness">Wellness</option>
              <option value="personal-care">Personal Care</option>
            </optgroup>
            <optgroup label="Grocery">
              <option value="fresh-produce">Fresh Produce</option>
              <option value="packaged-foods">Packaged Foods</option>
              <option value="dairy-products">Dairy Products</option>
              <option value="bakery">Bakery</option>
            </optgroup>
            <optgroup label="Office Supplies">
              <option value="stationery">Stationery</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
            </optgroup>
            <optgroup label="Arts & Crafts">
              <option value="painting-supplies">Painting Supplies</option>
              <option value="craft-materials">Craft Materials</option>
              <option value="sewing-knitting">Sewing & Knitting</option>
            </optgroup>
          </select>
        </label>
      <fieldset>
        <legend>Description</legend>
        <label>
          Model:
          <input
            type="text"
            name="description.model"
            value={formData.description.model}
            onChange={handleChange}
          />
        </label>
        <label>
          Make:
          <input
            type="text"
            name="description.make"
            value={formData.description.make}
            onChange={handleChange}
          />
        </label>
        <label>
          Year of Manufacture:
          <input
            type="text"
            name="description.yearOfManufacture"
            value={formData.description.yearOfManufacture}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <legend>Specifications</legend>
          {formData.description.specifications.map((spec, index) => (
            <div key={index}>
              <input
                type="text"
                name={`description.specifications.${index}.key`}
                placeholder="Key"
                value={spec.key}
                onChange={handleChange}
              />
              <input
                type="text"
                name={`description.specifications.${index}.value`}
                placeholder="Value"
                value={spec.value}
                onChange={handleChange}
              />
              <button type="button" onClick={() => handleRemoveField('specifications', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('specifications')}>
            Add Specification
          </button>
        </fieldset>
        <label>
          Product Description:
          <textarea
            name="description.pdescription"
            value={formData.description.pdescription}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Features:
          {formData.description.features.map((feature, index) => (
            <div key={index}>
              <input
                type="text"
                name={`description.features.${index}`}
                value={feature}
                onChange={handleChange}
              />
              <button type="button" onClick={() => handleRemoveField('features', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('features')}>
            Add Feature
          </button>
        </label>
        <label>
          Tags:
          {formData.description.tags.map((tag, index) => (
            <div key={index}>
              <input
                type="text"
                name={`description.tags.${index}`}
                value={tag}
                onChange={handleChange}
              />
              <button type="button" onClick={() => handleRemoveField('tags', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('tags')}>
            Add Tag
          </button>
        </label>
        <fieldset>
          <legend>Dimensions</legend>
          <label>
            Height:
            <input
              type="text"
              name="description.dimensions.height"
              value={formData.description.dimensions.height}
              onChange={handleChange}
            />
          </label>
          <label>
            Width:
            <input
              type="text"
              name="description.dimensions.width"
              value={formData.description.dimensions.width}
              onChange={handleChange}
            />
          </label>
          <label>
            Depth:
            <input
              type="text"
              name="description.dimensions.depth"
              value={formData.description.dimensions.depth}
              onChange={handleChange}
            />
          </label>
          <label>
            Weight:
            <input
              type="text"
              name="description.dimensions.weight"
              value={formData.description.dimensions.weight}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Manufacturer Details</legend>
          <label>
            Name:
            <input
              type="text"
              name="description.manufacturerDetails.name"
              value={formData.description.manufacturerDetails.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Contact Info:
            <input
              type="text"
              name="description.manufacturerDetails.contactInfo"
              value={formData.description.manufacturerDetails.contactInfo}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <label>
          Warranty:
          <input
            type="text"
            name="description.warranty"
            value={formData.description.warranty}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <div className="image-upload">
        <label>Upload Images</label>
        <Dropzone onDrop={handleDrop} accept="image/*" multiple>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>
          )}
        </Dropzone>

        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="preview">
              <img src={image.preview} alt={`preview ${index}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ProductForm;
