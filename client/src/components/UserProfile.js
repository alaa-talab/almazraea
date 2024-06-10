import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = ({ user, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
        setUsername(response.data.username);
        setPhone(response.data.phone);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('phone', phone);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      const response = await axios.put(`http://localhost:5000/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile(response.data);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    }
  };

  const startChat = () => {
    navigate(`/chat/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold">ملف المستخدم</h1>
      {profile && (
        <div className="mt-4">
          <img src={profile.profilePicture || 'default_profile_picture_url'} alt={profile.username} className="h-32 w-32 rounded-full" />
          <p className="mt-4 text-xl">الاسم: {profile.username}</p>
          <p className="mt-2 text-xl">رقم الهاتف: {profile.phone}</p>
          {user && user.userId === id ? (
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="الاسم"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="w-full px-3 py-2 border rounded"
              />
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                تحديث الملف الشخصي
              </button>
            </form>
          ) : (
            <button
              onClick={startChat}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              دردشة
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
