import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function RecentApplications({ applications }) {
  const statusColors = {
    Pending: 'warning',
    Accepted: 'success',
    Rejected: 'danger'
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <Link to="/student/applications" className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.app_id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{app.jobs.title}</p>
                <p className="text-sm text-gray-500">{app.jobs.employers.company_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={statusColors[app.status]}>
                  {app.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(app.date_applied).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent applications</p>
          )}
        </div>
      </div>
    </Card>
  );
}