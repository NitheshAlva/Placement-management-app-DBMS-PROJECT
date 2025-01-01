import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import studentService from '../../supabase/StudentService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Phone, Mail, GraduationCap, FileText, Building2 } from 'lucide-react';
import supabase from '../../supabase/client';

const StudentProfileView = () => {
  const { usn } = useParams();
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await studentService.getStudentByUSN(usn);
        if (!response.success) {
          throw new Error(response.error);
        }
        if (response.data?.resume) {
          const { data: { publicUrl } } = await supabase.storage
            .from('resumes')
            .getPublicUrl(response.data.resume);
          setResumeUrl(publicUrl);
        }
        setStudentProfile(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [usn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-red-50 border-red-200">
          <div className="p-6 text-red-600 flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {studentProfile && (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-white">
                {`${studentProfile.first_name[0]}${studentProfile.last_name[0]}`}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {`${studentProfile.first_name} ${studentProfile.last_name}`}
            </h1>
            <div className="flex items-center justify-center space-x-3">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                {studentProfile.branch}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                {`${studentProfile.year}th Year`}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">USN</p>
                      <p className="font-medium">{studentProfile.usn}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Mail className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{studentProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Phone className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{studentProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <Building2 className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-medium">{studentProfile.branch}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Academic Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Details</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="text-2xl font-bold text-indigo-600">{studentProfile.cgpa}</p>
                    </div>
                  </div>

                  {studentProfile.resume && (
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <FileText className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resume</p>
                        <a
                          href={resumeUrl}
                          className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center space-x-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileView;