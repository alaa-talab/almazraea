import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios

// Function to fetch real data from backend
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return {
        resortsCount: 0,
        usersCount: 0,
        bookingsCount: 0,
      };
    }

    const response = await axios.get('http://localhost:5000/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      resortsCount: response.data.totalResorts,
      usersCount: response.data.totalUsers,
      bookingsCount: response.data.recentResorts.length, // Adjust as needed
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      resortsCount: 0,
      usersCount: 0,
      bookingsCount: 0,
    };
  }
};


const AdminDashboard = ({ onLogout }) => {
  const [data, setData] = useState({
    resortsCount: 0,
    usersCount: 0,
    bookingsCount: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const result = await fetchDashboardData();
      setData(result);
    };

    getData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-arabic rtl">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8 text-center text-pink-600">لوحة تحكم الإدارة</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-pink-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">إجمالي المنتجعات</h2>
            <p className="text-2xl font-bold text-pink-900">{data.resortsCount}</p>
            <Link
              to="/cp-admin/manage-resorts"
              className="text-pink-600 hover:text-pink-800 hover:underline mt-4 block"
            >
              إدارة المنتجعات
            </Link>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-4">إجمالي المستخدمين</h2>
            <p className="text-2xl font-bold text-green-900">{data.usersCount}</p>
            <Link
              to="/cp-admin/manage-users"
              className="text-green-600 hover:text-green-800 hover:underline mt-4 block"
            >
              إدارة المستخدمين
            </Link>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">إجمالي الحجوزات</h2>
            <p className="text-2xl font-bold text-yellow-900">{data.bookingsCount}</p>
            <Link
              to="/cp-admin/manage-resorts" // Add the route for managing bookings
              className="text-yellow-600 hover:text-yellow-800 hover:underline mt-4 block"
            >
              إدارة الحجوزات
            </Link>
          </div>
        </div>

        <nav className="flex flex-col space-y-4 mt-6">
          <Link
            to="/cp-admin/manage-resorts"
            className="text-pink-600 hover:text-pink-800 hover:underline text-lg font-medium transition duration-150 ease-in-out"
          >
            إدارة المنتجعات
          </Link>
          <Link
            to="/cp-admin/manage-users"
            className="text-pink-600 hover:text-pink-800 hover:underline text-lg font-medium transition duration-150 ease-in-out"
          >
            إدارة المستخدمين
          </Link>
          <Link
            to="/cp-admin/homepage-settings"
            className="text-pink-600 hover:text-pink-800 hover:underline text-lg font-medium transition duration-150 ease-in-out"
          >
            إعدادات الصفحة الرئيسية
          </Link>
          <button
            onClick={onLogout}
            className="text-red-600 hover:text-red-800 hover:underline text-lg font-medium transition duration-150 ease-in-out"
          >
            تسجيل خروج
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
