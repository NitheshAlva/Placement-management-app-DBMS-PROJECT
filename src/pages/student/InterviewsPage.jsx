import React, { useState, useEffect } from 'react';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const usn = useSelector(state=>state.auth.data)
  
  useEffect(() => {
    const fetchInterviews = async () => {
      const resp = await otherService.fetchInterviewsWithJobDetails(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setInterviews(resp.data);
    };
    fetchInterviews();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Interviews</h1>
      
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Job Title</th>
            <th className="p-2 text-left">Company Name</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Mode</th>
            <th className="p-2 text-left">Round</th>
            <th className="p-2 text-left">Result</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map(interview => (
            <tr key={interview.interview_id} className="border-t">
              <td className="p-2">{interview.jobs.title}</td>
              <td className="p-2">{interview.jobs.employers.company_name}</td>
              <td className="p-2">{interview.date}</td>
              <td className="p-2">{interview.mode}</td>
              <td className="p-2">{interview.round}</td>
              <td className="p-2">{interview.result || 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewsPage;

