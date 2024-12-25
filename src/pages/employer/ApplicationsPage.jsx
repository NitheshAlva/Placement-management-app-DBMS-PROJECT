import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const statusVariants = {
  'Pending': 'warning',
  'Accepted': 'success',
  'Rejected': 'danger'
};

// Application Row Component
const ApplicationRow = ({ application, onUpdateStatus }) => (
  <tr className="border-t hover:bg-gray-50">
    <td className="p-4">
      <div className="font-medium text-gray-900">{application.title}</div>
    </td>
    <td className="p-4">
      <div className="text-gray-900">{application.usn}</div>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Job Title</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Applicant USN</th>
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
  );
};

export default ApplicationsPage;