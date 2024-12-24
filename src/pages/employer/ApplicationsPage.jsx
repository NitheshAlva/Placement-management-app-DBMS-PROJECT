import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [errorMsg,setErrorMsg] = useState('');
  const employerId = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchApplications = async () => {
      const applications = await empService.getJobsAndApplicationsByEmployer(null,employerId);
      if(!applications.success){
        setErrorMsg(applications.error)
        return
      }
      setApplications(applications.data);
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    const resp = await empService.updateApplicationStatus(applicationId, newStatus);
    if(!resp.success){
      setErrorMsg(resp.error)
      return
    }
    setApplications(prev => prev.map(app => 
      app.app_id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <p>{errorMsg}</p>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Job Title</th>
            <th className="p-2 text-left">Applicant USN</th>
            <th className="p-2 text-left">Job ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.app_id} className="border-t">
              <td className="p-2">{app.title}</td>
              <td className="p-2">{app.usn}</td>
              <td className="p-2">{app.job_id}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">
                {app.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(app.app_id, 'Accepted')}
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600 mr-2"
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(app.app_id, 'Rejected')}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsPage;

