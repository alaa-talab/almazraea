import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', phone: '', role: 'user' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Search functionality
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-16 font-arabic rtl">
      <h1 className="text-4xl font-bold mb-8 text-center text-pink-600">إدارة المستخدمين</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="ابحث عن مستخدم"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">إضافة مستخدم جديد</h2>
        <div>
          <label className="block text-gray-700 mb-2">اسم المستخدم</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">رقم الهاتف</label>
          <input
            type="text"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">الدور</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="user">مستخدم</option>
            <option value="admin">مشرف</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
          إضافة
        </button>
      </form>

      {/* Users List */}
      <ul className="space-y-4">
        {currentUsers.map(user => (
          <li key={user._id} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold text-pink-600">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <div className="flex space-x-4 mt-4 gap-3">
              <Link to={`/cp-admin/edit-user/${user._id}`} className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
                تعديل
              </Link>
              <button 
                onClick={() => handleDeleteUser(user._id)} 
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700 disabled:bg-gray-400"
        >
          السابق
        </button>
        <span className="mx-4 text-lg font-semibold">
          صفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700 disabled:bg-gray-400"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default ManageUsers;
