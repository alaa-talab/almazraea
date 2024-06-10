import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validator.isEmail(email)) {
      setError('البريد الإلكتروني غير صالح.');
      return;
    }

    // Validate password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      setError('كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل بما في ذلك أحرف كبيرة وصغيرة وأرقام ورموز.');
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        email,
        username,
        password,
        phone,
        role
      });
      const { token, role: userRole, userId } = response.data; // Include userId
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('userId', userId); // Store userId
      setUser({ role: userRole, userId });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('فشل التسجيل. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.');
      }
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
        <h1 className="text-2xl font-bold mb-6 text-center">التسجيل</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
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
            <label className="block text-gray-700 mb-2">رقم الهاتف (اختياري)</label>
            <PhoneInput
              country={'jo'} // Specify Jordan as the default country
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputClass="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">الدور</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">مستخدم</option>
              <option value="owner">مالك</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            التسجيل
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mx-1"
          >
            التسجيل باستخدام جوجل
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 mx-1"
          >
            التسجيل باستخدام فيسبوك
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
