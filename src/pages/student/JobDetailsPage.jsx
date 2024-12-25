import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import otherService from '../../supabase/OtherService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const JobDetailsPage = () => {
  const { jobid } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await otherService.fetchJobDetails(jobid);
        if (!response.success) {
          throw new Error(response.error);
        }
        setJobDetails(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Details</h1>
        
        {jobDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Job Information */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{jobDetails.title}</h2>
                      <p className="text-lg text-gray-600">{jobDetails.employers.company_name}</p>
                    </div>
                    <Badge variant="primary">{jobDetails.salary}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="text-gray-900">{jobDetails.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <p className="text-gray-900">{jobDetails.location}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Requirements</h3>
                      <p className="text-gray-900">{jobDetails.required_skills || 'No specific requirements listed'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Additional Details */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Posted Date</p>
                      <p className="font-medium">{new Date(jobDetails.post_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Company Information Sidebar */}
            <div>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{jobDetails.employers.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{jobDetails.employers.contact_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Website</p>
                      <a 
                        href={jobDetails.employers.website || '#'} 
                        className="text-blue-600 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{jobDetails.employers.industry_type || 'Not Specified'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;