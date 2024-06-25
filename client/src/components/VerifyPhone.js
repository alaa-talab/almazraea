import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyPhone = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPhone = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/verify-phone/${token}`);
        setMessage(response.data);
        setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
      } catch (error) {
        setMessage('Verification failed. Please try again.');
      }
    };
    verifyPhone();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Phone Verification</h1>
        <p className="text-gray-700 text-center">{message}</p>
      </div>
    </div>
  );
};

export default VerifyPhone;
