const Order = require("../models/Order"); 
const { io } = require('../io');
const Route = require('../models/enRouteLocation'); // Import the Route model (to be created)
const mongoose = require('mongoose');
const User = require("../models/User")
const { v4: uuidv4 } = require("uuid");

function normalizeDestination(destination) {
  let normalizedDestination = { county: 'Unknown', town: 'Unknown', area: 'Unknown' };

  if (typeof destination === 'string') {
    try {
      // Try parsing if destination is a JSON string
      normalizedDestination = JSON.parse(destination);
    } catch (error) {
      // Split string into parts as fallback
      const parts = destination.split(',').map(part => part.trim());
      if (parts.length >= 3) {
        normalizedDestination = {
          county: parts[0],
          town: parts[1],
          area: parts[2],
        };
      }
    }
  } else if (typeof destination === 'object') {
    // Assume destination is already an object
    normalizedDestination = {
      county: destination.county || 'Unknown',
      town: destination.town || 'Unknown',
      area: destination.area || 'Unknown',
    };
  }

  return normalizedDestination;
}


// Helper function to group orders based on origin and destination
function groupOrders(orders, timeWindowMinutes = 2880) {
  const groupedOrders = {};
  const currentTime = new Date();

  orders.forEach(order => {
    const timeDifference = (currentTime - order.orderDate) / (1000 * 60); // Difference in minutes
    if (timeDifference <= timeWindowMinutes) {
      const destination = normalizeDestination(order.destination);

      const key = `${order.origin.county}-${order.origin.town}-${order.origin.area}-${destination.county}-${destination.town}-${destination.area}`;
      if (!groupedOrders[key]) groupedOrders[key] = [];
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

    const destination = normalizeDestination(firstOrder.destination);
    
    const route = new Route({
      routeId: `ROUTE-${uuidv4()}`,
      origin: {
        county: origin.county,
        town: origin.town,
        area: origin.area,
      },
      destination: {
        county: destination.county || 'Unknown County',
        town: destination.town || 'Unknown Town',
        area: destination.area || 'Unknown Area',
      },
      orders: groupedOrders[key].map(order => ({
        id: order.id,
        orderNumber:  order.orderNumber,
      })),
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
    const timeWindowMinutes = 2880;
    const currentTime = new Date();
    const timeWindowStart = new Date(currentTime.getTime() - timeWindowMinutes * 60000);

    console.log('Time window start:', timeWindowStart);
    console.log('Current time:', currentTime);

    const orders = await Order.find({
      orderDate: { $gte: timeWindowStart },
      status: 'pending',
    }).populate('origin destination'); // Populate seller and customer details if needed

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
        const defaultOrigin = { county: 'Nairobi County', town: 'Nairobi', area: 'CBD' };

        order.origin = {
          county: seller?.locations?.county || defaultOrigin.county,
          town: seller?.locations?.town || defaultOrigin.town,
          area: seller?.locations?.area || defaultOrigin.area,
        };
      } else {
    // Fill in missing fields in existing origin
       order.origin.county = order.origin.county || 'Nairobi County';
       order.origin.town = order.origin.town || 'Nairobi';
       order.origin.area = order.origin.area || 'CBD';
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

    const formatRoutes = (routes) => routes.map(route => ({
      ...route.toObject(),
      orderCount: route.orders.length,
  }));
  
  const directRoutesWithCounts = formatRoutes(directRoutes);
  const hubRoutesWithCounts = formatRoutes(hubRoutes);
  
  res.status(200).json({
      success: true,
      message: 'Delivery locations planned successfully',
      data: {
          directRoutes: directRoutesWithCounts,
          hubRoutes: hubRoutesWithCounts,
      },
  });
  

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
