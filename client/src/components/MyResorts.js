import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyResorts = ({ user }) => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتجع؟');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      await axios.delete(`http://localhost:5000/resorts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResorts(resorts.filter(resort => resort._id !== id));
    } catch (error) {
      console.error('Error deleting resort:', error);
      setError('Failed to delete resort.');
    }
  };

  const handleEdit = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    navigate(`/edit-resort/${id}`);
  };

  useEffect(() => {
    const fetchResorts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/myresorts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setResorts(response.data);
      } catch (error) {
        console.error('Error fetching resorts:', error);
        setError('Failed to load resorts.');
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading resorts: {error}</p>;
  }

  return (
    <div className="font-arabic rtl  py-10 px-4">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-pink-600">منتجعاتي</h1>
        <ul className="space-y-6">
          {resorts.map((resort) => (
            <li key={resort._id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-pink-600">{resort.name}</h2>
              <p className="text-gray-700 mb-4">{resort.description}</p>
              <p className="text-lg font-semibold mb-2">
                الموقع: <span className="text-pink-600 font-medium">{resort.location}</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                نطاق الأسعار: <span className="text-gray-600 font-medium">{resort.minPrice} - {resort.maxPrice} دينار</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                التقييم: <span className="text-pink-600 font-medium">{resort.rating}</span>
              </p>
              <p className="text-lg font-semibold mb-4">
                حالة التوفر: <span className={resort.available ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {resort.available ? 'متاح' : 'غير متاح'}
                </span>
              </p>
              <div className="flex space-x-4 gap-2">
                <button
                  onClick={() => handleEdit(resort._id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(resort._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyResorts;
