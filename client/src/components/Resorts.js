import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Resorts() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/resorts')
      .then(response => {
        console.log('API response:', response.data);  // Log the response for debugging
        setResorts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the resorts!', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error loading the resorts. {error.message}</p>;
  }

  return (
    <ul>
      {resorts.map(resort => (
        <li key={resort._id}>
          <h2>{resort.name}</h2>
          <p>{resort.description}</p>
          <p>Price: ${resort.price}</p>
          <p>Rating: {resort.rating}</p>
          <a href={resort.location} target="_blank" rel="noopener noreferrer">Location</a>
        </li>
      ))}
    </ul>
  );
}

export default Resorts;
