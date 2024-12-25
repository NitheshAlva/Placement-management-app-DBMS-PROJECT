import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm  from '../../src/components/auth/RegisterForm.jsx';
import studentService from '../supabase/StudentService';
import employerService from '../supabase/EmployerService';
import { Card } from '../components/ui/Card'; 

const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
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
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setRole('student')}
                className={`px-4 py-2 rounded-md ${
                  role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole('employer')}
                className={`px-4 py-2 rounded-md ${
                  role === 'employer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Employer
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}
          <RegisterForm
            role={role}
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;