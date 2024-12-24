import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabase/client.js';
import studentService from '../supabase/StudentService.js';
import employerService from '../supabase/EmployerService.js';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUnauthenticated } from '../store/authSlice.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Determine login role (student or employer)
  const role = new URLSearchParams(location.search).get('role') || 'student';

  // Listen for auth state changes to handle sign-out
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        dispatch(setUnauthenticated());
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let resp;
    let data;

    // Call appropriate service based on role
    if (role === 'student') {
      resp = await studentService.loginStudent(email, password);
      data = resp?.data?.usn;
    } else {
      resp = await employerService.loginEmployer(email, password);
      data = resp?.data?.employer_id;
    }

    // Handle errors
    if (!resp?.success) {
      setErrorMsg(resp?.error || 'Login failed');
      return;
    }

    // Set authentication in global state, navigate to dashboard
    dispatch(setAuthenticated({ role, data }));
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Section */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Section */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;