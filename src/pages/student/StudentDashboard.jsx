import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import studentService from '../../supabase/StudentService';
import otherService from '../../supabase/OtherService';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentApplications } from '../../components/dashboard/RecentApplications';
import { Badge } from '../../components/ui/Badge';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const usn = useSelector((state) => state.auth.data);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch student profile
        const profileResp = await studentService.getStudentByUSN(usn);
        if (!profileResp.success) {
          throw new Error(profileResp.error);
        }
        setStudentData(profileResp.data);

        // Fetch recent jobs
        const jobsResp = await otherService.fetchJobs();
        if (!jobsResp.success) {
          throw new Error(jobsResp.error);
        }
        setRecentJobs(jobsResp.data.slice(0, 3));

        // Fetch applications
        const applicationsResp = await otherService.fetchApplicationsWithJobDetails(usn);
        if (!applicationsResp.success) {
          throw new Error(applicationsResp.error);
        }
        setApplications(applicationsResp.data);

        // Fetch interviews
        const interviewsResp = await otherService.fetchInterviewsWithJobDetails(usn);
        if (!interviewsResp.success) {
          throw new Error(interviewsResp.error);
        }
        setInterviews(interviewsResp.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Profile Overview */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {studentData?.first_name}!</h1>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">USN</p>
              <p className="font-medium">{studentData?.usn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium">{studentData?.branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{studentData?.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CGPA</p>
              <p className="font-medium">{studentData?.cgpa}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={applications.length}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Upcoming Interviews"
          value={interviews.length}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Shortlisted"
          value={applications.filter(app => app.status === 'Accepted').length}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Job Openings</h2>
                <Link to="/student/jobs" className="text-sm text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.job_id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.employers.company_name}</p>
                      </div>
                      <Badge variant="primary">{job.salary}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                    <Link
                      to={`/student/job/${job.job_id}`}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 inline-flex items-center"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <RecentApplications applications={applications.slice(0, 5)} />
        </div>
      </div>

      {/* Upcoming Interviews */}
      {interviews.length > 0 && (
        <div className="mt-8">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview) => (
                  <div key={interview.interview_id} className="flex items-center justify-between border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.jobs.title}</h3>
                      <p className="text-sm text-gray-500">{interview.jobs.employers.company_name}</p>
                      <p className="text-sm text-gray-500">Round: {interview.round}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{interview.interview_mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}