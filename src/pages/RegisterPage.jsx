import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../supabase/StudentService.js';
import employerService from '../supabase/EmployerService.js';

function RegisterPage() {
  const [role, setRole] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    usn: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    year: '',
    companyName: '',
    website: '',
    location: '',
    branch: '',
    cgpa: '',
    employerId: '',
    industryType: '',
  });
  const navigate = useNavigate();

  // Handle general input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let resp;

    if (role === 'student') {
      resp = await studentService.registerStudent(formData);
      if (resp) {
        setErrorMsg(resp);
        return;
      }
      navigate('/login');
    } else {
      resp = await employerService.registerEmployer(formData);
      if (resp) {
        setErrorMsg(resp);
        return;
      }
      navigate('/login?role=employer');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-xl w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Radio Group for Role Selection */}
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Student</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={role === 'employer'}
                onChange={() => setRole('employer')}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Employer</span>
            </label>
          </div>

          {/* Student Fields */}
          {role === 'student' && (
            <>
              <div>
                <label htmlFor="usn" className="block text-gray-700 mb-1">
                  USN
                </label>
                <input
                  type="text"
                  id="usn"
                  name="usn"
                  required
                  value={formData.usn}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="branch" className="block text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  required
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="cgpa" className="block text-gray-700 mb-1">
                  CGPA
                </label>
                <input
                  type="text"
                  id="cgpa"
                  name="cgpa"
                  required
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
            </>
          )}

          {/* Employer Fields */}
          {role === 'employer' && (
            <>
              <div>
                <label
                  htmlFor="employerId"
                  className="block text-gray-700 mb-1"
                >
                  Employer ID
                </label>
                <input
                  type="text"
                  id="employerId"
                  name="employerId"
                  required
                  value={formData.employerId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  required
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-1">
                  Company Address
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label
                  htmlFor="industryType"
                  className="block text-gray-700 mb-1"
                >
                  Industry Type
                </label>
                <input
                  type="text"
                  id="industryType"
                  name="industryType"
                  required
                  value={formData.industryType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
            </>
          )}

          {/* Common Fields for Both Roles */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;