import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { token, role, userId } = response.data; // Include userId
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId); // Store userId
      setUser({ role, userId });
      navigate('/');
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.');
    }
  };

  const handleGoogleLogin = () => {
    navigate('/select-role');
  };

  const handleFacebookLogin = () => {
    navigate('/select-role');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mx-1"
          >
            تسجيل الدخول باستخدام جوجل
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 mx-1"
          >
            تسجيل الدخول باستخدام فيسبوك
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
