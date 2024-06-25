import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">لوحة تحكم الإدارة</h1>
        <nav className="flex flex-col space-y-4 mt-6">
          <Link to="/cp-admin/manage-resorts" className="text-blue-500 hover:underline">إدارة المنتجعات</Link>
          <Link to="/cp-admin/manage-users" className="text-blue-500 hover:underline">إدارة المستخدمين</Link>
          <Link to="/cp-admin/homepage-settings" className="text-blue-500 hover:underline">إعدادات الصفحة الرئيسية</Link>
          <button onClick={onLogout} className="text-red-500 hover:underline">تسجيل خروج</button>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
