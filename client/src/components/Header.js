// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { FaCamera, FaUserCircle } from 'react-icons/fa';
import { LuPalmtree } from "react-icons/lu";
import axios from 'axios';



const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const defaultProfilePicture = 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png';
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleAddResortClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
  
    navigate('/add-resort');
  };

  const handleMyResortsClick = () => {
    navigate('/myresorts');
  };

  return (
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
          {user && (
            <li>
              <button
                onClick={handleMyResortsClick}
                className="text-pink-600 hover:text-pink-800 transition duration-300"
              >
                مزارعي
              </button>
            </li>
          )}
          <li>
            <button
              onClick={handleAddResortClick}
              className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-800 transition duration-300 flex items-center"
            >
              <FaCamera className="ml-2 mb-1" /> اضف مزرعتك الان
            </button>
          </li>
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
                  <Link to="/add-resort" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">اضف مزرعتك الان</Link>
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
          {user && (
            <li><button onClick={handleMyResortsClick} className="block px-4 py-2 text-pink-600 hover:text-pink-800">مزارعي</button></li>
          )}
          <li><button onClick={handleAddResortClick} className="block px-4 py-2 text-pink-600 hover:text-pink-800">اضف مزرعتك الان</button></li>
          {user && (
            <>
              <li><Link to={`/user-profile/${user.userId}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"><FaUserCircle className="ml-2 text-pink-600" />الملف الشخصي</Link></li>
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
  );
};

export default Header;
