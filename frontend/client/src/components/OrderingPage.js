import React, { useState, useEffect } from 'react';

const LocationSelector = () => {
  const [locations, setLocations] = useState([]);
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [specificAreas, setSpecificAreas] = useState([]);
  const [selectedSpecificArea, setSelectedSpecificArea] = useState('');

  useEffect(() => {
    // Fetch locations from the backend
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://elosystemv1.onrender.com/api/locationsroutes'); // Replace with your actual endpoint
        const data = await response.json();
        if (data.success) {
          setLocations(data.locations);

          // Extract unique towns
          const uniqueTowns = [...new Set(data.locations.map((loc) => loc.locations.town))];
          setTowns(uniqueTowns);
        } else {
          console.error('Failed to fetch locations:', data.message);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Handle town selection
  const handleTownChange = (e) => {
    const town = e.target.value;
    setSelectedTown(town);

    // Filter areas based on selected town
    const filteredAreas = locations
      .filter((loc) => loc.locations.town === town)
      .map((loc) => loc.locations.area);

    setAreas([...new Set(filteredAreas)]);
    setSelectedArea('');
    setSpecificAreas([]);
  };

  // Handle area selection
  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);

    // Filter specific locations based on selected area
    const filteredSpecificAreas = locations
      .filter((loc) => loc.locations.town === selectedTown && loc.locations.area === area)
      .map((loc) => loc.locations.specific);

    setSpecificAreas([...new Set(filteredSpecificAreas)]);
    setSelectedSpecificArea('');
  };

  // Handle specific area selection
  const handleSpecificAreaChange = (e) => {
    setSelectedSpecificArea(e.target.value);
  };

  return (
    <div>
      <h2>Select Location</h2>

      {/* Town Selector */}
      <div>
        <label htmlFor="town">Town:</label>
        <select id="town" value={selectedTown} onChange={handleTownChange}>
          <option value="">-- Select Town --</option>
          {towns.map((town, index) => (
            <option key={index} value={town}>
              {town}
            </option>
          ))}
        </select>
      </div>

      {/* Area Selector */}
      {areas.length > 0 && (
        <div>
          <label htmlFor="area">Area:</label>
          <select id="area" value={selectedArea} onChange={handleAreaChange}>
            <option value="">-- Select Area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Specific Area Selector */}
      {specificAreas.length > 0 && (
        <div>
          <label htmlFor="specific">Specific Area:</label>
          <select id="specific" value={selectedSpecificArea} onChange={handleSpecificAreaChange}>
            <option value="">-- Select Specific Area --</option>
            {specificAreas.map((specific, index) => (
              <option key={index} value={specific}>
                {specific}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedSpecificArea && (
        <div>
          <h3>Selected Location:</h3>
          <p>
            Town: {selectedTown}, Area: {selectedArea}, Specific: {selectedSpecificArea}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
