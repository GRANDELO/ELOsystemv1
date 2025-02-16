import React, {useState, useEffect} from 'react';
import axiosInstance from '../../axiosInstance';
import io from 'socket.io-client';


const socket = io('https://elosystemv1.onrender.com/api');

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const renderTableRows = (destinations) => {
        return destinations.map((destination, index) => (
            <tr key={index}>
                <td>{destination.type}</td>
                <td>{destination.origin.county}, {destination.origin.town}, {destination.origin.area}</td>
                <td>{destination.destination.county}, {destination.destination.town}, {destination.destination.area}</td>
                <td>{destination.orderCount}</td>
                <td>
                    <table>
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destination.orders.map((order, orderIndex) => (
                                <tr key={orderIndex}>
                                    <td>{order.orderNumber}</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        ));
    };


    return (
      <div>
      <h1>Delivery Locations</h1>
      {loading ? (
          <p>Loading destinations...</p>
      ) : (
          <table>
              <thead>
                  <tr>
                      <th>Type</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Order Count</th>
                      <th>Orders</th>
                  </tr>
              </thead>
              <tbody>
                  {renderTableRows(destinations)}
              </tbody>
          </table>
      )}
  </div>
    );
}

export default Destination