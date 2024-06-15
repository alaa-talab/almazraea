import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';

const HomePage = ({ user, setUser, onLogout }) => {
  const [resorts, setResorts] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState('');

  useEffect(() => {
    const fetchResorts = async () => {
      const response = await axios.get('http://localhost:5000/resorts');
      setResorts(response.data);
    };
    fetchResorts();

    const fetchUserProfilePicture = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`http://localhost:5000/user/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error('Error fetching user profile picture:', error);
      }
    };

    if (user) {
      fetchUserProfilePicture();
    }
  }, [user]);

  const handleSearch = async () => {
    const response = await axios.get('http://localhost:5000/resorts', {
      params: { name, location, minPrice, maxPrice }
    });
    setResorts(response.data);
  };

  const defaultProfilePicture = 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png';

  return (
    <div className="font-arabic rtl">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dvcfefmys/image/upload/v1718279556/almazraea_Logo-01-removebg-preview_pokblu.png" alt="Logo" className="h-16 md:h-20 mr-4" />
          </Link>
          <nav className="flex items-center space-x-4">
            <ul className="flex items-center space-x-2 md:space-x-4">
              <li><Link to="/" className="text-pink-600 hover:text-pink-800">الصفحة الرئيسية</Link></li>
              <li><Link to="/resorts" className="text-pink-600 hover:text-pink-800">المنتجعات</Link></li>
              <li><Link to="/about" className="text-pink-600 hover:text-pink-800">حول</Link></li>
              <li><Link to="/contact" className="text-pink-600 hover:text-pink-800">اتصل</Link></li>
              {user?.role === 'owner' && (
                <li>
                  <Link to="/add-resort">
                    <button className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800">إضافة منتجع</button>
                  </Link>
                </li>
              )}
            </ul>
            <div className="flex items-center space-x-2 md:space-x-4 ml-4">
              <input 
                type="text" 
                placeholder="اسم المنتجع..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded py-2 px-3 w-20 md:w-32"
              />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded py-2 px-3 w-20 md:w-32"
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
                className="border rounded py-2 px-3 w-20 md:w-32"
              />
              <input
                type="number"
                placeholder="الحد الأقصى للسعر"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded py-2 px-3 w-20 md:w-32"
              />
              <button
                onClick={handleSearch}
                className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800"
              >
                بحث
              </button>
              {user ? (
                <div className="relative">
                  <button className="focus:outline-none" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <img
                      src={userProfilePicture || defaultProfilePicture}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link to={`/user-profile/${user.userId}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">الملف الشخصي</Link>
                      {user.role === 'owner' && (
                        <Link to="/add-resort" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">إضافة منتجع</Link>
                      )}
                      <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        تسجيل خروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-4">
                  <Link to="/login" className="text-pink-600 hover:text-pink-800">تسجيل الدخول</Link>
                  <Link to="/register" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800">التسجيل</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {resorts.length > 0 && (
        <section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${resorts[0].photoBanner})` }}>
          <div className="container mx-auto px-4 py-32 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{resorts[0].name}</h1>
            <p className="mt-4 text-lg md:text-xl">{resorts[0].description}</p>
            <div className="flex justify-center items-center mt-4">
              <img
                src={resorts[0].owner.profilePicture || defaultProfilePicture}
                alt={resorts[0].owner.username}
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2">{resorts[0].owner.username}</span>
            </div>
            <Link to={`/resorts/${resorts[0]._id}`} className="mt-4 inline-block bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800">
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
                    src={resort.owner.profilePicture || defaultProfilePicture}
                    alt={resort.owner.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2">{resort.owner.username}</span>
                </div>
                <Link to={`/resorts/${resort._id}`} className="mt-2 inline-block bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800">
                  اكتشف المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-600 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
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
    </div>
  );
};

export default HomePage;
