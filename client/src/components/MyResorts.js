import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Remove the unused import
// import { Link } from 'react-router-dom';

const MyResorts = ({ user }) => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/myresorts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResorts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading resorts: {error.message}</p>;
  }

  return (
    <div>
      <h1>My Resorts</h1>
      <ul>
        {resorts.map((resort) => (
          <li key={resort._id}>
            <h2>{resort.name}</h2>
            <p>{resort.description}</p>
            <p>Location: {resort.location}</p>
            <p>Price: ${resort.minPrice} - ${resort.maxPrice}</p>
            <p>Rating: {resort.rating}</p>
            <a href={`/edit-resort/${resort._id}`}>Edit</a>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyResorts;
