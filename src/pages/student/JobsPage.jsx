import React, { useState, useEffect } from 'react';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    company: '',
    datePosted: ''
  });
  const [errorMsg,setErrorMsg]= useState('')
  const usn = useSelector(state=>state.auth.data)
  useEffect(() => {
    const fetchJobs = async () => {
      const resp = await otherService.fetchJobs();
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setJobs(resp.data);
    };
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyForJob = async (jobId) => {
    if(!jobId)return;
    const resp = await otherService.insertApplication(jobId,usn)
    if(!resp.success){
      setErrorMsg(resp.error)
      return;
    }
    alert('Application submitted successfully!');
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.required_skills.toLowerCase().includes(filters.skills.toLowerCase()) &&
      job.employers.company_name.toLowerCase().includes(filters.company.toLowerCase()) &&
      (filters.datePosted ? job.datePosted >= filters.datePosted : true)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      <p>{errorMsg}</p>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          name="skills"
          placeholder="Filter by skills"
          value={filters.skills}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Filter by company"
          value={filters.company}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="datePosted"
          value={filters.datePosted}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.job_id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.employers.company_name}</p>
            <p className="mt-2">{job.description}</p>
            <p className="mt-2">Required Skills: {job.required_skills}</p>
            <p className="mt-2">Eligibility: {job.eligibility}</p>
            <p className="mt-2">Salary: {job.salary}</p>
            <p className="mt-2">Location: {job.location}</p>
            <p className="mt-2">Date of Posting: {job.post_date}</p>
            <button
              onClick={() => applyForJob(job.job_id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;

