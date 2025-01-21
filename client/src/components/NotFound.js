import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center items-center">
        <FaExclamationTriangle className="text-red-500 text-9xl" />
      </div>
      <h1 className="text-6xl font-bold mb-8 text-gray-800">خطأ 404</h1>
      <p className="text-2xl mb-8 text-gray-600">الصفحة التي تبحث عنها غير موجودة.</p>
      <Link to="/" className="bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
