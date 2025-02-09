const mongoose = require("mongoose");

const SubAreaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Specific sub-area name
});

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the area
  subAreas: [SubAreaSchema], // List of sub-areas under the area
});

const TownSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the town
  areas: [AreaSchema], // List of areas in the town
});

const Town = mongoose.model("Town", TownSchema);

module.exports = Town;

