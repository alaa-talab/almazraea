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

  if (loading) return <p className="text-center text-gray-600">جاري التحميل...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

 

  return (
    <div>
       

    <div className="container mx-auto px-4 py-16 font-arabic rtl ">
           
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">ملف المستخدم</h1>
      {profile && (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
          <img
  src={profile.profilePicture || 'https://via.placeholder.com/150'}
  alt={profile.username}
  className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-pink-600 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
/>
            <p className="text-xl font-semibold text-gray-800">{profile.username}</p>
            <p className="text-lg text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 mr-2 ml-2 mb-2  text-pink-600" viewBox="0 0 24 24">
                <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
              </svg>
              {profile.phone}
            </p>
            <p className="text-lg text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#db2777" className="w-5 h-5 mr-2 ml-2 text-pink-600" viewBox="0 0 24 24">
              <g id="style=stroke">
<g id="email">
<path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z" />
<path id="vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd" d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"/>
</g>
</g>
              </svg>
              {profile.email}
            </p>
          </div>
          {user && user.userId === id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-800 text-sm mb-2">الاسم</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="الاسم"
                  className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-sm mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-sm mb-2">صورة الملف الشخصي</label>
                <input
                  type="file"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600">
                {processing ? 'Processing...' : 'تحديث الملف الشخصي'}
              </button>
            </form>
          ) : (
            <button
            onClick={handleWhatsAppContact}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 flex items-center justify-center space-x-2"
          >
            <i className="fab fa-whatsapp px-2 fa-lg"></i>
            <span>تواصل عبر الواتساب</span>
          </button>
          )}
        </div>
      )}
    </div>
    </div>
  ); 
};

export default UserProfile;
