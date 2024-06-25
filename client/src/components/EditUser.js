import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          return;
        }
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setRole(response.data.role);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('role', role);
      if (password) {
        formData.append('password', password);
      }
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      await axios.put(`http://localhost:5000/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/cp-admin/manage-users'); // Correct route
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">تعديل المستخدم</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="اتركه فارغًا إذا كنت لا تريد تغييره"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">الدور</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">مستخدم</option>
            <option value="owner">مالك</option>
            <option value="admin">مشرف</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">صورة الملف الشخصي</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          تحديث
        </button>
      </form>
    </div>
  );
};

export default EditUser;
