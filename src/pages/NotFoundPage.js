import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-center text-6xl font-extrabold text-gray-900">
          404
        </h2>
        <p className="mt-2 text-center text-2xl text-gray-600">
          Page Not Found
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          The page you are looking for does not exist or an other error occurred.
        </p>
        <div className="mt-6">
          <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Go back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
