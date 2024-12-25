import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    required_skills: '',
    description: '',
    eligibility: '',
    salary: '',
    location: '',
  });
  const [editingJob, setEditingJob] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const employerId = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await empService.getJobsByEmployer(employerId);
      if (!jobs.success) {
        setErrorMsg(jobs.error);
        return;
      }
      if (jobs.data)
        setJobs(jobs.data);
    };

    fetchJobs();
  }, [employerId]);

  const handleNewJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleEditJobChange = (e) => {
    const { name, value } = e.target;
    setEditingJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewJob = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.insertJob(newJob, employerId);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setJobs(prev => [...prev, resp.data]);
    setNewJob({
      title: '',
      required_skills: '',
      description: '',
      eligibility: '',
      salary: '',
      location: '',
    });
    setSuccessMsg('Job posted successfully!');
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.updateJob(editingJob);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setJobs(prev => prev.map(job => job.job_id === editingJob.job_id ? editingJob : job));
    setEditingJob(null);
    setSuccessMsg('Job updated successfully!');
  };

  const handleDeleteJob = async (jobId) => {
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.deleteJob(jobId);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setJobs(prev => prev.filter(job => job.job_id !== jobId));
    setSuccessMsg('Job deleted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Management</h1>

      {(errorMsg || successMsg) && (
        <div className={`p-4 rounded-md mb-6 ${errorMsg ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {errorMsg || successMsg}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Post New Job</h2>
        <form onSubmit={handleSubmitNewJob} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newJob.title}
                onChange={handleNewJobChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="required_skills" className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <input
                type="text"
                id="required_skills"
                name="required_skills"
                value={newJob.required_skills}
                onChange={handleNewJobChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={newJob.description}
              onChange={handleNewJobChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={newJob.salary}
                onChange={handleNewJobChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <input
                type="text"
                id="eligibility"
                name="eligibility"
                value={newJob.eligibility}
                onChange={handleNewJobChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newJob.location}
                onChange={handleNewJobChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Post Job
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Jobs</h2>
        <div className="space-y-6">
          {jobs && jobs.map(job => (
            <div key={job.job_id} className="border border-gray-200 rounded-md p-4">
              {editingJob && editingJob.job_id === job.job_id ? (
                <form onSubmit={handleUpdateJob} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`edit-title-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        id={`edit-title-${job.job_id}`}
                        name="title"
                        value={editingJob.title}
                        onChange={handleEditJobChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-skills-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                      <input
                        type="text"
                        id={`edit-skills-${job.job_id}`}
                        name="required_skills"
                        value={editingJob.required_skills}
                        onChange={handleEditJobChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`edit-description-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id={`edit-description-${job.job_id}`}
                      name="description"
                      value={editingJob.description}
                      onChange={handleEditJobChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor={`edit-salary-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                      <input
                        type="text"
                        id={`edit-salary-${job.job_id}`}
                        name="salary"
                        value={editingJob.salary}
                        onChange={handleEditJobChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-eligibility-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                      <input
                        type="text"
                        id={`edit-eligibility-${job.job_id}`}
                        name="eligibility"
                        value={editingJob.eligibility}
                        onChange={handleEditJobChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-location-${job.job_id}`} className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        id={`edit-location-${job.job_id}`}
                        name="location"
                        value={editingJob.location}
                        onChange={handleEditJobChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingJob(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Required Skills: {job.required_skills}</p>
                  <p className="mb-2">{job.description}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Salary:</span> {job.salary}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Eligibility:</span> {job.eligibility}</p>
                  <p className="text-sm mb-4"><span className="font-medium">Location:</span> {job.location}</p>
                  <div className="flex space-x-2">
                    <button onClick={() => setEditingJob(job)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteJob(job.job_id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobManagementPage;

