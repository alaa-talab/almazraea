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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل دخول الإدارة</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">حل التحدي: {num1} + {num2} = ؟</label>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              تذكرني
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default CPAdmin;
