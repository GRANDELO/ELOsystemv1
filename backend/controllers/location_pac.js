const Order = require("../models/Order"); 
const { io } = require('../io');
const Route = require('../models/enRouteLocation'); // Import the Route model (to be created)
const mongoose = require('mongoose');
const User = require("../models/User")
const { v4: uuidv4 } = require("uuid");

// Helper function to group orders based on origin and destination
function groupOrders(orders, timeWindowMinutes = 1440) {
  const groupedOrders = {};
  const currentTime = new Date();

  orders.forEach(order => {
    const timeDifference = (currentTime - order.orderDate) / (1000 * 60); // Difference in minutes
    if (timeDifference <= timeWindowMinutes) {
      const key = `${order.origin}-${order.destination}`;
      if (!groupedOrders[key]) {
        groupedOrders[key] = [];
      }
      groupedOrders[key].push(order);
    }
  });

  return groupedOrders;
}

// Helper function to decide transportation based on threshold
function decideTransportation(groupedOrders, threshold = 10) {
  const transportationPlan = { direct: [], hub: [] };

  for (const key in groupedOrders) {
    if (groupedOrders[key].length >= threshold) {
      transportationPlan.direct.push(groupedOrders[key]);
    } else {
      transportationPlan.hub.push(groupedOrders[key]);
    }
  }

  return transportationPlan;
}

// Helper function to create routes for grouped orders
async function createRoutes(groupedOrders, threshold = 10) {
  const routes = [];
  for (const key in groupedOrders) {
    const orders = groupedOrders[key];
    const firstOrder = orders[0];
    const origin = firstOrder.origin || {
      county: 'Nairobi County', // Default location
      town: 'Nairobi',
      area: 'Central',
    };
   
    const route = new Route({
      routeId: `ROUTE-${uuidv4()}`,
      origin: {
        county: origin.county,
        town: origin.town,
        area: origin.area,
      },
      destination: groupedOrders[key][0].destination || 'Unknown destinations',
      orders: groupedOrders[key].map(order => order._id),
      status: 'scheduled',
      type: groupedOrders[key].length >= threshold ? 'direct' : 'hub',
    });
    await route.save();
    routes.push(route);
  }
  return routes;
}

// Controller function to plan delivery locations
const planDeliveryLocations = async (req, res) => {
  try {
    // Step 1: Fetch all pending orders within the last 60 minutes
    const timeWindowMinutes = 60;
    const currentTime = new Date();
    const timeWindowStart = new Date(currentTime.getTime() - timeWindowMinutes * 60000);

    console.log('Time window start:', timeWindowStart);
    console.log('Current time:', currentTime);

    const orders = await Order.find({
      orderDate: { $gte: timeWindowStart, $lte: currentTime },
      status: 'pending',
    }).populate('origin' ); // Populate seller and customer details if needed

    console.log('Fetched orders:', orders);

    if (!orders.length) {
      console.log('No orders found within the given time window.');
      return res.status(200).json({
        success: false,
        message: 'No pending orders found.',
        data: { directRoutes: [], hubRoutes: [] },
      });
    }
  
    for (let order of orders) {
      if (!order.origin) {
        const seller = await User.findOne({ username: order.username, category: 'seller' });
        if (seller && seller.locations) {
          const { county, town, area } = seller.locations || {};
          order.origin = { county: county || '', town: town || '', area: area || '' };
        } else {
          order.origin = { county: 'Nairobi County', town: 'Nairobi', area: 'CBD' };
        }
      }
    }

    
    // Step 2: Group orders based on origin and destination
    const groupedOrders = groupOrders(orders, timeWindowMinutes);
    console.log('Grouped orders:', Object.keys(groupedOrders));

    if (!Object.keys(groupedOrders).length) {
      console.log('No grouped orders found.');
      return res.status(200).json({
        success: false,
        message: 'No grouped orders found.',
        data: { directRoutes: [], hubRoutes: [] },
      });
    }

    const threshold = 10; 
    // Step 3: Decide transportation based on threshold
    const transportationPlan = decideTransportation(groupedOrders, threshold);
    console.log('Transportation plan:', transportationPlan);

    // Step 4: Create routes for direct transportation
    const directRoutes = await createRoutes(transportationPlan.direct, threshold);
    console.log('Direct routes:', directRoutes);
    // Step 5: Redirect orders to a hub for further consolidation
    const hubRoutes = await createRoutes(transportationPlan.hub, threshold);
    console.log('Hub routes:', hubRoutes);

    // Step 6: Update order statuses
    for (const route of [...directRoutes, ...hubRoutes]) {
      await Order.updateMany(
        { _id: { $in: route.orders } },
        { $set: { status: 'in_transit', currentplace: route.status === 'scheduled' ? 'In transit to destination' : 'Redirected to hub' } }
      );
    }

    io.emit('updateDestinations', { directRoutes, hubRoutes });
    console.log('Socket emit fired:', { directRoutes, hubRoutes });

    // Step 7: Return the transportation plan
    res.status(200).json({
      success: true,
      message: 'Delivery locations planned successfully',
      data: {
        directRoutes,
        hubRoutes,
      },
    });
  } catch (error) {
    console.error('Error planning delivery locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to plan delivery locations',
      error: error.message,
    });
  }
};

const getDestinations = async(req, res) => {
  try {
    const directRoutes = await Route.find({ status: 'scheduled', type: 'Direct' }); // Adjust query as needed
    const hubRoutes = await Route.find({ status: 'scheduled', type: 'Hub' });

    res.status(200).json({
      success: true,
      message: 'Destinations retrieved successfully',
      data: { directRoutes, hubRoutes },
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destinations',
      error: error.message,
    });
  }
};


module.exports = {
  planDeliveryLocations,
  getDestinations,
};

// /**
//  * Group products by origin and destination (region and county)
//  * @returns {Object} Grouped products by origin and destination
//  */
// const groupProductsByOriginAndDestination = async () => {
//   try {
//     // Step 1: Fetch all orders with product details
//     const orders = await Order.find({}).populate("items.productId");

//     // Step 2: Group by pCurrentPlace and destination
//     const groupedProducts = orders.reduce((acc, order) => {
//       const { destination } = order;

//       order.items.forEach((item) => {
//         const { pCurrentPlace, productId } = item;

//         // Skip products with "Waiting for delivery." status
//         if (!pCurrentPlace || pCurrentPlace === "Waiting for delivery.") return;

//         // Create a unique key using pCurrentPlace and destination
//         const key = `${pCurrentPlace}-${destination}`;

//         if (!acc[key]) {
//           acc[key] = {
//             origin: pCurrentPlace,
//             destination,
//             products: [],
//           };
//         }

//         if (productId) {
//           acc[key].products.push({
//             productId: productId._id,
//             productName: productId.name || "Unknown Product",
//             orderNumber: order.orderNumber,
//             totalPrice: order.totalPrice,
//           });
//         }
//       });

//       return acc;
//     }, {});

//     // Step 3: Transform groupedProducts into an array and add status
//     const result = Object.keys(groupedProducts).map((key) => {
//       const group = groupedProducts[key];

//       return {
//         origin: group.origin,
//         destination: group.destination,
//         products: group.products,
//         status: group.products.length >= 10 ? "Ready to deliver" : "Sent to regional hub",
//       };
//     });

//     return result;
//   } catch (error) {
//     console.error("Error grouping products by origin and destination:", error);
//     throw error;
//   }
// };


// module.exports = {
//     groupProductsByOriginAndDestination,
// };
