import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegSadCry } from 'react-icons/fa';

function Resorts() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/resorts')
      .then(response => {
        console.log('API response:', response.data);
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

  if (resorts.length === 0) {
    return (
      <div className="text-center mt-10">
        <FaRegSadCry size={50} className="mx-auto text-pink-600" />
        <p className="mt-4 text-lg md:text-xl">لم يتم العثور على أي منتجعات. حاول تعديل معايير البحث الخاصة بك والمحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">Resorts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resorts.map(resort => (
  <div key={resort._id} className="bg-white rounded shadow-lg overflow-hidden">
    <img src={resort.photoBanner} alt={resort.name} className="w-full h-48 object-cover"/>
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{resort.name}</h2>
      <p className="text-gray-600 mb-4">{resort.description}</p>
      <p className="text-gray-800 mb-2">نطاق الأسعار: {resort.minPrice} - {resort.maxPrice}</p>
      <p className="text-gray-800 mb-4">التقييم: {resort.rating} / 5</p>
      <p className="text-gray-800 mb-2">
        حالة التوفر: <span className={resort.available ? 'text-green-600' : 'text-red-600'}>{resort.available ? 'متاح' : 'غير متاح'}</span>
      </p>
      <a href={resort.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Location</a>
      <Link to={`/resorts/${resort._id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">اكتشف المزيد</Link>
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default Resorts;
