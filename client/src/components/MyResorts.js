import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">منتجعاتي</h1>
      <ul className="space-y-4">
      {resorts.map((resort) => (
  <li key={resort._id} className="bg-white rounded shadow-lg p-4">
    <h2 className="text-2xl font-bold">{resort.name}</h2>
    <p className="text-gray-600">{resort.description}</p>
    <p className="mt-2">الموقع: {resort.location}</p>
    <p className="mt-2">السعر: {resort.minPrice} - {resort.maxPrice}</p>
    <p className="mt-2">التقييم: {resort.rating}</p>
    <p className="mt-2">
      حالة التوفر: <span className={resort.available ? 'text-green-600' : 'text-red-600'}>{resort.available ? 'متاح' : 'غير متاح'}</span>
    </p>
    <div className="flex space-x-4 mt-4">
      <Link to={`/edit-resort/${resort._id}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">تعديل</Link>
      <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">حذف</button>
    </div>
  </li>
))}

      </ul>
    </div>
  );
};

export default MyResorts;
