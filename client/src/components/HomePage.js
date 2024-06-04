import React from 'react';

const HomePage = () => {
  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-xl font-bold">Almazraea</div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="/resorts" className="text-gray-600 hover:text-gray-900">Resorts</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('path/to/hero-image.jpg')" }}>
        <div className="container mx-auto px-4 py-32 text-center text-white">
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
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
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
