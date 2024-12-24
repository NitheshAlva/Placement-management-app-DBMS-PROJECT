import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    required_skills: '',
    description: '',
    eligibility:'',
    salary:'',
    location:'',
  });
  const [editingJob, setEditingJob] = useState(null);
  const [errorMsg,setErrorMsg] = useState('')
  const employerId= useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await empService.getJobsByEmployer(employerId);
      if(!jobs.success){
        setErrorMsg(jobs.error)
        return
      }
      if(jobs.data)
      setJobs(jobs.data);
    console.log(jobs)
    };

    fetchJobs();
  }, []);

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
    const resp = await empService.insertJob(newJob,employerId);
      if(!resp.success){
        setErrorMsg(jobs.error)
        return
      }
    setJobs(prev => [...prev, resp.data ]);
    setNewJob({ title: '', requiredSkills: '', description: '',eligibility:'',
      salary:'',
      location:'', });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const resp = await empService.updateJob(editingJob);
    if(!resp.success){
      setErrorMsg(resp.error)
      return
    }
    setJobs(prev => prev.map(job => job.job_id === editingJob.job_id ? editingJob : job));
    setEditingJob(null);
  };

  const handleDeleteJob = async (jobId) => {
    const resp = await empService.deleteJob(jobId);
    if(!resp.success){
      setErrorMsg(resp.error)
      return
    }
    setJobs(prev => prev.filter(job => job.job_id !== jobId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Job Management</h1>
      <p>{errorMsg}</p>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Post New Job</h2>
        <form onSubmit={handleSubmitNewJob} className="space-y-4">
          <div>
            <label className="block mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={newJob.title}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Required Skills</label>
            <input
              type="text"
              name="required_skills"
              value={newJob.required_skills}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={newJob.description}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">Salary</label>
            <textarea
              name="salary"
              value={newJob.salary}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">Eligibility</label>
            <textarea
              name="eligibility"
              value={newJob.eligibility}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <textarea
              name="location"
              value={newJob.location}
              onChange={handleNewJobChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Post Job
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Existing Jobs</h2>
        {jobs&&jobs.map(job => (
          <div key={job.job_id} className="mb-4 p-4 border rounded">
            {editingJob && editingJob.job_id === job.job_id ? (
              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div>
                  <label className="block mb-1">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingJob.title}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Required Skills</label>
                  <input
                    type="text"
                    name="required_skills"
                    value={editingJob.required_skills}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editingJob.description}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-1">Salary</label>
                  <textarea
                    name="salary"
                    value={editingJob.salary}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-1">Eligibility</label>
                  <textarea
                    name="eligibility"
                    value={editingJob.eligibility}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-1">Location</label>
                  <textarea
                    name="location"
                    value={editingJob.location}
                    onChange={handleEditJobChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2">
                    Save
                  </button>
                  <button onClick={() => setEditingJob(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="font-medium">{job.title}</h3>
                <p>Required Skills: {job.required_skills}</p>
                <p>{job.description}</p>
                <p>Salary: {job.salary}</p>
                <p>Eligibility: {job.eligibility}</p>
                <p>Location: {job.location}</p>
                <div className="mt-2">
                  <button onClick={() => setEditingJob(job)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteJob(job.job_id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobManagementPage;

