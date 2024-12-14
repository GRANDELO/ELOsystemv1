import React, { useState } from 'react';

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
  { id: 'toys', name: 'Toys' },
  { id: 'books', name: 'Books' },
  // More categories can be added here
];

const CategoryList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleShowMore = () => {
    setShowMore((prevState) => !prevState);
  };

  return (
    <div className="categories-container">
      <div className="categories">
        {categories.slice(0, 4).map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}

        {showMore && categories.slice(4).map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}

        {categories.length > 4 && (
          <button className="more-btn" onClick={handleShowMore}>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
