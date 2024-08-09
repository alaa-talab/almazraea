import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CPAdmin = ({ setAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [num1] = useState(Math.floor(Math.random() * 10));
  const [num2] = useState(Math.floor(Math.random() * 10));
  const [answer, setAnswer] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (parseInt(answer) !== num1 + num2) {
      setError('خطأ في حل التحدي.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        username,
        password,
        rememberMe
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      setAdmin({ role });
      navigate('/cp-admin/dashboard');
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-arabic rtl ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-pink-600">تسجيل دخول الإدارة</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">حل التحدي: {num1} + {num2} = ؟</label>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-700 text-sm font-medium px-1">تذكرني</label>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-150 ease-in-out"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default CPAdmin;
