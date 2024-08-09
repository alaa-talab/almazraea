import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegSadCry, FaSearch, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import LazyLoad from 'react-lazyload';
import './HomePage.css';
import Header from './Header';

function Resorts({ user, onLogout }) {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');


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
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the resorts!', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchResorts();
  }, []);

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

  const defaultProfilePicture = 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png';

  return (
    <div className="font-arabic"> 
    <Header user={user} onLogout={onLogout} />
    <div className="font-arabic rtl container mx-auto px-4 pt-6 ">
      <div className="container mx-auto px-6 pb-2">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4  hover:border-pink-600 rounded-lg">
            <FaSearch className="text-ed0056 ml-4 text-pink-600" />
            <input
              type="text"
              placeholder="اسم المزرعة..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-1 px-3 w-full md:w-1/4 hover:border-pink-600 rounded-lg">
            <FaMapMarkerAlt className="text-ed0056 ml-3 text-pink-600 mb-1" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent transition-all cursor-pointer  outline-none  "
            >
              <option value="" disabled selected hidden >اختر الموقع</option>
              <option value="عمان">عمان</option>
              <option value="جرش">جرش</option>
              <option value="عجلون">عجلون</option>
              <option value="العقبه">العقبه</option>
              <option value="الجوفة">الجوفة</option>
              <option value="الاغوار">الاغوار</option>
            </select>
          </div>
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4 hover:border-pink-600 rounded-lg">
            <FaDollarSign className="text-ed0056 ml-3 text-pink-600 mb-1" />
            <input
              type="number"
              placeholder="الحد الأدنى للسعر"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-2 px-3 w-full md:w-1/4 hover:border-pink-600 rounded-lg">
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
            className="bg-pink-600 text-white py-2 px-5 rounded hover:bg-pink-800 transition duration-300 rounded-lg"
          >
            بحث
          </button>
        </div>
      </div>

      <section className="container isolate mx-auto mt-0 pr-4 pl-4 pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map(resort => (
            <div key={resort._id} className="bg-white rounded shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <LazyLoad height={200} offset={100}>
                <img src={resort.photoBanner} alt={resort.name} className="w-full h-48 object-cover" />
              </LazyLoad>
              <div className="p-4">
                <h3 className="text-2xl font-bold text-pink-600">{resort.name}</h3>
                <h4 className="mt-2 text-gray-600">{resort.description}</h4>
                <div className='flex items-center mt-2'>
                <FaMapMarkerAlt className="text-ed0056 ml-2 text-pink-600 " />
                <p className='mt-2 text-gray-600 font-bold'>الموقع: <span className='mt-2 font-normal'>{resort.location}</span> </p>
                </div>
                <div className="flex items-center mt-4">
                  <img
                    src={resort.owner?.profilePicture || defaultProfilePicture}
                    alt={resort.owner?.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className='px-2'>
                  <Link to={`/user-profile/${resort.owner._id}`} className="ml-2 text-gray-600 hover:text-pink-600"> <span className="ml-2 text-black-800 font-medium ">{resort.owner?.username}</span></Link>
                  </div>
                </div>
                <p className="mt-2 py-3 font-bold">
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
    </div>
    <Footer />
    </div>
  );
}

export default Resorts;
