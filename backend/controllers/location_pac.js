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
      const { origin, destination } = order; // Assuming origin and destination are in the order model

      // Use a unique key combining origin and destination
      const key = `${origin.county}-${destination.county}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      // Add products in this order to the group
      order.items.forEach((item) => {
        acc[key].push({
          productId: item.productId,
          quantity: item.quantity,
          variations: item.variations,
          orderNumber: order.orderNumber,
          totalPrice: order.totalPrice,
          origin,
          destination,
        });
      });

      return acc;
    }, {});

    // Step 3: Return grouped products
    return groupedProducts;
  } catch (error) {
    console.error("Error grouping products by origin and destination:", error);
    throw error;
  }
};

module.exports = {
    groupProductsByOriginAndDestination,
};
