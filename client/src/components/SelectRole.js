import React, { useState } from 'react';


const SelectRole = () => {
  const [role, setRole] = useState('user');
  

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const proceedWithGoogleLogin = () => {
    window.open(`http://localhost:5000/auth/google?role=${role}`, '_self');
  };

  const proceedWithFacebookLogin = () => {
    window.open(`http://localhost:5000/auth/facebook?role=${role}`, '_self');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">اختر الدور</h1>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">الدور</label>
          <select
            value={role}
            onChange={(e) => handleRoleSelect(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="user">مستخدم</option>
            <option value="owner">مالك</option>
          </select>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={proceedWithGoogleLogin}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mx-1"
          >
            التسجيل باستخدام جوجل
          </button>
          <button
            onClick={proceedWithFacebookLogin}
            className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 mx-1"
          >
            التسجيل باستخدام فيسبوك
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
