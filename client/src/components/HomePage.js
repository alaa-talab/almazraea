import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { FaRegSadCry, FaSearch, FaMapMarkerAlt, FaDollarSign, FaCamera, FaHome, FaUserCircle} from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { LuPalmtree } from "react-icons/lu";
import './HomePage.css';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';


const HomePage = ({ user, setUser, onLogout }) => {
  const [resorts, setResorts] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);

  const Footer = () => (
    <footer className="bg-pink-600 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-4 md:mb-0">
          <Link to="/" className="mb-4 md:mb-0 pl-5">
            <img src="https://res.cloudinary.com/dvcfefmys/image/upload/v1718994491/almazraea_Logo_white-01_ntdzfs.png" alt="Logo" className="h-14" />
          </Link>
          <ul className="flex flex-col md:flex-row md:space-x-8">
            <li><Link to="/about" className="hover:underline pl-6">عن المزرعة</Link></li>
            <li><Link to="/contact" className="hover:underline">اتصل بنا</Link></li>
            <li><Link to="/terms" className="hover:underline">إتفاقية الاستخدام</Link></li>
            <li><Link to="/privacy" className="hover:underline">سياسة الخصوصية</Link></li>
            <li><Link to="/content-policy" className="hover:underline">سياسة المحتوى</Link></li>
          </ul>
        </div>
        <div className="flex mb-4 md:mb-0">
          <a href="https://facebook.com" className="hover:underline pl-5"><FaFacebook size={20} /></a>
          <a href="https://twitter.com" className="hover:underline pl-5"><FaTwitter size={20} /></a>
          <a href="https://instagram.com" className="hover:underline pl-5"><FaInstagram size={20} /></a>
          <a href="mailto:support@example.com" className="hover:underline pl-5"><FaEnvelope size={24} /></a>
          <a href="tel:+123456789" className="hover:underline pl-5"><FaPhoneAlt size={24} /></a>
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
        <p>جميع الحقوق محفوظة لموقع المزرعة. {new Date().getFullYear()} ©</p>
      </div>
      </div>
    </footer>
  );

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/resorts');
        setResorts(response.data);
      } catch (error) {
        console.error('Error fetching resorts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();

    const fetchUserProfilePicture = async () => {
      if (user?.userId) {
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
      }
    };

    if (user) {
      fetchUserProfilePicture();
    }
  }, [user]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/resorts', {
        params: { name, location, minPrice, maxPrice }
      });
      setResorts(response.data);
    } catch (error) {
      console.error('Error searching resorts:', error);
    }
  };

  const defaultProfilePicture = 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png';

  return (
    <div className="font-arabic rtl">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dvcfefmys/image/upload/v1718824782/almazraea_Logo_2-01_1_kriajv.png" alt="Logo" className="h-12 md:h-16" />
          </Link>
          <nav className="flex items-center">
            <div className="flex items-center md:hidden">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-600 focus:outline-none">
                <FiMenu size={28} />
              </button>
            </div>
            <ul className="hidden md:flex items-center space-x-4 ml-4">
              <li><Link to="/" className="text-pink-600 hover:text-pink-800 transition duration-300 pl-4">الصفحة الرئيسية</Link></li>
              <li><Link to="/resorts" className="text-pink-600 hover:text-pink-800 transition duration-300 flex items-center"><LuPalmtree className="ml-2" />مزارع</Link></li>
              {user?.role === 'owner' && (
                <>
                  <li>
                    <Link to="/add-resort">
                      <button className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300 flex items-center">
                        <FaCamera className="ml-2 mb-1" /> اضف مزرعتك الان
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/myresorts">
                      <button className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300 flex items-center">
                        <FaHome className="ml-2 mb-1" size={20} /> مزارعي
                      </button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="relative ml-4 hidden md:block">
              {user ? (
                <>
                  <button className="focus:outline-none" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <img
                      src={userProfilePicture || defaultProfilePicture}
                      alt="Profile"
                      className="h-10 w-10 rounded-full"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link to={`/user-profile/${user.userId}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"><FaUserCircle className="ml-2" />الملف الشخصي</Link>
                      {user.role === 'owner' && (
                        <Link to="/add-resort" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">اضف مزرعتك الان</Link>
                      )}
                      <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                         تسجيل خروج
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-pink-600 hover:text-pink-800 transition duration-300 ml-4">تسجيل الدخول</Link>
                  <Link to="/register" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300">التسجيل</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        {dropdownOpen && (
          <div className="md:hidden bg-white shadow-lg py-2">
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="block px-4 py-2 text-pink-600 hover:text-pink-800">الصفحة الرئيسية</Link></li>
              <li><Link to="/resorts" className="block px-4 py-2 text-pink-600 hover:text-pink-800 flex items-center"><LuPalmtree className="ml-2" />مزارع</Link></li>
              {user?.role === 'owner' && (
                <>
                  <li><Link to="/add-resort" className="block px-4 py-2 text-pink-600 hover:text-pink-800">اضف مزرعتك الان </Link></li>
                  <li><Link to="/myresorts" className="block px-4 py-2 text-pink-600 hover:text-pink-800">مزارعي</Link></li>
                </>
              )}
              {user && (
                <>
                  <li><Link to={`/user-profile/${user.userId}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"><FaUserCircle className="ml-2" />الملف الشخصي</Link></li>
                  <li>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                     تسجيل خروج
                    </button>
                  </li>
                </>
              )}
              {!user && (
                <>
                  <li><Link to="/login" className="block px-4 py-2 text-pink-600 hover:text-pink-800">تسجيل الدخول</Link></li>
                  <li><Link to="/register" className="block px-4 py-2 bg-pink-600 text-white hover:bg-pink-800">التسجيل</Link></li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4">
            <FaSearch className="text-ed0056 ml-4 text-pink-600" />
            <input
              type="text"
              placeholder="اسم المزرعة..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-1 px-3 w-full md:w-1/4">
            <FaMapMarkerAlt className="text-ed0056 ml-3 text-pink-600 mb-1" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent outline-none"
            >
              <option value="">اختر الموقع</option>
              <option value="عمان">عمان</option>
              <option value="جرش">جرش</option>
              <option value="عجلون">عجلون</option>
              <option value="العقبه">العقبه</option>
              <option value="الجوفة">الجوفة</option>
              <option value="الاغوار">الاغوار</option>
            </select>
          </div>
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4">
            <FaDollarSign className="text-ed0056 ml-3 text-pink-600 mb-1" />
            <input
              type="number"
              placeholder="الحد الأدنى للسعر"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4">
            <FaDollarSign className="text-ed0056 ml-3 text-pink-600 mb-1" />
            <input
              type="number"
              placeholder="الحد الأقصى للسعر"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-pink-600 text-white py-2 px-5 rounded hover:bg-pink-800 transition duration-300"
          >
            بحث
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        resorts.length > 0 ? (
          <section className="container mx-auto mt-0 mb-0 pt-0 pb-0 bg-cover bg-center h-screen">
            <div className="container mx-auto px-4 pt-10 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 text-center md:text-right text-black">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">أول موقع مختص بالمزارع في الأردن</h1>
                <p className="mt-4 text-lg md:text-xl">
                  مرحبًا بكم في <strong>موقع المزرعة في الأردن</strong>، وجهتكم الأولى للبحث عن المزارع المثالية في جميع أنحاء المملكة الأردنية. نحن هنا لنساعدك في العثور على المزرعة التي تناسب احتياجاتك، سواء كنت تبحث عن مكان هادئ في جبال عجلون أو شواطئ العقبة الساحرة.
                </p>
                <p className="mt-4 text-lg md:text-xl">
                  استعرض مجموعة متنوعة من المزارع في المواقع المختلفة مثل عمان، جرش، عجلون، العقبة، الجوفة، والأغوار. يمكنك الإعلان عن مزرعتك بسهولة ومشاركة صورها مع الآخرين.
                </p>
                <p className="mt-4 text-lg md:text-xl">
                  هدفنا هو تسهيل عملية البحث والإعلان لتجربة مريحة وسهلة. ابحث الآن عن المزرعة المناسبة لك في الأردن.
                </p>
                <Link to="/resorts" className="mt-4 inline-block bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300">
                  اكتشف المزيد
                </Link>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <img src="https://res.cloudinary.com/dvcfefmys/image/upload/v1718837781/almazraea_hero_section-01_kj4xws.png" alt="Hero" className="w-full h-auto animate-moving-image" />
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center mt-10">
            <FaRegSadCry size={50} className="mx-auto text-pink-600" />
            <p className="mt-4 text-lg md:text-xl">لم يتم العثور على أي مزرعة. حاول تعديل معايير البحث الخاصة بك والمحاولة مرة أخرى.</p>
          </div>
        )
      )}

      <section className="container isolate mx-auto mt-0 pr-4 pl-4 pt-40 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map(resort => (
            <div key={resort._id} className="bg-white rounded shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <LazyLoad height={200} offset={100}>
                <img src={resort.photoBanner} alt={resort.name} className="w-full h-48 object-cover" />
              </LazyLoad>
              <div className="p-4">
                <h3 className="text-2xl font-bold text-pink-600">{resort.name}</h3>
                <p className="mt-2 text-gray-600">{resort.description}</p>
                <div className="flex items-center mt-4">
                  <img
                    src={resort.owner?.profilePicture || defaultProfilePicture}
                    alt={resort.owner?.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className='px-2'>
                  <span className="ml-2">{resort.owner?.username}</span>
                  </div>
                </div>
                <p className="mt-2">
                  حالة التوفر: <span className={resort.available ? 'text-green-600 px-1' : 'text-red-600 px-1 '}>{resort.available ? 'متاح' : 'غير متاح'}</span>
                </p>
                <Link to={`/resorts/${resort._id}`} className="mt-2 inline-block bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300">
                  اكتشف المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
