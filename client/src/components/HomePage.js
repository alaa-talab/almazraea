import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import ChatWindow from './ChatWindow';

const HomePage = ({ user, setUser }) => {
  const [resorts, setResorts] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchResorts = async () => {
      const response = await axios.get('http://localhost:5000/resorts');
      setResorts(response.data);
    };
    fetchResorts();
  }, []);

  const handleSearch = async () => {
    const response = await axios.get('http://localhost:5000/resorts', {
      params: { name, location, minPrice, maxPrice }
    });
    setResorts(response.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <div className="font-arabic rtl">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-xl font-bold">المزرعة</div>
          <nav className="flex items-center">
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900">الصفحة الرئيسية</Link></li>
              <li><Link to="/resorts" className="text-gray-600 hover:text-gray-900">المنتجعات</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">حول</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">اتصل</Link></li>
              {user?.role === 'owner' && (
                <li>
                  <Link to="/add-resort">
                    <button>إضافة منتجع</button>
                  </Link>
                </li>
              )}
            </ul>
            <div className="flex items-center ml-4 space-x-4">
              <input 
                type="text" 
                placeholder="اسم المنتجع..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded py-2 px-3"
              />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded py-2 px-3"
              >
                <option value="">اختر الموقع</option>
                <option value="عمان">عمان</option>
                <option value="جرش">جرش</option>
                <option value="عجلون">عجلون</option>
                <option value="العقبه">العقبه</option>
                <option value="الجوفة">الجوفة</option>
                <option value="الاغوار">الاغوار</option>
              </select>
              <input
                type="number"
                placeholder="الحد الأدنى للسعر"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded py-2 px-3"
              />
              <input
                type="number"
                placeholder="الحد الأقصى للسعر"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded py-2 px-3"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                بحث
              </button>
              {user ? (
                <div className="relative">
                  <button className="focus:outline-none">
                    <img
                      src={user.profilePicture || 'path_to_default_profile_picture'}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to={`/user-profile/${user.userId}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">الملف الشخصي</Link>
                    {user.role === 'owner' && (
                      <Link to="/add-resort" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">إضافة منتجع</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      تسجيل خروج
                    </button>
                    <button
                      onClick={toggleChat}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      دردشة
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">تسجيل الدخول</Link>
                  <Link to="/register" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">التسجيل</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {resorts.length > 0 && (
        <section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${resorts[0].photoBanner})` }}>
          <div className="container mx-auto px-4 py-32 text-center text-white">
            <h1 className="text-5xl font-bold">{resorts[0].name}</h1>
            <p className="mt-4 text-xl">{resorts[0].description}</p>
            <div className="flex justify-center items-center mt-4">
              <img
                src={resorts[0].owner.profilePicture || 'path_to_default_profile_picture'}
                alt={resorts[0].owner.username}
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2">{resorts[0].owner.username}</span>
            </div>
            <Link to={`/resorts/${resorts[0]._id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              اكتشف المزيد
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map(resort => (
            <div key={resort._id} className="bg-white rounded shadow-lg overflow-hidden">
              <LazyLoad height={200} offset={100}>
                <img src={resort.photoBanner} alt={resort.name} className="w-full h-48 object-cover"/>
              </LazyLoad>
              <div className="p-4">
                <h3 className="text-2xl font-bold">{resort.name}</h3>
                <p className="mt-2 text-gray-600">{resort.description}</p>
                <div className="flex items-center mt-4">
                  <img
                    src={resort.owner.profilePicture || 'path_to_default_profile_picture'}
                    alt={resort.owner.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2">{resort.owner.username}</span>
                </div>
                <Link to={`/resorts/${resort._id}`} className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                  اكتشف المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <ul className="flex space-x-4">
              <li><Link to="/privacy" className="hover:underline">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="hover:underline">شروط الخدمة</Link></li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:underline">فيسبوك</a>
            <a href="https://twitter.com" className="hover:underline">تويتر</a>
            <a href="https://instagram.com" className="hover:underline">إنستغرام</a>
          </div>
        </div>
      </footer>
      
      {chatOpen && <ChatWindow user={user} onClose={toggleChat} />}
    </div>
  );
};

export default HomePage;
