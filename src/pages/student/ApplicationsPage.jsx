import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const statusVariants = {
  'Pending': 'warning',
  'Accepted': 'success',
  'Rejected': 'danger'
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const usn = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const resp = await otherService.fetchApplicationsWithJobDetails(usn);
        if (!resp.success) {
          setErrorMsg(resp.error);
          return;
        }
        setApplications(resp.data);
      } catch (error) {
        setErrorMsg('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <Link 
          to="/student/jobs" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Browse Jobs
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map(app => (
          <Card key={app.app_id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.jobs.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {app.jobs.employers.company_name}
                  </p>
                </div>
                <Badge variant={statusVariants[app.status]}>
                  {app.status}
                </Badge>
              </div>

              <div className="space-y-2 flex-grow">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Applied:</span>{' '}
                  {new Date(app.date_applied).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span>{' '}
                  {app.jobs.location}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Salary:</span>{' '}
                  {app.jobs.salary}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/student/job/${app.job_id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View Job Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {applications.length === 0 && (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by applying to some jobs
              </p>
              <div className="mt-6">
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Available Jobs
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;