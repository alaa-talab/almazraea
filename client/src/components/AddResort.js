import React, { useState } from 'react';
import axios from 'axios';

function AddResort() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [owner, setOwner] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newResort = { name, location, description, images: images.split(','), owner, price };
    await axios.post('http://localhost:5000/resorts', newResort);
    setName('');
    setLocation('');
    setDescription('');
    setImages('');
    setOwner('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location URL" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input value={images} onChange={(e) => setImages(e.target.value)} placeholder="Images (comma separated URLs)" required />
      <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" required />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" required />
      <button type="submit">Add Resort</button>
    </form>
  );
}

export default AddResort;
