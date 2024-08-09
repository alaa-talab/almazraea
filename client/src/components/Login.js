import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
import { Checkbox } from "@material-tailwind/react";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { token, role, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      setUser({ role, userId });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data.message === 'هذه البريد الكتروني مستخدم في جوجل يرجى الدخول عن طريق جوجل') {
        setError('Please use Google OAuth to sign in.');
      } else {
        setError('بيانات الدخول غير صحيحة');

      }
    }
  };

  const proceedWithGoogleLogin = () => {
    window.open(`http://localhost:5000/auth/google?role=${role}`, '_self');
  };

  const proceedWithFacebookLogin = () => {
    window.open(`http://localhost:5000/auth/facebook?role=${role}`, '_self');
  };

  return (
    <div className="font-arabic rtl">
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(219,39,119,0.3)] rounded-md">
        <div className="md:max-w-md w-full px-4 py-4">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center text-pink-600">تسجيل الدخول</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">البريد الإلكتروني</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-10 py-3 outline-none"
                  placeholder="Enter email"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#db2777" stroke="#db2777" className="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                    <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                    <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">كلمة المرور</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-10 py-3 outline-none"
                  placeholder="Enter password"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#db2777" stroke="#db2777" className="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                  <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-pink-600 hover:bg-pink-800 focus:outline-none"
            >
              تسجيل الدخول
            </button>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-pink-600 focus:ring-pink-500 border-pink-600 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-sm px-1 text-gray-800">تذكرني</label>
              </div>
              <div>
                <a href="javascript:void(0);" className="text-pink-600 font-semibold text-sm hover:underline">نسيت كلمةالسر?</a>
              </div>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button  onClick={proceedWithGoogleLogin} className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md mx-auto px-10 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-1">
  <svg className="h-6 w-6 mr-2 " xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
    
    <defs></defs>
    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Color-" transform="translate(-401.000000, -860.000000)">
        <g id="Google" transform="translate(401.000000, 860.000000)">
          <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
          <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path>
          <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path>
          <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path>
        </g>
      </g>
    </g>
  </svg>
  <span className='px-2'>تسجيل الدخول باستخدام جوجل</span>
</button>
<button
  
 onClick={proceedWithFacebookLogin}  class="flex items-center bg-white border mx-auto border-gray-300 rounded-lg shadow-md max-w-xs px-8 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-1">
    <svg class="h-6 w-6 mr-2 " xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48" version="1.1">
        <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                <path
                    d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                    id="Facebook">

                </path>
            </g>
        </g>
    </svg>

    <span className='px-2'>تسجيل الدخول باستخدام فيسبوك</span>
     </button>
     <p className="mb-0 mt-2 mx-auto text-sm font-semibold">
                 ليس لديك حساب؟{" "}
                  <a
                    href="#!"
                    className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 text-pink-600"
                  > <Link to="/register">
                    سجل الان
                    </Link>
                  </a>
                </p>
          </div>
        </div>
        
        <div className="md:h-full  rounded-xl lg:p-12 p-8 hidden md:block">
          <img src="https://res.cloudinary.com/dvcfefmys/image/upload/v1720294620/login_shape-01_drpf1m.png" className="w-full h-full object-contain animate-moving-image" alt="login-image" />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
