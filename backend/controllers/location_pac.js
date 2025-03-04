const Order = require("../models/Order"); 
const Agent = require("../models/agents");
const { io } = require('../io');
const Route = require('../models/enRouteLocation'); // Import the Route model (to be created)
const mongoose = require('mongoose');
const User = require("../models/User")
const Buyers = require("../models/buyers");
const { v4: uuidv4 } = require("uuid");
const Config = require('../models/Config');

function normalizeDestination(destination) {
  let normalizedDestination = { county: 'Unknown', town: 'Unknown', area: 'Unknown', specific: 'unknown'};

  if (typeof destination === 'string') {
    try {
      // Try parsing if destination is a JSON string
      normalizedDestination = JSON.parse(destination);
    } catch (error) {
      // Split string into parts as fallback
      const parts = destination.split(',').map(part => part.trim());
      if (parts.length >= 4) {
        normalizedDestination = {
          county: parts[0],
          town: parts[1],
          area: parts[2],
          specific: parts[3],
        };
      }
    }
  } else if (typeof destination === 'object') {
    // Assume destination is already an object
    normalizedDestination = {
      county: destination.county || 'Unknown',
      town: destination.town || 'Unknown',
      area: destination.area || 'Unknown',
      specific: destination.specific || 'unknown',
    };
  }

  return normalizedDestination;
}
async function fetchAdditionInfo(orderId){
  try {

    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
      throw new Error('order not found');
    }
   // buyers phone number
    const client = await Buyers.findOne({ username: order.username });
    const clientPhone = client ? client.phoneNumber : "Unknown";

    const seller = await User.findOne({ username: order.sellerOrderId });
    const sellerPhone = seller ? seller.phoneNumber : "Unknown";

    let agentPhone = "Unknown";

    if (order.items && order.items.length > 0) {
      const productId = order.items[0].productId; // Assuming the first item's productId is used
      const agentByProduct = await Agent.findOne({ "packeges.productId": productId });
      console.log("agents", agentByProduct)
      if (agentByProduct) {
        agentPhone = agentByProduct.phoneNumber;
      }
    }

 
        // If no agent found by product, fallback to location-based search
        if (agentPhone === "Unknown") {
            const agentByLocation = await Agent.findOne({
                "locations.county": order.destination.county,
                "locations.town": order.destination.town,
                "locations.area": order.destination.area,
                "locations.specific": order.destination.specific,
            });

            if (agentByLocation) {
                agentPhone = agentByLocation.phoneNumber;
            }
        }

        // Return the fetched details
        return {
            success: true,
            message: "Delivery details retrieved successfully.",
            data: {
                clientPhone,
                sellerPhone,
                agentPhone,
                destination: order.destination
            }
        };
  }catch (error){
    console.error("Error fetching delivery details:", error);
    return { success: false, message: "Error fetching delivery details.", error: error.message };

  }
}

// Helper function to group orders based on origin and destination
function groupOrders(orders, timeWindowMinutes = 20160) {
  const groupedOrders = {};
  const currentTime = new Date();

  orders.forEach(order => {
    if (!order.orderDate) {
      console.warn(`Order ${order.orderNumber} has no orderDate! Skipping.`);
      return;
    }

    const orderTime = new Date(order.orderDate);
    const timeDifference = (currentTime - orderTime) / (1000 * 60); // Difference in minutes
    if (timeDifference <= timeWindowMinutes) {
      const destination = normalizeDestination(order.destination);

      const key = `${order.origin.county}-${order.origin.town}-${order.origin.area}-${destination.county}-${destination.town}-${destination.area}`;
      if (!groupedOrders[key]) groupedOrders[key] = [];
      groupedOrders[key].push(order);

      console.log(`Grouping order ${order.orderNumber} under key: ${key}`);
    }else {
      console.warn(`Order ${order.orderNumber} is outside the time window.`);
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
      specific: 'Tom mboya',
    };

    const destination = normalizeDestination(firstOrder.destination);
    const additionalInfo = await fetchAdditionInfo(firstOrder._id);
    const route = new Route({
      routeId: `ROUTE-${uuidv4()}`,
      origin: {
        county: origin.county,
        town: origin.town,
        area: origin.area,
        specific: origin.specific,
      },
      destination: {
        county: destination.county || 'Unknown County',
        town: destination.town || 'Unknown Town',
        area: destination.area || 'Unknown Area',
        specific: destination.specific || 'unknown Area',
      },
      orders: groupedOrders[key].map(order =>  order._id),
      orderNumber: groupedOrders[key].map(order => order.orderNumber),
      productId: firstOrder.items[0].productId,
      status: 'scheduled',
      type: groupedOrders[key].length >= threshold ? 'direct' : 'hub',
      additionalInfo,
    });
    await route.save();
    routes.push(route);
  }
  return routes;
}

// Controller function to plan delivery locations
const planDeliveryLocations = async (req, res) => {
  try {

    const config = await Config.findOne();
    const timeWindowMinutes = config?.timeWindowMinutes || 20160;
    const threshold = config?.threshold || 10;

    // Step 1: Fetch all pending orders within the last 60 minutes
    //const timeWindowMinutes = 20160;
    const currentTime = new Date();
    const timeWindowStart = new Date(currentTime.getTime() - timeWindowMinutes * 60000);

    const orders = await Order.find({
      $or: [{ status: 'in_transit' }, { status: 'pending' }],
      orderDate: { $gte: timeWindowStart } 
    });

    if (!orders.length) {
      console.log('No orders found within the given time window.');
      return res.status(200).json({
        success: false,
        message: 'No pending orders found.',
        data: { directRoutes: [], hubRoutes: [] },
      });
    }
  
    const bulkUpdates = orders.map(order => {
      if (!order.origin) {
        order.origin = { county: 'Nairobi County', town: 'Nairobi', area: 'CBD',  specific: 'Tom Mboya'}; 
      }
    
      return {
        updateOne: {
          filter: { _id: order._id },
          update: {
            $set: {
              'origin.county': order.origin.county || 'Nairobi County',
              'origin.town': order.origin.town || 'Nairobi',
              'origin.area': order.origin.area || 'CBD',
              'origin.specific': order.origin.specific || 'Tom Mboya',
            },
          },
        },
      };
    });

    if (bulkUpdates.length > 0) {
      await Order.bulkWrite(bulkUpdates);
      console.log('Bulk update for order origins completed.');
    }

    // Step 2: Group orders based on origin and destination
    const groupedOrders = groupOrders(orders, timeWindowMinutes);

    if (!Object.keys(groupedOrders).length) {
      console.log('No grouped orders found.');
      return res.status(200).json({
        success: false,
        message: 'No grouped orders found.',
        data: { directRoutes: [], hubRoutes: [] },
      });
    }

    // Step 3: Decide transportation based on threshold
    const transportationPlan = decideTransportation(groupedOrders, threshold);
    // Step 4: Create routes for direct transportation
    const directRoutes = await createRoutes(transportationPlan.direct, threshold);
    // Step 5: Redirect orders to a hub for further consolidation
    const hubRoutes = await createRoutes(transportationPlan.hub, threshold);

    // Step 6: Update order statuses
    for (const route of [...directRoutes, ...hubRoutes]) {
      await Order.updateMany(
        { _id: { $in: route.orders } },
        { $set: { status: 'in_transit', currentplace: route.status === 'scheduled' ? 'In transit to destination' : 'Redirected to hub' } }
      );
    }

    io.emit('updateDestinations', { directRoutes, hubRoutes });

    const formatRoutes = (routes) => routes.map(route => ({
      ...route.toObject(),
      orderCount: Array.isArray(route.orders) ? route.orders.length : 0, 
  }));
  
  const directRoutesWithCounts = formatRoutes(directRoutes);
  const hubRoutesWithCounts = formatRoutes(hubRoutes);
  

    // Step 7: Return the transportation plan
    res.status(200).json({
      success: true,
      message: 'Delivery locations planned successfully',
      data: {
        directRoutes,
        hubRoutes,
        directRoutesWithCounts,
        hubRoutesWithCounts,
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

// Add this function to handle manual re-planning
const adminReplan = async (req, res) => {
  try {
    const { overrideOrders } = req.body; // Optional: Array of orders to override

    if (overrideOrders && overrideOrders.length > 0) {
      // If overrideOrders are provided, manually reassign orders
      const orders = await Order.find({ _id: { $in: overrideOrders } });
      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: 'No orders found for the provided IDs.',
        });
      }

      // Manually reassign orders to new routes
      const groupedOrders = groupOrders(orders);
      const transportationPlan = decideTransportation(groupedOrders);
      const directRoutes = await createRoutes(transportationPlan.direct);
      const hubRoutes = await createRoutes(transportationPlan.hub);

      // Update order statuses
      for (const route of [...directRoutes, ...hubRoutes]) {
        await Order.updateMany(
          { _id: { $in: route.orders } },
          { $set: { status: 'in_transit', currentplace: route.status === 'scheduled' ? 'In transit to destination' : 'Redirected to hub' } }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Orders manually reassigned successfully.',
        data: { directRoutes, hubRoutes },
      });
    } else {
      // If no overrideOrders are provided, simply re-run the planning process
      await planDeliveryLocations(req, res);
    }
  } catch (error) {
    console.error('Error during manual re-planning:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to manually re-plan routes.',
      error: error.message,
    });
  }
};

const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) {
      // Create a default config if none exists
      const defaultConfig = new Config();
      await defaultConfig.save();
      return res.status(200).json({
        success: true,
        message: 'Default configuration created and retrieved.',
        data: defaultConfig,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Configuration retrieved successfully.',
      data: config,
    });
  } catch (error) {
    console.error('Error retrieving configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve configuration.',
      error: error.message,
    });
  }
};

// Update configuration
const updateConfig = async (req, res) => {
  try {
    const { timeWindowMinutes, threshold } = req.body;
    const config = await Config.findOneAndUpdate(
      {},
      { timeWindowMinutes, threshold },
      { new: true, upsert: true }
    );
    res.status(200).json({
      success: true,
      message: 'Configuration updated successfully.',
      data: config,
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update configuration.',
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

const listRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.status(200).json({
      success: true,
      message: 'Routes fetched successfully.',
      data: routes,
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes.',
      error: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reassignRouteId } = req.body;

    const order = await Order.findById(orderId);
    if (!order){
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status){
      order.status =status;
    }
    if (reassignRouteId) {
      // Reassign order to a new route
      order.routeId = reassignRouteId;
    }

    await order.save();
    res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      data: order,
    });
  } catch(error){
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order.',
      error: error.message,
    });
  }
};

const updateRoute = async (req, res) => {
  try{
    const { routeId }  = req.params;
    const { status } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found.',
      });
    }

    route.status = status; // Update route status (e.g., "completed" or "delayed")
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route updated successfully.',
      data: route,
    });
  }catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route.',
      error: error.message,
    });
  }
};

module.exports = {

  planDeliveryLocations,
  adminReplan,
  getConfig, 
  updateConfig,
  listRoutes,
  updateOrder,
  updateRoute,
  getDestinations,
};
