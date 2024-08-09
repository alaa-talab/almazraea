import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
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
        setProfilePicture(response.data.profilePicture);
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
      if (newProfilePicture) {
        formData.append('profilePicture', newProfilePicture);
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

  const handleDeleteProfilePicture = async () => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف صورة الملف الشخصي؟');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/users/${id}/profile-picture`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfilePicture(null);
    } catch (error) {
      setError('Failed to delete profile picture. Please try again.');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-16 font-arabic rtl">
      <h1 className="text-5xl font-bold mb-8 text-center text-pink-600">تعديل المستخدم</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-700 mb-2">اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">الدور</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="user">مستخدم</option>
            <option value="owner">مالك</option>
            <option value="admin">مشرف</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">صورة الملف الشخصي</label>
          {profilePicture && (
            <div className="relative mb-4">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
              <button
                type="button"
                onClick={handleDeleteProfilePicture}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          )}
          <input
            type="file"
            onChange={(e) => setNewProfilePicture(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
          تحديث
        </button>
      </form>
    </div>
  );
};

export default EditUser;
