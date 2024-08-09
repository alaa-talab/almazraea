import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

function EditResort({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
  const [rating, setRating] = useState('');
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log(`Fetching resort with ID: ${id}`);
        const response = await axios.get(`http://localhost:5000/resorts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;
        console.log('Resort fetched successfully:', data);
        setResort(data);
        setName(data.name);
        setPhone(data.phone);
        setLocation(data.location);
        setLocationLink(data.locationLink);
        setDescription(data.description);
        setMinPrice(data.minPrice);
        setMaxPrice(data.maxPrice);
        setPhotoBanner(data.photoBanner);
        setRating(data.rating);
        setAvailable(data.available);
        setImages(data.images);
        setVideos(data.videos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resort:', error);
        setLoading(false);
        navigate('/login'); // Redirect to login page if there is an error
      }
    };

    fetchResort();
  }, [id, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      const imageUrls = await uploadFiles(images, 'image');
      const videoUrls = await uploadFiles(videos, 'video');
      const bannerUrl = photoBanner ? await uploadFiles([photoBanner], 'image') : [resort.photoBanner];

      const updatedResort = {
        name,
        phone,
        location,
        locationLink,
        description,
        images: imageUrls.length > 0 ? imageUrls : resort.images,
        videos: videoUrls.length > 0 ? videoUrls : resort.videos,
        photoBanner: bannerUrl[0],
        minPrice,
        maxPrice,
        available
      };

      const token = localStorage.getItem('token');
      console.log('Updating resort with data:', updatedResort);

      await axios.put(`http://localhost:5000/resorts/${id}`, updatedResort, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (user?.role === 'admin') {
        await axios.put(`http://localhost:5000/resorts/${id}/rate`, { rating }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/cp-admin/manage-resorts');
      } else {
        navigate('/myresorts');
      }
    } catch (error) {
      console.error('Error updating resort:', error);
      setError('Failed to update resort. Please try again.');
    } finally {
      setProcessing(false);
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

  const handleImageDelete = async (url) => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذه الصورة؟');
    if (!confirmDelete) return;

    setImages(images.filter(img => img !== url));
  };

  const handleVideoDelete = async (url) => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذا الفيديو؟');
    if (!confirmDelete) return;

    setVideos(videos.filter(vid => vid !== url));
  };

  const handleBannerDelete = async () => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف صورة البانر؟');
    if (!confirmDelete) return;

    setPhotoBanner(null);
  };

  const handleDescriptionClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleModalSave = () => {
    // Close the modal
    handleModalClose();
  
    // Manually trigger the form submission
    document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-4 bg-white rounded shadow-md">
        {processing && <p>Processing...</p>}
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
            country={'jo'}
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
          <button
            type="button"
            onClick={handleDescriptionClick}
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700 text-left"
          >
            {description || "اضغط هنا لتعديل الوصف"}
          </button>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">الصور</label>
          {images.length > 0 && (
            <div className="space-y-2 mb-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Resort image ${index + 1}`} className="w-full h-40 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">فيديوهات المنتجع</label>
          {videos.length > 0 && (
            <div className="space-y-2 mb-2">
              {videos.map((video, index) => (
                <div key={index} className="relative">
                  <video controls className="w-full h-40 object-cover rounded">
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={() => handleVideoDelete(video)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setVideos([...videos, ...Array.from(e.target.files)])}
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">صورة البانر</label>
          {photoBanner && (
            <div className="relative">
              <img src={photoBanner} alt="Resort banner" className="w-full h-40 object-cover rounded" />
              <button
                type="button"
                onClick={handleBannerDelete}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
              >
                &times;
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoBanner(e.target.files[0])}
            className="w-full px-3 py-2 border rounded mt-2"
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
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">حالة التوفر</label>
          <select 
            value={available}
            onChange={(e) => setAvailable(e.target.value === 'true')}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="true">متاح</option>
            <option value="false">غير متاح</option>
          </select>
        </div>
        {user?.role === 'admin' && (
          <div>
            <label className="block text-gray-700 mb-2">تقييم المنتجع</label>
            <input
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="تقييم المنتجع"
              type="number"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
        >
          تحديث منتجع
        </button>
      </form>

      {/* Modal for Editing Description */}
      {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">تحرير وصف المنتجع</h2>
        
        <textarea
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="w-full h-60 md:h-72 p-2 border rounded mb-4"
          placeholder="أدخل وصف المنتجع هنا"
        />
      
        <div className="mt-4 flex justify-end space-x-2 gap-4">
          <button
            onClick={handleModalClose}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition-colors duration-200"
          >
            إغلاق
          </button>
          <button
            onClick={handleModalSave}
            className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700 transition-colors duration-200"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
    
    
    
     
      )}
    </div>
  );
}

export default EditResort;
