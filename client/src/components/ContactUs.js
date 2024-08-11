import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 font-arabic rtl">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-pink-600">اتصل بنا</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-8">
        <p className="text-lg mb-6 text-gray-700">
          نحن هنا لمساعدتك! إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يرجى ملء النموذج أدناه أو الاتصال بنا عبر المعلومات المقدمة.
        </p>
        
        <div className="flex flex-col md:flex-row md:space-x-12 mb-8">
          {/* Contact Information */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">معلومات الاتصال</h2>
            <ul className="list-none space-y-4">
              <li className="flex items-center text-gray-600 gap-1">
                <FaEnvelope className="text-pink-600 mr-3" />
                <span><strong className="text-gray-800">البريد الإلكتروني:</strong> alaatalab99@gmail.com</span>
              </li> 
              <li className="flex items-center text-gray-600 gap-1">
                <FaPhone className="text-pink-600 mr-3" />
                <span><strong className="text-gray-800">الهاتف:</strong> +962-796-698-850</span>
              </li>
              <li className="flex items-center text-gray-600 gap-1">
                <FaMapMarkerAlt className="text-pink-600 mr-3" />
                <span><strong className="text-gray-800">العنوان:</strong> عمان، الأردن</span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">نموذج الاتصال</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">الاسم</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">الرسالة</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="أدخل رسالتك"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                إرسال
              </button>
              {status && <p className="text-center text-gray-700 mt-4">{status}</p>}
            </form>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="inline-block px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 ease-in-out">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
