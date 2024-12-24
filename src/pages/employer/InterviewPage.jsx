import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [newInterview, setNewInterview] = useState({
    usn: '',
    job_id:'',
    date: '',
    interview_mode: 'Online',
    round: '',
  });
  const [errMsg,setErrorMsg]= useState('')
  const employerId = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchInterviews = async () => {
      const resp = await empService.getJobsAndInterviewsByEmployer(null,employerId);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setInterviews(resp.data);
    };
    fetchInterviews();
  }, []);

  const handleNewInterviewChange = (e) => {
    const { name, value } = e.target;
    setNewInterview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewInterview = async (e) => {
    e.preventDefault();
    const resp = await empService.insertInterview(newInterview);
    if(!resp.success){
      setErrorMsg(resp.error)
      return;
    }
    setInterviews(prev => [...prev, resp.data]);
    setNewInterview({
      usn: '',
      job_id:'',
      date: '',
      interview_mode: 'Online',
      round: '',
    });
  };

  const handleDeleteInterview = async (interviewId) => {
    const resp = await empService.deleteInterview(interviewId);
    if(!resp.success){
      setErrorMsg(resp.error)
      return ;
    }
    setInterviews(prev => prev.filter(interview => interview.interview_id !== interviewId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Interview Management</h1>
      <p>{errMsg}</p>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Schedule New Interview</h2>
        <form onSubmit={handleSubmitNewInterview} className="space-y-4">
          <div>
            <label className="block mb-1">Applicant USN</label>
            <input
              type="text"
              name="usn"
              value={newInterview.usn}
              onChange={handleNewInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Job ID</label>
            <input
              type="text"
              name="job_id"
              value={newInterview.job_id}
              onChange={handleNewInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="datetime-local"
              name="date"
              value={newInterview.date}
              onChange={handleNewInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Mode</label>
            <select
              name="interview_mode"
              value={newInterview.interview_mode}
              onChange={handleNewInterviewChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Round</label>
            <input
              type="text"
              name="round"
              value={newInterview.round}
              onChange={handleNewInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Schedule Interview
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Scheduled Interviews</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Applicant USN</th>
              <th className="p-2 text-left">Job Title</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Mode</th>
              <th className="p-2 text-left">Round</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(interview => (
              <tr key={interview.interview_id} className="border-t">
                <td className="p-2">{interview.usn}</td>
                <td className="p-2">{interview.title}</td>
                <td className="p-2">{new Date(interview.date).toLocaleString()}</td>
                <td className="p-2">{interview.interview_mode}</td>
                <td className="p-2">{interview.round}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDeleteInterview(interview.interview_id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewPage;

