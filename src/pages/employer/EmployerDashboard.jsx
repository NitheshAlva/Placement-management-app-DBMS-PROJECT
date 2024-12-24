import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import empService from '../../supabase/EmpService';
import employerService from '../../supabase/EmployerService';
import { useSelector } from 'react-redux';

const EmployerDashboard = () => {
  const [employerData, setEmployerData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [errorMsg,setErrorMsg] = useState('');
  const employerId = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchData = async () => {
      const employerData = await employerService.getEmployer(employerId);
      if(!employerData.success){
        setErrorMsg(employerData.error)
        return
      }
      setEmployerData(employerData.data);
      
      const jobs = await empService.getJobsByEmployer(employerId);
      if(!jobs.success){
        setErrorMsg(jobs.error)
        return
      }
      setJobs(jobs.data);
      const applications = await empService.getJobsAndApplicationsByEmployer(jobs.data);
      if(!applications.success){
        setErrorMsg(applications.error)
        return;
      }
      setApplications(applications.data);

      const interviews = await empService.getJobsAndInterviewsByEmployer(jobs.data);
      if(!interviews.success){
        setErrorMsg(interviews.error)
        return;
      }
      setInterviews(interviews.data);
      
      const placements = await empService.getJobsAndPlacementsByEmployer(jobs.data);
      if(!placements.success){
        setErrorMsg(placements.error)
        return;
      }
      setPlacements(placements.data);

    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Employer Dashboard</h1>
      <p>{errorMsg}</p>
      {employerData && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Profile Summary</h2>
          <p>Employer ID: {employerData.employer_id}</p>
          <p>Company: {employerData.company_name}</p>
          <p>Email: {employerData.contact_email}</p>
          <p>Website: {employerData.website}</p>
          <Link to="/employer/profile" className="text-blue-500 hover:underline">Edit Profile</Link>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Job Listings</h2>
        {jobs&&jobs.slice(0, Math.min(3,jobs.length)).map(job => (
          <div key={job.job_id} className="mb-2">
            <h3 className="font-medium">{job.title}</h3>
            <p>Required Skills: {job.required_skills}</p>
            <p>Posted: {job.post_date}</p>
          </div>
        ))}
        <Link to="/employer/jobs" className="text-blue-500 hover:underline">Manage Jobs</Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        <p>Total: {applications.length}</p>
        <p>Pending: {applications.filter(app => app.status.toLowerCase() === 'pending').length}</p>
        <p>Shortlisted: {applications.filter(app => app.status.toLowerCase() === 'accepted').length}</p>
        <p>Rejected: {applications.filter(app => app.status.toLowerCase() === 'rejected').length}</p>
        <Link to="/employer/applications" className="text-blue-500 hover:underline">View Applications</Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Interviews</h2>
        <p>Scheduled: {interviews.length}</p>
        {interviews[0] && (
          <div>
            <p>Next Interview: {interviews[0].date}</p>
            <p>Job Title: {interviews[0].title}</p>
            <p>Candidate USN: {interviews[0].usn}</p>
          </div>
        )}
        <Link to="/employer/interviews" className="text-blue-500 hover:underline">Manage Interviews</Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Placements</h2>
        <p>Total Offers: {placements.length}</p>
        {placements[0] && (
          <div>
            <p>Latest Offer: {placements[0].title}</p>
            <p>Package: {placements[0].package_offered}</p>
          </div>
        )}
        <Link to="/employer/placements" className="text-blue-500 hover:underline">View Placements</Link>
      </div>
    </div>
  );
};

export default EmployerDashboard;

