import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaPhone, FaMapMarkerAlt, FaLink, FaFileImage, FaFileVideo, FaDollarSign, FaClipboardList } from 'react-icons/fa';
import { MdOutlineHotel } from 'react-icons/md';

function AddResort({ user }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [photoBanner, setPhotoBanner] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const locationState = useLocation().state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadFiles(images, 'image');
      const videoUrls = await uploadFiles(videos, 'video');
      const bannerUrl = photoBanner ? await uploadFiles([photoBanner], 'image') : [];

      const newResort = {
        name,
        phone,
        location,
        locationLink,
        description,
        images: imageUrls,
        videos: videoUrls,
        photoBanner: bannerUrl[0],
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        available,
        rating: user?.role === 'admin' ? rating : 4, // Admin can set initial rating
        owner: locationState?.userId, // Ensure owner is set correctly
      };

      await axios.post('http://localhost:5000/resorts', newResort, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setName('');
      setPhone('');
      setLocation('');
      setLocationLink('');
      setDescription('');
      setImages([]);
      setVideos([]);
      setPhotoBanner(null);
      setMinPrice('');
      setMaxPrice('');
      setAvailable(true);  // Reset available state
      setRating('');  // Reset rating state
      setError('');

      // Navigate to MyResorts page
      navigate('/myresorts');
    } catch (error) {
      console.error('Error uploading resort:', error);
      setError('Failed to upload resort. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files, type) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/dvcfefmys/${type}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        urls.push(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error.response ? error.response.data : error.message);
        throw error;
      }
    }
    return urls;
  };

  return (
    <div className="font-arabic rtl">
    <div className="max-w-5xl mx-auto p-6 my-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center text-pink-600">إضافة المزرعة </h1>

      {loading && <p className="text-pink-600">قيد المعالجة...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <MdOutlineHotel className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">اسم المنتجع</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتجع"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaPhone className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">رقم الهاتف</label>
          <PhoneInput
            country={'jo'}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            placeholder="رقم الهاتف"
            inputClass="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-md !shadow-sm !focus:outline-none !focus:ring-2 !focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaMapMarkerAlt className="text-pink-600 mb-4"/>
          <label className="block text-gray-700 mb-2 font-medium">الموقع</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">اختر الموقع</option>
            <option value="عمان">عمان</option>
            <option value="جرش">جرش</option>
            <option value="عجلون">عجلون</option>
            <option value="العقبه">العقبه</option>
            <option value="الجوفة">الجوفة</option>
            <option value="الاغوار">الاغوار</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaLink className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">رابط الموقع</label>
          <input
            value={locationLink}
            onChange={(e) => setLocationLink(e.target.value)}
            placeholder="رابط الموقع"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaClipboardList className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">وصف المنتجع</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المنتجع"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaFileImage className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">صور المنتجع</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="w-full text-gray-600 file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:rounded-md file:shadow-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaFileVideo className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">فيديوهات المنتجع</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setVideos(e.target.files)}
            className="w-full text-gray-600 file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:rounded-md file:shadow-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaFileImage className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">صورة البانر</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoBanner(e.target.files[0])}
            className="w-full text-gray-600 file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:rounded-md file:shadow-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaDollarSign className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">الحد الأدنى للسعر</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="الحد الأدنى للسعر"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <FaDollarSign className="text-pink-600" />
          <label className="block text-gray-700 mb-2 font-medium">الحد الأعلى للسعر</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="الحد الأعلى للسعر"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
          <label className="block text-gray-700 mb-2 font-medium">التوفر</label>
          <select
            value={available}
            onChange={(e) => setAvailable(e.target.value === 'true')}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value={true}>متوفر</option>
            <option value={false}>غير متوفر</option>
          </select>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-2">
            <label className="block text-gray-700 mb-2 font-medium">التقييم</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="التقييم"
              min={1}
              max={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          أضف منتجع
        </button>
      </form>
    </div>
    </div>
  );
}

export default AddResort;
