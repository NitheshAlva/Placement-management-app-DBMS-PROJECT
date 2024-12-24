import React, { useState, useEffect } from 'react';
import studentService from '../../supabase/StudentService';
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    usn: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    branch: '',
    year: '',
    cgpa: '',
    resume: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const usn = useSelector((state)=>state.auth.data)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const resp = await studentService.getStudentByUSN(usn);
        if (!resp.success) {
          setErrorMsg(resp.error);
          return;
        }
        setProfile(resp.data);
      } catch (error) {
        console.log("Error fetching profile:", error);
        setErrorMsg("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await studentService.updateStudentDetails(profile.usn, profile);
      if (!resp.success) {
        setErrorMsg(resp.error);
        return;
      }
      alert("Profile updated successfully!");
      console.log(resp.data)
    } catch (error) {
      console.log("Error updating profile:", error);
      setErrorMsg("Error updating profile");
    }
  };


  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">USN</label>
            <input
              type="text"
              value={profile.usn}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={profile.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={profile.branch}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">CGPA</label>
            <input
              type="number"
              name="cgpa"
              value={profile.cgpa}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      )}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
    </div>
  );
};

export default StudentProfile;
