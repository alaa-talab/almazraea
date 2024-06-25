import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomepageSettings = () => {
  const [resorts, setResorts] = useState([]);
  const [selectedResorts, setSelectedResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const fetchSelectedResorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/homepage-resorts');
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
      await axios.post('http://localhost:5000/homepage-resorts', { resorts: selectedResorts });
      alert('تم حفظ إعدادات الصفحة الرئيسية بنجاح.');
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      setError('Failed to save settings.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">إعدادات الصفحة الرئيسية</h1>
      <ul className="space-y-4">
        {resorts.map(resort => (
          <li key={resort._id} className="bg-white rounded shadow-lg p-4">
            <h2 className="text-2xl font-bold">{resort.name}</h2>
            <label>
              <input
                type="checkbox"
                checked={selectedResorts.includes(resort._id)}
                onChange={() => handleSelect(resort._id)}
              />
              <span className="ml-2">عرض على الصفحة الرئيسية</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
      >
        حفظ الإعدادات
      </button>
    </div>
  );
};

export default HomepageSettings;
