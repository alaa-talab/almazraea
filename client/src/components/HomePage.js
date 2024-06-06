import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-xl font-bold">Almazraea</div>
          <nav className="flex items-center">
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link to="/resorts" className="text-gray-600 hover:text-gray-900">Resorts</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
            <div className="flex items-center ml-4 space-x-4">
              <input 
                type="text" 
                placeholder="Search resorts..." 
                className="border rounded py-2 px-3"
              />
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link to="/register" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Sign Up</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('path/to/hero-image.jpg')" }}>
        <div className="container mx-auto px-4 py-32 text-center text-black">
          <h1 className="text-5xl font-bold">Welcome to Almazraea</h1>
          <p className="mt-4 text-xl">Discover the best resorts</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex space-x-8">
          <div className="w-1/3">
            <img src="path/to/luxury-resort.jpg" alt="Luxury Resorts" className="w-full h-48 object-cover"/>
            <h3 className="mt-4 text-2xl font-bold">Luxury Resorts</h3>
            <p className="mt-2 text-gray-600">Experience the ultimate in luxury and comfort.</p>
          </div>
          <div className="w-1/3">
            <img src="path/to/family-friendly.jpg" alt="Family Friendly" className="w-full h-48 object-cover"/>
            <h3 className="mt-4 text-2xl font-bold">Family Friendly</h3>
            <p className="mt-2 text-gray-600">Perfect destinations for family vacations.</p>
          </div>
          <div className="w-1/3">
            <img src="path/to/affordable-stays.jpg" alt="Affordable Stays" className="w-full h-48 object-cover"/>
            <h3 className="mt-4 text-2xl font-bold">Affordable Stays</h3>
            <p className="mt-2 text-gray-600">Enjoy your stay without breaking the bank.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <ul className="flex space-x-4">
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:underline">Facebook</a>
            <a href="https://twitter.com" className="hover:underline">Twitter</a>
            <a href="https://instagram.com" className="hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
