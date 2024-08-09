import React, { useState } from 'react';

export function FeaturedImageGallery({ images, videos }) {
  const [active, setActive] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (content, index) => {
    setModalContent(content);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleNext = () => {
    const totalItems = images.length + videos.length;
    const nextIndex = (currentIndex + 1) % totalItems;
    const nextContent = nextIndex < images.length ? images[nextIndex] : videos[nextIndex - images.length];
    setModalContent(nextContent);
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    const totalItems = images.length + videos.length;
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    const prevContent = prevIndex < images.length ? images[prevIndex] : videos[prevIndex - images.length];
    setModalContent(prevContent);
    setCurrentIndex(prevIndex);
  };

  return (
    <div className="grid gap-6 p-2 bg-gray-100 rounded-lg shadow-lg">
      <div className="overflow-hidden rounded-lg shadow-md">
        <img
          className="h-auto w-full max-w-full object-cover object-center transition-transform duration-500 ease-in-out transform hover:scale-105 cursor-pointer"
          src={active}
          alt="Active resort"
          onClick={() => openModal(active, currentIndex)}
        />
      </div>
      <div className="grid grid-cols-5 gap-4">
        {images.map((imgelink, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <img
              onClick={() => {
                setActive(imgelink);
                openModal(imgelink, index);
              }}
              src={imgelink}
              className={`h-20 w-full cursor-pointer object-cover object-center rounded-lg ${active === imgelink ? 'ring-4 ring-pink-600' : ''}`}
              alt={`Thumbnail ${index + 1}`}
            />
          </div>
        ))}
        {videos && videos.length > 0 && videos.map((video, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <a href={video} target="_blank" rel="noopener noreferrer">
              <video
                controls
                className="h-20 w-full rounded-lg object-cover object-center cursor-pointer"
                onClick={() => openModal(video, images.length + index)}
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </a>
          </div>
        ))}
      </div>

      {/* Modal for Fullscreen Inspection */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative w-auto max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
              {typeof modalContent === 'string' && modalContent.endsWith('.mp4') ? (
                <video controls className="w-full h-auto">
                  <source src={modalContent} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={modalContent} alt="Fullscreen view" className="w-full h-auto object-cover" />
              )}

              {/* Navigation Arrows */}
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full focus:outline-none"
                onClick={handlePrev}
              >
                &#8249;
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full focus:outline-none"
                onClick={handleNext}
              >
                &#8250;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
