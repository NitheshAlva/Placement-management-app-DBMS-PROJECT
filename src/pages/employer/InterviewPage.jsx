import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [newInterview, setNewInterview] = useState({
    usn: '',
    job_id: '',
    date: '',
    interview_mode: 'Online',
    round: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const employerId = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchInterviews = async () => {
      const resp = await empService.getJobsAndInterviewsByEmployer(null, employerId);
      if (!resp.success) {
        setErrorMsg(resp.error);
        return;
      }
      setInterviews(resp.data);
    };
    fetchInterviews();
  }, [employerId]);

  const handleNewInterviewChange = (e) => {
    const { name, value } = e.target;
    setNewInterview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewInterview = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.insertInterview(newInterview);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setInterviews(prev => [...prev, resp.data]);
    setNewInterview({
      usn: '',
      job_id: '',
      date: '',
      interview_mode: 'Online',
      round: '',
    });
    setSuccessMsg('Interview scheduled successfully!');
  };

  const handleDeleteInterview = async (interviewId) => {
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.deleteInterview(interviewId);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setInterviews(prev => prev.filter(interview => interview.interview_id !== interviewId));
    setSuccessMsg('Interview deleted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Management</h1>

      {(errorMsg || successMsg) && (
        <div className={`p-4 rounded-md mb-6 ${errorMsg ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {errorMsg || successMsg}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Schedule New Interview</h2>
        <form onSubmit={handleSubmitNewInterview} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700 mb-1">Applicant USN</label>
              <input
                type="text"
                id="usn"
                name="usn"
                value={newInterview.usn}
                onChange={handleNewInterviewChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="job_id" className="block text-sm font-medium text-gray-700 mb-1">Job ID</label>
              <input
                type="text"
                id="job_id"
                name="job_id"
                value={newInterview.job_id}
                onChange={handleNewInterviewChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={newInterview.date}
                onChange={handleNewInterviewChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="interview_mode" className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                id="interview_mode"
                name="interview_mode"
                value={newInterview.interview_mode}
                onChange={handleNewInterviewChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div>
              <label htmlFor="round" className="block text-sm font-medium text-gray-700 mb-1">Round</label>
              <input
                type="text"
                id="round"
                name="round"
                value={newInterview.round}
                onChange={handleNewInterviewChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Schedule Interview
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
        <div className="space-y-6">
          {interviews.map(interview => (
            <div key={interview.interview_id} className="border border-gray-200 rounded-md p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Applicant USN</p>
                  <p className="font-medium">{interview.usn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Job Title</p>
                  <p className="font-medium">{interview.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(interview.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mode</p>
                  <p className="font-medium">{interview.interview_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Round</p>
                  <p className="font-medium">{interview.round}</p>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => handleDeleteInterview(interview.interview_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {interviews.length === 0 && (
            <p className="text-center text-gray-500 my-4">No interviews scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;