import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Resorts() {
  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/resorts')
      .then(response => {
        setResorts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the resorts!', error);
      });
  }, []);

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
