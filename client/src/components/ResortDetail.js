import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ResortDetail = ({ user }) => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/resorts/${id}`);
        setResort(response.data);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching resort:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResort();
  }, [id]);

  useEffect(() => {
    console.log('User object:', user); // Log the user object for debugging
  }, [user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    console.log('User object:', user); // Log the user object for debugging

    try {
      const payload = { text: commentText, user: user.userId }; // Use user.userId instead of user._id
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

      console.log('Sending request payload:', payload);
      console.log('Sending request headers:', headers);

      const response = await axios.post(`http://localhost:5000/resorts/${id}/comments`, payload, { headers });
      setComments(response.data.comments);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!resort) {
    return <p>Resort not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold">{resort.name}</h1>
      <p className="mt-4 text-xl">{resort.description}</p>
      <p className="mt-4 text-xl">الموقع: {resort.location}</p>
      <div className="mt-4">
        {resort.images && resort.images.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4">صور المنتجع</h2>
            <div className="flex space-x-4">
              {resort.images.map((image, index) => (
                <img key={index} src={image} alt={resort.name} className="w-1/3 h-48 object-cover" />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        {resort.videos && resort.videos.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4">فيديوهات المنتجع</h2>
            <div className="flex space-x-4">
              {resort.videos.map((video, index) => (
                <video key={index} controls className="w-1/3 h-48">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-xl">رقم الهاتف: {resort.phone}</p>
      <p className="mt-4 text-xl">
        رابط الموقع:{' '}
        <a href={resort.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {resort.locationLink}
        </a>
      </p>
      <p className="mt-4 text-xl">نطاق الأسعار: {resort.minPrice} - {resort.maxPrice}</p>
      <p className="mt-4 text-xl">التقييم: {resort.rating} / 5</p>
      <div className="flex items-center mt-4">
        <img
          src={resort.owner.profilePicture}
          alt={resort.owner.username}
          className="h-8 w-8 rounded-full"
        />
        <Link to={`/user-profile/${resort.owner._id}`} className="ml-2 text-gray-600 hover:underline">
          {resort.owner.username}
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-bold">التعليقات</h2>
        {comments.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {comments.map((comment) => (
              <li key={comment._id} className="bg-gray-100 p-4 rounded">
                <div className="flex items-center">
                  <img src={comment.user?.profilePicture} alt={comment.user?.username} className="h-8 w-8 rounded-full" />
                  <span className="ml-2 font-bold">{comment.user?.username}</span>
                </div>
                <p className="mt-2">{comment.text}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد تعليقات حتى الآن.</p>
        )}
        {user && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="أضف تعليقًا..."
              required
              className="w-full px-3 py-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
              إرسال
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResortDetail;
