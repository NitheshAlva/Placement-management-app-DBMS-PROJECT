import React, { useState, useEffect } from 'react';
import employerService from '../../supabase/EmployerService';
import { useSelector } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const EmployerProfile = () => {
  const [profile, setProfile] = useState({
    employer_id: '',
    company_name: '',
    website: '',
    industry_type: '',
    contact_email: '',
    location: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const employerId = useSelector((state) => state.auth.data);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const resp = await employerService.getEmployer(employerId);
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
      const resp = await employerService.updateEmployerProfile(profile);
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
            <h1 className="text-2xl font-bold text-gray-900">Employer Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your company information and contact details
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
                label="Employer ID"
                value={profile.employer_id}
                disabled
                className="bg-gray-50"
              />
              <Input
                label="Contact Email"
                value={profile.contact_email}
                disabled
                className="bg-gray-50"
              />
              <Input
                label="Company Name"
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={profile.website}
                onChange={handleChange}
                required
              />
              <Input
                label="Industry Type"
                name="industry_type"
                value={profile.industry_type}
                onChange={handleChange}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                />
              </div>
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

export default EmployerProfile;