

function getCategoryCount(searchHistory, category) {
    return Object.values(searchHistory[category]).reduce((sum, count) => sum + count, 0);
  }

  
function manageCategories(searchHistory) {
    const categories = Object.keys(searchHistory);
  
    // If the number of categories exceeds 5, remove the one with the lowest count
    if (categories.length > 5) {
      let lowestCategory = categories[0];
      let lowestCount = getCategoryCount(searchHistory, lowestCategory);
  
      categories.forEach((category) => {
        const categoryCount = getCategoryCount(searchHistory, category);
        if (categoryCount < lowestCount) {
          lowestCategory = category;
          lowestCount = categoryCount;
        }
      });
  
      // Remove the category with the lowest count
      delete searchHistory[lowestCategory];
    }
  }
  

export const storeSearch = (category, subcategory)  => {
    // Get the current search history from session storage
    let searchHistory = JSON.parse(sessionStorage.getItem('searchHistory')) || {};
  
    // Check if the category exists
    if (!searchHistory[category]) {
      searchHistory[category] = {};
    }
  
    // Check if the subcategory exists and increase count, otherwise initialize it
    if (searchHistory[category][subcategory]) {
      searchHistory[category][subcategory] += 1;
    } else {
      searchHistory[category][subcategory] = 1;
    }
  
    // Manage the number of categories (max 5)
    manageCategories(searchHistory);
  
    // Save the updated search history back to session storage
    sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  
export const trackProductClick = (productId) => {
    let clickHistory = JSON.parse(sessionStorage.getItem('clickHistory')) || {};
  
    if (clickHistory[productId]) {
      clickHistory[productId] += 1;
    } else {
      clickHistory[productId] = 1;
    }
  
    sessionStorage.setItem('clickHistory', JSON.stringify(clickHistory));
  };
export const getSearchHistory = () => {
    return JSON.parse(sessionStorage.getItem('searchHistory')) || {};
  }
  