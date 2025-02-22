import React, { useEffect, useRef, useState } from "react";
import './styles/NewProductFormShell.css';
import axiosInstance from "./axiosInstance";
import { getUsernameFromToken } from "../utils/auth";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import './styles/newproductform.css';
import categories from './categories.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const LinearProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  return (
    <div className="linear-progress-container">
      <div
        className="linear-progress-bar"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const NewProductFormShell = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const lusername = getUsernameFromToken();
  const fileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState(
    {
    name: "",
    category: "",
    subCategory: "",
    price: "",
    description: "",
    username: lusername,
    quantity: "",
    images: [],
    type: "",
    collaborators: [],
    features: [],
    variations: [],
  }
);

  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat.id === newProduct.category
    );
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories);
    } else {
      setSubCategories([]);
    }
  }, [newProduct.category]);

  const handleChange = (e) => {
    const { name, files } = e.target;
  
    if (name === "images") {
      const newImages = Array.from(files);
      // Check if adding these images would exceed the limit
      if (newProduct.images.length + newImages.length > 6) {
        seterror("You can only upload a maximum of 6 images.");
        return;
      }
  
      // Filter out any files that are not valid images
      const validImages = newImages.filter((file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      );
  
      if (validImages.length < newImages.length) {
        seterror("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
  
      // Use functional update for the state
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...validImages],
      }));
  
      // Reset the file input so the same files can be selected again if needed
      fileInputRef.current.value = "";
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [e.target.name]: e.target.value,
      }));
    }
  };
  

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (newProduct.images.length + files.length > 6) {
      seterror("You can only upload a maximum of 6 images.");
      return;
    }
    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (validImages.length < files.length) {
      seterror("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...validImages],
    }));
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };


  const addFeature = () => {
    setNewProduct({
      ...newProduct,
      features: [...newProduct.features, { type: "", specification: "" }],
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = newProduct.features.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, features: updatedFeatures });
  };



  const handleClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    
    setloading(true)
    e.preventDefault();
    const formData = new FormData();
  
    // Serialize the data properly
    Object.keys(newProduct).forEach((key) => {
      if (key === 'images') {
        newProduct.images.forEach((image) => {
          formData.append('images', image);
        });
      } else if (key === 'variations' || key === 'collaborators' || key === 'features') {
        formData.append(key, JSON.stringify(newProduct[key])); // Serialize arrays/objects to JSON
      } else {
        formData.append(key, newProduct[key]);
      }
    });
  
    try {
      if (newProduct.images.length === 0){
        seterror('Error creating product ensure you have uploaded at least one image.');
      }
      else{
        const res = await axiosInstance.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('New Product created:', res.data);
        setMessage('Product created successfully');
        setloading(false);
  
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }

  
    } catch (err) {
      setloading(false);
      console.error('Error in createProduct:', err.response?.data || err.message);
      seterror('Error creating product' , err.response?.data);

      setTimeout(() => {
        seterror("");
      }, 5000);
    }
    setloading(false);
  };
  

  const handleDescriptionChange = (value) => {
    setNewProduct({ ...newProduct, description: value });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const addVariation = () => {
    setNewProduct({
      ...newProduct,
      variations: [...newProduct.variations,
         { color: [], size: [], material: [], model: [] }],
    });
  };
  
  const removeVariation = (index) => {
    const updatedVariations = newProduct.variations.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variations: updatedVariations });
  };
  
  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...newProduct.variations];
    if (['size', 'color', 'material', 'model'].includes(field)) {
      updatedVariations[index][field] = value.split(',').map((item) => item.trim());
    } else {
      updatedVariations[index][field] = value;
    }
    setNewProduct({ ...newProduct, variations: updatedVariations });
  };

  const GEMINI_API_KEY = "AIzaSyDL0wDHmhqtHZuurZ0tKAfUEBm0n1QIvws";

const generateDescription = async () => {
  if (!newProduct.name || !newProduct.category) {
    seterror("Please provide a product name and category to generate a description.");
    setTimeout(() => {
      seterror(""); // Clear error message after 5 seconds
    }, 5000);
    return;
  }

  setGeneratingDescription(true);

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a short and engaging product description for a ${newProduct.category} named "${newProduct.name}".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedDescription = response.text();

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      description: generatedDescription,
    }));

  } catch (err) {
    seterror("Failed to generate description. Please try again.");
    
    setTimeout(() => {
      seterror(""); // Clear error message after 5 seconds
    }, 5000);
    console.error("Error generating description:", err);
  } finally {
    setGeneratingDescription(false);
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-section">
            <h3>Step 1: Basic Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newProduct.name}
              onChange={handleChange}
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="subCategory"
              value={newProduct.subCategory}
              onChange={handleChange}
              disabled={subCategories.length === 0}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price"
              min="1"
              value={newProduct.price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              min="1"
              value={newProduct.quantity}
              onChange={handleChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="step-section">
            <h3>Step 2: Description</h3>
            <ReactQuill
              className="npfdiv"
              theme="snow"
              value={newProduct.description}
              onChange={handleDescriptionChange}
              modules={modules}
              placeholder="Write an engaging product description..."
            />
            <button
              type="button"
              onClick={generateDescription}
              disabled={generatingDescription}
            >
              {generatingDescription ? "Generating..." : "Generate Description"}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="step-section">
            <h3>Step 3: Features (optional)</h3>
            <div
              className="npfdiv">
                {newProduct.features.map((feature, index) => (
                  <div key={index}
                  
                  >

                    <input
                      type="text"
                      placeholder="Feature Type"
                      value={feature.type}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          features: newProduct.features.map((f, i) =>
                            i === index ? { ...f, type: e.target.value } : f
                          ),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Specification"
                      value={feature.specification}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          features: newProduct.features.map((f, i) =>
                            i === index
                              ? { ...f, specification: e.target.value }
                              : f
                          ),
                        })
                      }
                    />
                    <button type="button" onClick={() => removeFeature(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFeature}>
                  Add Feature
                </button>
          </div>
          </div>
        );
      case 4:
        return (
          <div className="step-section">
            <h3>Step 4: Variations (optional)</h3>
            <div className="npfdiv">
              {newProduct.variations.map((variation, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Color(comma-separated)"
                    value={variation.color.join(', ')}
                    onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Sizes (comma-separated)"
                    value={variation.size.join(', ')}
                    onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Material (comma-separated)"
                    value={variation.material.join(', ')}
                    onChange={(e) => handleVariationChange(index, 'material', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Model (comma-separated) "
                    value={variation.model.join(', ')}
                    onChange={(e) => handleVariationChange(index, 'model', e.target.value)}
                  />
                  <button type="button" onClick={() => removeVariation(index)}>
                    Remove Variation
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVariation}>
                Add Variation
              </button>
            </div>

          </div>
        );
      case 5:
        return (
          <div className="step-section">
            <h3>Step 5: Images</h3>
            <div>
              <input
                type="file"
                name="images"
                onChange={handleChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
              />
              <div
                className={`drop-zone ${dragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                {newProduct.images.length > 0
                  ? `${newProduct.images.length}/6 images selected`
                  : "Drag and drop images or click to select (max 6)"}
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="thumbnails">
                {newProduct.images.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  return (
                    <div key={index} className="thumbnail">
                      <img src={imageUrl} alt={`Selected ${index}`} />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="new-product-form">
      <LinearProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="step-content">{renderStepContent()}</div>
      <div className="step-navigation">
        {currentStep > 1 && (
          <button type="button" onClick={handleBack}>
            Back
          </button>
        )}
        {currentStep < totalSteps && (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        )}
        {currentStep === totalSteps && (
          <>
           <button type="submit">
               {loading ? "Creating......" : "Create New Product"}
           </button>
           {message && <p className="message">{message}</p>}
           {error && <p className="error">{error}</p>}
          </>

        )}
      </div>
    </form>
  );
};

export default NewProductFormShell;
