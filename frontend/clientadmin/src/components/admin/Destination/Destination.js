import React, {useState, useEffect} from 'react';
import axiosInstance from '../../axiosInstance';
import io from 'socket.io-client';

const socket = io('https://elosystemv1.onrender.com/api');

const Destination = () => {
    const [destinations, setDestinations] = useState([]);


    const fetchDestinations = async () => {
        try {
            const response = await axiosInstance.post('/plan-delivery'); // API call to fetch destinations
            console.log('Backend Response:', response.data.data);
            
            const { directRoutes = [], hubRoutes= [] } = response.data.data;


            const processRoutes = ( routes, type) => 
                routes.map(routes => ({
                    type,
                    origin: routes.origin,
                    destination: routes.destination,
                    orderCount: routes.orderCount,
                    orders: routes.orders.map(order => ({
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: 'pending',
                    })),
                }));

                const directDestinations = processRoutes(directRoutes, 'Direct');
                const hubDestination = processRoutes(hubRoutes, 'Hub');

                setDestinations([...directDestinations, ...hubDestination]);
       } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    useEffect(() => {
        fetchDestinations();
    
        socket.on('updateDestinations', ({ directRoutes, hubRoutes }) => {
          console.log('Received from socket:', { directRoutes, hubRoutes });
          const processRoutes = (routes, type) =>
            routes.map(route => ({
              type,
              origin: route.origin,
              destination: route.destination,
              orderCount: route.orderCount,
              orders: route.orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: 'pending',
              })),
            }));
    
          const directDestinations = processRoutes(directRoutes, 'Direct');
          const hubDestination = processRoutes(hubRoutes, 'Hub');
    
          setDestinations([...directDestinations, ...hubDestination]);
        });
    
        return () => {
          socket.off('updateDestinations');
        };
      }, []);
      
      const groupByCounty = (destinations) => {
        return destinations.reduce((acc, destination) => {
          const county = destination.origin.county;
          if (!acc[county]) {
            acc[county] = [];
          }
          acc[county].push(destination);
          return acc;
        }, {});
      };

      return (
        <div className="dashad-destinations-section">
                                <h2>Destinations</h2>
                                {destinations.length === 0 ? (
                                  <p>No available destinations.</p>
                                ) : (
                                  <div>
                                    <h3>Direct Routes</h3>
                                    {destinations.filter((d) => d.type === "Direct").length === 0 ? (
                                      <p>No direct routes available.</p>
                                    ) : (
                                      <table className="destinations-table">
                                        <thead>
                                          <tr>
                                            <th>Origin</th>
                                            <th>Destination</th>
                                            <th>Order Count</th>
                                            <th>Orders</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(
                                            groupByCounty(destinations.filter((d) => d.type === "Direct"))
                                          ).map(([county, countyDestinations], countyIndex) => (
                                            <React.Fragment key={countyIndex}>
                                              {countyDestinations.map((destination, index) => (
                                                <tr key={`${countyIndex}-${index}`}>
                                                  {index === 0 && (
                                                    <td rowSpan={countyDestinations.length}>
                                                      <strong>{county}</strong>
                                                    </td>
                                                  )}
                                                  <td>
                                                    {destination.origin.town}, {destination.origin.area}
                                                  </td>
                                                  <td>
                                                    {destination.destination.county},{" "}
                                                    {destination.destination.town},{" "}
                                                    {destination.destination.area}
                                                  </td>
                                                  <td>{destination.orderCount}</td>
                                                  <td>
                                                    {destination.orders.length > 0 ? (
                                                      destination.orders.map((order, orderIndex) => (
                                                        <span key={orderIndex} className="orders-badge">
                                                          #{order.orderNumber}
                                                        </span>
                                                      ))
                                                    ) : (
                                                      <span className="orders-empty">No orders</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              ))}
                                            </React.Fragment>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                              
                                    <h3>Hub Routes</h3>
                                    {destinations.filter((d) => d.type === "Hub").length === 0 ? (
                                      <p>No hub routes available.</p>
                                    ) : (
                                      <table className="destinations-table">
                                        <thead>
                                          <tr>
                                            <th>Origin</th>
                                            <th>Destination</th>
                                            <th>Order Count</th>
                                            <th>Orders</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(
                                            groupByCounty(destinations.filter((d) => d.type === "Hub"))
                                          ).map(([county, countyDestinations], countyIndex) => (
                                            <React.Fragment key={countyIndex}>
                                              {countyDestinations.map((destination, index) => (
                                                <tr key={`${countyIndex}-${index}`}>
                                                  {index === 0 && (
                                                    <td rowSpan={countyDestinations.length}>
                                                      <strong>{county}</strong>
                                                    </td>
                                                  )}
                                                  <td>
                                                    {destination.origin.town}, {destination.origin.area}
                                                  </td>
                                                  <td>
                                                    {destination.destination.county},{" "}
                                                    {destination.destination.town},{" "}
                                                    {destination.destination.area}
                                                  </td>
                                                  <td>{destination.orderCount}</td>
                                                  <td>
                                                    {destination.orders.length > 0 ? (
                                                      destination.orders.map((order, orderIndex) => (
                                                        <span key={orderIndex} className="orders-badge">
                                                          #{order.orderNumber}
                                                        </span>
                                                      ))
                                                    ) : (
                                                      <span className="orders-empty">No orders</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              ))}
                                            </React.Fragment>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                )}
                              </div>
      )
    
}

export default Destination