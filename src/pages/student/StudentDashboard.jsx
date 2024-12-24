import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../supabase/StudentService'
import otherService from '../../supabase/OtherService.js'
import { useSelector } from 'react-redux';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [placement, setPlacement] = useState(null);
  const [errorMsg,setErrorMsg] = useState('')
  
  const usn = useSelector((state)=>state.auth.data)

  useEffect(() => {
    const fetchStudent= async ()=>{
      const resp = await studentService.getStudentByUSN(usn)
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setStudentData(resp.data)
    }
    fetchStudent()

    const fetchJobs = async () => {
      const resp = await otherService.fetchJobs();
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setJobs(resp.data);
    };
    fetchJobs();

    const fetchApplications = async () => {
      const resp = await otherService.fetchApplicationsByUSN(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setApplications(resp.data);
    };
    fetchApplications();

    const fetchInterviews = async () => {
      const resp = await otherService.fetchInterviewsWithJobDetails(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setInterviews(resp.data);
    };
    fetchInterviews();

    const fetchPlacement = async () => {
      const resp = await otherService.fetchPlacementDetails(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setPlacement(resp.data);
    };
    fetchPlacement();
    
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <p>{errorMsg}</p>
      {studentData && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Profile Summary</h2>
          <p>USN: {studentData.usn}</p>
          <p>Name: {studentData.first_name} {studentData.last_name}</p>
          <p>Phone: {studentData.phone}</p>
          <p>Year: {studentData.year}</p>
          <Link to="/student/profile" className="text-blue-500 hover:underline">Edit Profile</Link>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Available Jobs</h2>
        {jobs.slice(0, 3).map(job => (
          <div key={job.job_id} className="mb-2">
            <h3 className="font-medium">{job.title}</h3>
            <p>{job.employers.company_name}</p>
            <Link to={`/student/jobs/${job.id}`} className="text-blue-500 hover:underline">Apply</Link>
          </div>
        ))}
        <Link to="/student/jobs" className="text-blue-500 hover:underline">View All Jobs</Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        <p>Pending: {applications.filter(app => app.status === 'Pending').length}</p>
        <p>Accepted: {applications.filter(app => app.status === 'Accepted').length}</p>
        <p>Rejected: {applications.filter(app => app.status === 'Rejected').length}</p>
        <Link to="/student/applications" className="text-blue-500 hover:underline">View All Applications</Link>
      </div>

      {interviews.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Upcoming Interview</h2>
          <p>Job: {interviews[0].jobs.job_title}</p>
          <p>Date: {interviews[0].date}</p>
          <p>Mode: {interviews[0].Interview_mode}</p>
          <p>Round: {interviews[0].round}</p>
          <Link to="/student/interviews" className="text-blue-500 hover:underline">View All Interviews</Link>
        </div>
      )}

      {placement && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Placement Offer</h2>
          <p>Company: {placement.employers.company_name}</p>
          <p>Package: {placement.package_offered}</p>
          <p>Joining Date: {placement.joining_date}</p>
          <Link to="/student/placements" className="text-blue-500 hover:underline">View Details</Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

