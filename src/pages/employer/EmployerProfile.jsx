import React, { useState, useEffect } from 'react';
import employerService from '../../supabase/EmployerService';
import { useSelector } from 'react-redux';


const EmployerProfile = () => {
  const [profile, setProfile] = useState({
    employer_id:'',
    company_name: '',
    website: '',
    industry_type: '',
    contact_email: '',
    location: ''
  });
  const [errorMsg,setErrorMsg] = useState('')
  const employerId = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchProfile = async () => {
      const employerData = await employerService.getEmployer(employerId);
      if(!employerData.success){
        setErrorMsg(employerData.error)
        return
      }
      setProfile(employerData.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await employerService.updateEmployerProfile(profile);
    if (!result.success){
      setErrorMsg(result.error);
      return ;
    }
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-md mx-auto">
      <p>{errorMsg}</p>
      <h1 className="text-2xl font-bold mb-4">Employer Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Employer ID</label>
          <input
            type="employer_id"
            value={profile.employer_id}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={profile.company_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Website</label>
          <input
            type="text"
            name="website"
            value={profile.website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Industry Type</label>
          <input
            type="tel"
            name="indusrty_type"
            value={profile.industry_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Contact Email</label>
          <input
            type="contact_email"
            value={profile.contact_email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1">Location</label>
          <textarea
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EmployerProfile;


