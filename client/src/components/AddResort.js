import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function AddResort() {
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        photoBanner: bannerUrl[0], // Save the banner URL
        minPrice,
        maxPrice,
        rating: 4,
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
      setError('');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error uploading resort:', error);
      setError('Failed to upload resort. Please try again.');
    }
  };

  const uploadFiles = async (files, type) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/dvcfefmys/${type}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }); // Replace with your Cloudinary cloud name
        urls.push(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error.response ? error.response.data : error.message);
        throw error;
      }
    }
    return urls;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-4 bg-white rounded shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-gray-700 mb-2">اسم المنتجع</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المنتجع"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">رقم الهاتف</label>
        <PhoneInput
          country={'jo'} // Specify Jordan as the default country
          value={phone}
          onChange={(phone) => setPhone(phone)}
          placeholder="رقم الهاتف"
          inputClass="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">الموقع</label>
        <select 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
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
      <div>
        <label className="block text-gray-700 mb-2">رابط الموقع</label>
        <input
          value={locationLink}
          onChange={(e) => setLocationLink(e.target.value)}
          placeholder="رابط الموقع"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">وصف المنتجع</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف المنتجع"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">صور المنتجع</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          placeholder="صور المنتجع"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">فيديوهات المنتجع</label>
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => setVideos(e.target.files)}
          placeholder="فيديوهات المنتجع"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">صورة البانر</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoBanner(e.target.files[0])}
          placeholder="صورة البانر"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 mb-2">الحد الأدنى للسعر</label>
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="الحد الأدنى للسعر"
            type="number"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 mb-2">الحد الأقصى للسعر</label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="الحد الأقصى للسعر"
            type="number"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        إضافة منتجع
      </button>
    </form>
  );
}

export default AddResort;