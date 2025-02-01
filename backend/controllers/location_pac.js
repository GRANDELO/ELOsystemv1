const Order = require("../models/Order"); // Import the Order model

/**
 * Group products by origin and destination (region and county)
 * @returns {Object} Grouped products by origin and destination
 */
const groupProductsByOriginAndDestination = async () => {
  try {
    // Step 1: Fetch all orders
    const orders = await Order.find({}).populate("items.productId");

    // Step 2: Group by origin and destination
    const groupedProducts = orders.reduce((acc, order) => {
      const { currentplace, destination } = order; // Assuming origin and destination are in the order model

      if (!currentplace || !destination) {
        console.warn('Missing currentplace or destination for order:', order);
        return acc;
    }
      // Use a unique key combining origin and destination
      const key = `${currentplace}-${destination}`;

      // if (!acc[key]) {
      //   acc[key] = [];
      // }

      // Add products in this order to the group
//       order.items.forEach((item) => {
//         acc[key].push({
//           productId: item.productId,
          
//           orderNumber: order.orderNumber,
//           totalPrice: order.totalPrice,
//           origin: currentplace,
//           destination,
//         });
//       });

//       return acc;
//     }, {});

//     // Step 3: Return grouped products
//     return groupedProducts;
//   } catch (error) {
//     console.error("Error grouping products by origin and destination:", error);
//     throw error;
//   }
// };

if (!acc[key]) {
  acc[key] = {
    origin: currentplace,
    destination,
    products: [],
  };
}

// Add products in this order to the group
order.items.forEach((item) => {
  if (item.productId) {
    acc[key].products.push({
      productId: item.productId._id,
      productName: item.productId.name || "Unknown Product",
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
    });
  }
});

return acc;
}, {});

// Step 3: Transform groupedProducts into an array for easier frontend usage
const result = Object.keys(groupedProducts).map((key) => ({
origin: groupedProducts[key].origin,
destination: groupedProducts[key].destination,
products: groupedProducts[key].products,
}));

return result;
} catch (error) {
console.error("Error grouping products by origin and destination:", error);
throw error;
}
};

module.exports = {
    groupProductsByOriginAndDestination,
};
