import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="relative w-full py-16 flex flex-col items-center bg-white shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Placement Portal</h1>
        <p className="text-center text-gray-600 max-w-xl mx-auto">
          Streamline your job applications and candidate management with ease.
          Professional, efficient, and easy to use for both students and employers.
        </p>
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <Link to="/login?role=student">
            <button className="px-6 py-2 rounded-md font-semibold bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200">
              Student Login
            </button>
          </Link>
          <Link to="/login?role=employer">
            <button className="px-6 py-2 rounded-md font-semibold bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200">
              Employer Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2 rounded-md font-semibold bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Key Features
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Students</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Track job applications and offers</li>
              <li>Manage interview schedules</li>
              <li>Get real-time notifications</li>
            </ul>
          </div>
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Employers</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Post job openings quickly</li>
              <li>Review candidate applications</li>
              <li>Simplify interview management</li>
            </ul>
          </div>
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Admin Oversight</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Monitor system usage</li>
              <li>Generate metrics and reports</li>
              <li>Manage overall platform settings</li>
            </ul>
          </div>
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Streamlined Process</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>End-to-end placement lifecycle</li>
              <li>Automatic reminders and updates</li>
              <li>Save time and resources</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm py-4">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Placement Portal. All rights reserved.
        </p>
      </footer> 
    </div>
  );
}

export default LandingPage;