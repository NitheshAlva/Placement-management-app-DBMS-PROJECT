import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import otherService from '../../supabase/OtherService';

const JobDetailsPage = () => {
  const { jobid } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await otherService.fetchJobDetails(jobid);
      if (response.success) {
        setJobDetails(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [jobid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {jobDetails && (
        <div className="border rounded p-4 bg-white shadow">
          <h1 className="text-2xl font-bold mb-4">{jobDetails.title}</h1>
          <p><strong>Company:</strong> {jobDetails.employers.company_name}</p>
          <p><strong>Employer Contact:</strong> {jobDetails.employers.contact_email}</p>
          <p><strong>Description:</strong> {jobDetails.description}</p>
          <p><strong>Location:</strong> {jobDetails.location}</p>
          <p><strong>Salary:</strong> {jobDetails.salary}</p>
          {/* Add more job details as needed */}
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;