import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomepageSettings = () => {
  const [resorts, setResorts] = useState([]);
  const [selectedResorts, setSelectedResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resortsPerPage = 8;

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get('https://www.almazraea.com/api/resorts');
        setResorts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();

    const fetchSelectedResorts = async () => {
      try {
        const response = await axios.get('https://www.almazraea.com/api/homepage-resorts');
        setSelectedResorts(response.data.map(resort => resort._id));
      } catch (error) {
        setError(error);
      }
    };
    fetchSelectedResorts();
  }, []);

  const handleSelect = (id) => {
    setSelectedResorts((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(resortId => resortId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      await axios.post('https://www.almazraea.com/api/homepage-resorts', { resorts: selectedResorts }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('تم حفظ إعدادات الصفحة الرئيسية بنجاح.');
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      setError('Failed to save settings.');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter resorts based on the search term
  const filteredResorts = resorts.filter(resort =>
    resort.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastResort = currentPage * resortsPerPage;
  const indexOfFirstResort = indexOfLastResort - resortsPerPage;
  const currentResorts = filteredResorts.slice(indexOfFirstResort, indexOfLastResort);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p className="text-center text-gray-500">جاري التحميل...</p>;
  if (error) return <p className="text-center text-red-500">خطأ: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16 font-arabic rtl">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">إعدادات الصفحة الرئيسية</h1>
      <input
        type="text"
        placeholder="ابحث عن مزرعة..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-6 p-4 rounded border border-gray-300"
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResorts.map(resort => (
          <li key={resort._id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">{resort.name} - {resort.sequence}</h2>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-pink-600"
                  checked={selectedResorts.includes(resort._id)}
                  onChange={() => handleSelect(resort._id)}
                />
                <span className="ml-2 px-4 text-gray-600">عرض على الصفحة الرئيسية</span>
              </label>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-10">
        <button
          onClick={handleSave}
          className="bg-pink-600 text-white py-3 px-8 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50 shadow-lg"
        >
          حفظ الإعدادات
        </button>
      </div>
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

export default HomepageSettings;
