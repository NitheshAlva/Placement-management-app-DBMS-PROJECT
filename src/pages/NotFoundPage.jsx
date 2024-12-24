import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-gray-900 opacity-20">404</h1>
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800">
            Page Not Found
          </p>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Navigation Options */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            ← Go Back
          </button>

          <Link
            to="/"
            className="block w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;