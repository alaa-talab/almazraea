import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', phone: '', role: 'user' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          return;
        }

        const response = await axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/users', newUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers([...users, response.data]);
      setNewUser({ username: '', email: '', password: '', phone: '', role: 'user' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم وكل البيانات المرتبطة به؟');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-8">إدارة المستخدمين</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAddUser} className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">إضافة مستخدم جديد</h2>
        <div>
          <label className="block text-gray-700 mb-2">اسم المستخدم</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">رقم الهاتف</label>
          <input
            type="text"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">الدور</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">مستخدم</option>
            <option value="owner">مالك</option>
            <option value="admin">مشرف</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          إضافة
        </button>
      </form>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="bg-white rounded shadow-lg p-4">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <div className="flex space-x-4 mt-4">
              <Link to={`/cp-admin/edit-user/${user._id}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">تعديل</Link>
              <button 
                onClick={() => handleDeleteUser(user._id)} 
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
