import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const RegisterForm = ({ role, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ...(role === 'student' ? {
      usn: '',
      firstName: '',
      lastName: '',
      phone: '',
      year: '',
      branch: '',
      cgpa: ''
    } : {
      employerId: '',
      companyName: '',
      website: '',
      location: '',
      industryType: ''
    })
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {role === 'student' ? (
        <>
          <Input
            label="USN"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
              <option value="Information Science">Information Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </div>
          <Input
            label="CGPA"
            name="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa}
            onChange={handleChange}
            required
          />
        </>
      ) : (
        <>
          <Input
            label="Employer ID"
            name="employerId"
            type="number"
            value={formData.employerId}
            onChange={handleChange}
            required
          />
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <Input
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <Input
            label="Industry Type"
            name="industryType"
            value={formData.industryType}
            onChange={handleChange}
            required
          />
        </>
      )}
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;