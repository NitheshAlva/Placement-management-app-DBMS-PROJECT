import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye } from 'lucide-react';

const statusVariants = {
  'Pending': 'warning',
  'Accepted': 'success',
  'Rejected': 'danger'
};

const ApplicationCard = ({ application, onUpdateStatus }) => (
  <div className="border border-gray-200 rounded-md p-4 space-y-3">
    <div>
      <p className="text-sm text-gray-600">Job Title</p>
      <p className="font-medium text-gray-900">{application.title}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Applicant USN</p>
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-900">{application.usn}</p>
        <Link
          to={`/employer/student/${application.usn}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Profile
        </Link>
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-600">Job ID</p>
      <p className="font-medium text-gray-600">{application.job_id}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Status</p>
      <Badge variant={statusVariants[application.status]}>
        {application.status}
      </Badge>
    </div>
    {application.status === 'Pending' && (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onUpdateStatus(application.app_id, 'Accepted')}
          variant="success"
          size="sm"
          className="flex-1 sm:flex-none"
        >
          Shortlist
        </Button>
        <Button
          onClick={() => onUpdateStatus(application.app_id, 'Rejected')}
          variant="danger"
          size="sm"
          className="flex-1 sm:flex-none"
        >
          Reject
        </Button>
      </div>
    )}
  </div>
);

const ApplicationRow = ({ application, onUpdateStatus }) => (
  <tr className="border-t hover:bg-gray-50">
    <td className="p-4">
      <div className="font-medium text-gray-900">{application.title}</div>
    </td>
    <td className="p-4">
      <div className="flex items-center space-x-3">
        <div className="text-gray-900">{application.usn}</div>
        <Link
          to={`/employer/student/${application.usn}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-3 h-3 mr-1" />
          View Profile
        </Link>
      </div>
    </td>
    <td className="p-4">
      <div className="text-gray-600">{application.job_id}</div>
    </td>
    <td className="p-4">
      <Badge variant={statusVariants[application.status]}>
        {application.status}
      </Badge>
    </td>
    <td className="p-4">
      {application.status === 'Pending' && (
        <div className="flex space-x-2">
          <Button
            onClick={() => onUpdateStatus(application.app_id, 'Accepted')}
            variant="success"
            size="sm"
          >
            Shortlist
          </Button>
          <Button
            onClick={() => onUpdateStatus(application.app_id, 'Rejected')}
            variant="danger"
            size="sm"
          >
            Reject
          </Button>
        </div>
      )}
    </td>
  </tr>
);

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const employerId = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const resp = await empService.getJobsAndApplicationsByEmployer(null, employerId);
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
  }, [employerId]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const resp = await empService.updateApplicationStatus(applicationId, newStatus);
      if (!resp.success) {
        setErrorMsg(resp.error);
        return;
      }
      setApplications(prev =>
        prev.map(app =>
          app.app_id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      setErrorMsg('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errorMsg}
          </div>
        )}

        <div className="lg:hidden space-y-4">
          {applications.map(app => (
            <ApplicationCard
              key={app.app_id}
              application={app}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
          {applications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                No applications have been submitted yet
              </p>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Job Title</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Applicant Info</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Job ID</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map(app => (
                    <ApplicationRow
                      key={app.app_id}
                      application={app}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </tbody>
              </table>

              {applications.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No applications have been submitted yet
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;