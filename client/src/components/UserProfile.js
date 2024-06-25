import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ user, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('الرجاء تسجبل الدخول للمتابعة.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
          return;
        }
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
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('الرجاء تسجبل الدخول للمتابعة.');
        return;
      }
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
    } finally {
      setProcessing(false);
    }
  };

  const handleWhatsAppContact = () => {
    window.location.href = `https://wa.me/${phone}`;
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
          <p className="mt-2 text-xl">الايميل: {profile.email}</p>
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
                {processing ? 'Processing...' : 'تحديث الملف الشخصي'}
              </button>
            </form>
          ) : (
            <div className="mt-4">
              <button
                onClick={handleWhatsAppContact}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                تواصل عبر الواتساب
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
