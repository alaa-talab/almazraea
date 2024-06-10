import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ResortDetail = () => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/resorts/${id}`);
        setResort(response.data);
      } catch (error) {
        console.error('Error fetching resort:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResort();
  }, [id]);

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
      <div className="flex space-x-4 mt-4">
        {resort.images && resort.images.length > 0 && resort.images.map((image, index) => (
          <img key={index} src={image} alt={resort.name} className="w-1/3 h-48 object-cover"/>
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        {resort.videos && resort.videos.length > 0 && resort.videos.map((video, index) => (
          <video key={index} controls className="w-1/3 h-48">
            <source src={video} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
      <p className="mt-4 text-xl">رقم الهاتف: {resort.phone}</p>
      <p className="mt-4 text-xl">رابط الموقع: <a href={resort.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{resort.locationLink}</a></p>
      <p className="mt-4 text-xl">نطاق الأسعار: {resort.price}</p>
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
    </div>
  );
};

export default ResortDetail;
