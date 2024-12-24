import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [errorMsg,setErrorMsg]= useState('')
  const usn = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchApplications = async () => {
      const resp = await otherService.fetchApplicationsWithJobDetails(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setApplications(resp.data);
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <p>{errorMsg}</p>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Job Title</th>
            <th className="p-2 text-left">Company Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.app_id} className="border-t">
              <td className="p-2">{app.jobs.title}</td>
              <td className="p-2">{app.jobs.employers.company_name}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">
                <Link to={`/student/job/${app.job_id}`} className="text-blue-500 hover:underline">View Job Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsPage;

