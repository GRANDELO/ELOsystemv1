const Order = require("../models/Order"); // Import the Order model

/**
 * Group products by origin and destination (region and county)
 * @returns {Object} Grouped products by origin and destination
 */
const groupProductsByOriginAndDestination = async () => {
  try {
    // Step 1: Fetch all orders with product details
    const orders = await Order.find({}).populate("items.productId");

    // Step 2: Group by pCurrentPlace and destination
    const groupedProducts = orders.reduce((acc, order) => {
      const { destination } = order;

      order.items.forEach((item) => {
        const { pCurrentPlace, productId } = item;

        // Skip products with "Waiting for delivery." status
        if (!pCurrentPlace || pCurrentPlace === "Waiting for delivery.") return;

        // Create a unique key using pCurrentPlace and destination
        const key = `${pCurrentPlace}-${destination}`;

        if (!acc[key]) {
          acc[key] = {
            origin: pCurrentPlace,
            destination,
            products: [],
          };
        }

        if (productId) {
          acc[key].products.push({
            productId: productId._id,
            productName: productId.name || "Unknown Product",
            orderNumber: order.orderNumber,
            totalPrice: order.totalPrice,
          });
        }
      });

      return acc;
    }, {});

    // Step 3: Transform groupedProducts into an array and add status
    const result = Object.keys(groupedProducts).map((key) => {
      const group = groupedProducts[key];

      return {
        origin: group.origin,
        destination: group.destination,
        products: group.products,
        status: group.products.length >= 10 ? "Ready to deliver" : "Sent to regional hub",
      };
    });

    return result;
  } catch (error) {
    console.error("Error grouping products by origin and destination:", error);
    throw error;
  }
};


module.exports = {
    groupProductsByOriginAndDestination,
};
