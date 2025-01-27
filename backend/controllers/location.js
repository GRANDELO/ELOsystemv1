const Agent = require('../models/agents'); // Adjust the path to your model file

const getAllLocations = async (req, res) => {
  try {
    const locations = await Agent.find({}, 'locations'); // Only fetch the 'locations' field
    console.log(locations);
    res.status(200).json({ 
      success: true, 
      locations 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching locations', 
      error: error.message 
    });
  }
};

module.exports = { getAllLocations };
