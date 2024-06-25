import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ManageResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/resorts');
        setResorts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, []);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">إدارة المنتجعات</h1>
      <button
        onClick={() => navigate('/add-resort')}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
      >
        إضافة منتجع
      </button>
      <ul className="space-y-4">
        {resorts.map(resort => (
          <li key={resort._id} className="bg-white rounded shadow-lg p-4">
            <h2 className="text-2xl font-bold">{resort.name}</h2>
            <p className="text-gray-600">{resort.description}</p>
            <div className="flex space-x-4 mt-4">
              <Link to={`/edit-resort/${resort._id}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">تعديل</Link>
              <button onClick={() => handleDelete(resort._id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageResorts;
