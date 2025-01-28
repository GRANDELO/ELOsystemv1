import React, { useState } from "react";
import axiosInstance from "./axiosInstance";

function ProductDescriptionGenerator() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    setLoading(true);
    setDescription(""); // Clear previous description

    const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key

    const prompt = `Write a compelling product description for a ${category} called "${productName}".`;

    try {
      // Make the API request to OpenAI
      const response = await axiosInstance.post(
        "/v1/completions",
        {
          model: "text-davinci-003", // Use the GPT-3 model
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Extract the generated text from the response
      setDescription(response.data.choices[0].text.trim());
    } catch (error) {
      console.error("Error generating description:", error);
      setDescription("Failed to generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Product Description Generator</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px" }}
        />
      </div>
      <button
        onClick={generateDescription}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {description && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Description</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}

export default ProductDescriptionGenerator;

