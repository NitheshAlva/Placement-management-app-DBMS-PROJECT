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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Applicant USN</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mode</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Round</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {interviews.map(interview => (
                    <tr key={interview.interview_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{interview.usn}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{interview.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(interview.date).toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{interview.interview_mode}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{interview.round}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => handleDeleteInterview(interview.interview_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete<span className="sr-only">, {interview.usn}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {interviews.length === 0 && (
          <p className="text-center text-gray-500 my-4">No interviews scheduled yet.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;

