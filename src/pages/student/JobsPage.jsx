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
  const [errorMsg, setErrorMsg] = useState('');
  const usn = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchJobs = async () => {
      const resp = await otherService.fetchJobs();
      if (!resp.success) {
        setErrorMsg(resp.error);
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
    if (!jobId) return;
    const resp = await otherService.insertApplication(jobId, usn);
    if (!resp.success) {
      setErrorMsg(resp.error);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              name="skills"
              placeholder="Filter by skills"
              value={filters.skills}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="company"
              placeholder="Filter by company"
              value={filters.company}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <input
              type="date"
              name="datePosted"
              value={filters.datePosted}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div key={job.job_id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                  New
                </span>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 font-medium">{job.employers.company_name}</p>
                <p className="text-sm text-gray-500 mt-1">{job.location}</p>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Skills:</span> {job.required_skills}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Salary:</span> {job.salary}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Posted:</span> {new Date(job.post_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => applyForJob(job.job_id)}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;