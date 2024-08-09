import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Generate breadcrumb items
  const breadcrumbs = pathnames.map((_, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = pathnames[index] || 'Home';
    return { to, label };
  });

  return (
    <nav className="flex items-center px-4 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse flex-wrap">
        {/* Home link with home icon */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-pink-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="w-4 h-4 me-2.5 mb-2 mx-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#db2777" viewBox="0 0 20 20">
              <path d="M10 2.293l-7 7v9a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1v-9l-7-7z"/>
            </svg>
            Home
          </Link>
          <svg className="w-3 h-3 mx-1 text-pink-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index === breadcrumbs.length - 1 ? (
              // Last breadcrumb item
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {crumb.label}
              </span>
            ) : (
              // Intermediate breadcrumb items
              <Link
                to={crumb.to}
                className="text-sm font-medium text-gray-700 hover:text-pink-600 dark:text-gray-400 dark:hover:text-white"
              >
                {crumb.label}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <svg className="w-3 h-3 mx-1 text-pink-600 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
