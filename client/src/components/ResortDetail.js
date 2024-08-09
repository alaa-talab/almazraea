import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faDollarSign, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FeaturedImageGallery } from './FeaturedImageGallery';
import { faStar as fullStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

const ResortDetail = ({ user }) => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setProcessing(true);

    try {
      const payload = { text: commentText, user: user.userId };
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

      const response = await axios.post(`http://localhost:5000/resorts/${id}/comments`, payload, { headers });
      setComments(response.data.comments);
      setCommentText('');
      setCurrentPage(1); // Reset to the first page after a new comment is added
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!resort) {
    return <p className="text-center text-gray-500">Resort not found.</p>;
  }

  const defaultProfilePicture = 'https://res.cloudinary.com/dvcfefmys/image/upload/v1718042315/profile_avatar_Blank_User_Circles_kwxcyg.png';

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={fullStar} className="text-pink-600" />
        ))}
        {hasHalfStar && <FontAwesomeIcon icon={halfStar} className="text-pink-600" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={emptyStar} className="text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="font-arabic rtl bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-pink-600">{resort.name} - {resort.sequence}</h1>
        <p className="text-lg text-gray-600 mb-6">{resort.description}</p>
        <p className="text-lg mb-4 font-semibold">
          الموقع: <span className="text-pink-600 font-medium">{resort.location}</span>
        </p>
        <p className="text-lg mb-4 font-semibold">
          حالة التوفر: <span className={resort.available ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{resort.available ? 'متاح' : 'غير متاح'}</span>
        </p>
        <div className="text-xl mb-4 flex items-center">
          <a
            href={resort.locationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 hover:shadow-lg transition duration-300 ease-in-out"
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-white pl-4" />
            عرض الموقع
          </a>
        </div>
        {resort.images && resort.images.length > 0 && (
          <FeaturedImageGallery images={resort.images} videos={resort.videos} />
        )}

        <p className="text-lg text-black font-semibold flex items-center mb-6 pt-6">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-pink-600 px-2" />
          رقم الهاتف: <span className="text-gray-600 font-medium px-2">
            <a href={`tel:${resort.phone}`} className="hover:underline decoration-pink-600">
              {resort.phone}
            </a>
          </span>
        </p>
        
        <p className="text-lg text-black font-semibold flex items-center mb-6">
          <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-pink-600 px-3" />
          نطاق الأسعار: <span className="text-gray-600 font-medium px-2">{resort.minPrice} - {resort.maxPrice} دينار</span>
        </p>
        <p className="text-lg text-black font-semibold flex items-center mb-6 mr-2">
          التقييم:
          <span className="flex items-center ml-2 px-2">
            {renderStars(resort.rating)}
          </span>
        </p>

        <div className="flex items-center mb-8 px-2">
          <img
            src={resort.owner?.profilePicture || defaultProfilePicture}
            alt={resort.owner?.username || 'Unknown Owner'}
            className="h-8 w-8 rounded-full"
          />
          {resort.owner ? (
            <Link to={`/user-profile/${resort.owner._id}`} className="ml-2 font-semibold text-gray-700 hover:underline decoration-pink-600 px-2">
              {resort.owner.username}
            </Link>
          ) : (
            <span className="ml-2 text-gray-600">مستخدم عام</span>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-6">التعليقات</h2>
          {currentComments.length > 0 ? (
            <ul className="space-y-4">
              {currentComments.map((comment) => (
                <li key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <img src={comment.user?.profilePicture || defaultProfilePicture} alt={comment.user?.username || 'Unknown User'} className="h-8 w-8 rounded-full" />
                    <span className="ml-2 font-bold px-1">{comment.user?.username || 'Unknown User'}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">لا توجد تعليقات حتى الآن.</p>
          )}

          {comments.length > commentsPerPage && (
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`py-1 px-3 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } hover:bg-pink-500 hover:text-white transition duration-300`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          {user && (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 mb-4"
                rows="4"
                placeholder="أضف تعليقك..."
                disabled={processing}
              />
              <button
                type="submit"
                className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-300"
                disabled={processing}
              >
                {processing ? 'جارٍ الإرسال...' : 'إضافة تعليق'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResortDetail;
