import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload'; // Make sure to install react-lazyload

const ManageResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resortsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/resorts');
        setResorts(response.data);
        setFilteredResorts(response.data); // Initialize filteredResorts
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, []);

  useEffect(() => {
    const filtered = resorts.filter(resort =>
      resort.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResorts(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, resorts]);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastResort = currentPage * resortsPerPage;
  const indexOfFirstResort = indexOfLastResort - resortsPerPage;
  const currentResorts = filteredResorts.slice(indexOfFirstResort, indexOfLastResort);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16 font-arabic rtl">
      <h1 className="text-5xl font-bold mb-8">إدارة المنتجعات</h1>

      <div className="mb-8 flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ابحث عن منتجع..."
          className="border border-gray-300 rounded py-2 px-4 w-full md:w-1/2"
        />
      </div>

      <button
        onClick={() => navigate('/add-resort')}
        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700 mb-4"
      >
        إضافة منتجع
      </button>

      <ul className="space-y-4">
        {currentResorts.map(resort => (
          <li key={resort._id} className="bg-white rounded shadow-lg p-4">
            <LazyLoad height={200} offset={100}>
              <img
                src={resort.photoBanner}
                alt={resort.name}
                className="w-full h-48 object-cover mb-4"
              />
            </LazyLoad>
            <h2 className="text-2xl font-bold">{resort.name}</h2>
            <p className="text-gray-600">{resort.description}</p>
            <div className="flex space-x-4 mt-4 gap-3">
              <Link to={`/edit-resort/${resort._id}`} className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700">تعديل</Link>
              <button onClick={() => handleDelete(resort._id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">حذف</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:bg-gray-300"
        >
          السابق
        </button>
        <span>الصفحة {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * resortsPerPage >= filteredResorts.length}
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:bg-gray-300"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default ManageResorts;
