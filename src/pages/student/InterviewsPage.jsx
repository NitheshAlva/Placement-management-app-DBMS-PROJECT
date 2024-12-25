import React, { useState, useEffect } from 'react';
import { InterviewCard } from '../../components/interviews/InterviewCard';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usn = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const resp = await otherService.fetchInterviewsWithJobDetails(usn);
        if (!resp.success) {
          throw new Error(resp.error);
        }
        setInterviews(resp.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [usn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Interviews</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map(interview => (
          <InterviewCard key={interview.interview_id} interview={interview} />
        ))}
        
        {interviews.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No interviews scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}