import React, { useState, useEffect } from 'react';
import studentService from '../../supabase/StudentService';
import { useSelector } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const usn = useSelector((state) => state.auth.data);

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
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const resp = await studentService.updateStudentDetails(profile.usn, profile);
      if (!resp.success) {
        setErrorMsg(resp.error);
        return;
      }
      setSuccessMsg("Profile updated successfully!");
    } catch (error) {
      setErrorMsg("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your personal information and academic details
            </p>
          </div>

          {(errorMsg || successMsg) && (
            <div className={`p-4 rounded-md ${errorMsg ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {errorMsg || successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="USN"
                value={profile.usn}
                disabled
                className="bg-gray-50"
              />
              <Input
                label="Email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <Input
                label="First Name"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                required
              />
              <Input
                label="Year"
                name="year"
                type="number"
                min="1"
                max="4"
                value={profile.year}
                onChange={handleChange}
                required
              />
              <Input
                label="Branch"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                required
              />
              <Input
                label="CGPA"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={profile.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProfile(profile)}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;