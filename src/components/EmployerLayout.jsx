import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import employerService from '../supabase/EmployerService';
import withAuth from './withAuth';
import { useDispatch } from 'react-redux';
import { setUnauthenticated } from '../store/authSlice';

function EmployerLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const resp = await employerService.logoutEmployer(0);
    if (!resp) {
      dispatch(setUnauthenticated());
      navigate('/login?role=employer');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link
            to="/employer/dashboard"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
          <Link
            to="/employer/profile"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Profile
          </Link>
          <Link
            to="/employer/jobs"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Job Management
          </Link>
          <Link
            to="/employer/applications"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Applications
          </Link>
          <Link
            to="/employer/interviews"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Interviews
          </Link>
          <Link
            to="/employer/placements"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Placements
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 mx-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default withAuth(EmployerLayout, ['employer']);