import React, { useState, useEffect } from 'react';
import empService from '../../supabase/EmpService';
import { useSelector } from 'react-redux';

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [newPlacement, setNewPlacement] = useState({
    usn: '',
    job_id: '',
    package_offered: '',
    joining_date: ''
  });
  const [flip, setFlip] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const employerId = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchPlacements = async () => {
      const resp = await empService.getJobsAndPlacementsByEmployer(null, employerId);
      if (!resp.success) {
        setErrorMsg(resp.error);
        return;
      }
      setPlacements(resp.data);
    };

    fetchPlacements();
  }, [employerId, flip]);

  const handleNewPlacementChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewPlacement = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.insertPlacement(newPlacement, employerId);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setPlacements(prev => [...prev, resp.data]);
    setNewPlacement({
      usn: '',
      job_id: '',
      package_offered: '',
      joining_date: ''
    });
    setSuccessMsg('Placement added successfully!');
    setFlip(prev => (prev + 1) % 2);
  };

  const handleUpdatePlacement = async (placementId, updatedData) => {
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.updatePlacement(updatedData);
    if (!resp.success) {
      setErrorMsg(resp.error);
      return;
    }
    setPlacements(prev => prev.map(placement =>
      placement.placement_id === placementId ? { ...placement, ...updatedData } : placement
    ));
    setSuccessMsg('Placement updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Placements Management</h1>

      {(errorMsg || successMsg) && (
        <div className={`p-4 rounded-md mb-6 ${errorMsg ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {errorMsg || successMsg}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Placement</h2>
        <form onSubmit={handleSubmitNewPlacement} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700 mb-1">Student USN</label>
              <input
                type="text"
                id="usn"
                name="usn"
                value={newPlacement.usn}
                onChange={handleNewPlacementChange}
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
                value={newPlacement.job_id}
                onChange={handleNewPlacementChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="package_offered" className="block text-sm font-medium text-gray-700 mb-1">Package Offered</label>
              <input
                type="text"
                id="package_offered"
                name="package_offered"
                value={newPlacement.package_offered}
                onChange={handleNewPlacementChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                type="date"
                id="joining_date"
                name="joining_date"
                value={newPlacement.joining_date}
                onChange={handleNewPlacementChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Add Placement
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Placement Offers</h2>
        <div className="space-y-6">
          {placements.map(placement => (
            <div key={placement.placement_id} className="border border-gray-200 rounded-md p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Job Title</p>
                  <p className="font-medium">{placement.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student USN</p>
                  <p className="font-medium">{placement.usn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Package Offered</p>
                  <p className="font-medium">{placement.package_offered}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-medium">{placement.joining_date}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    const newPackage = prompt('Enter new package:', placement.package_offered);
                    if (newPackage) handleUpdatePlacement(placement.placement_id, { ...placement, package_offered: newPackage });
                  }}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors duration-200"
                >
                  Update Package
                </button>
                <button 
                  onClick={() => {
                    const newDate = prompt('Enter new joining date (YYYY-MM-DD):', placement.joining_date);
                    if (newDate) handleUpdatePlacement(placement.placement_id, { ...placement, joining_date: newDate });
                  }}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors duration-200"
                >
                  Update Date
                </button>
              </div>
            </div>
          ))}
          {placements.length === 0 && (
            <p className="text-center text-gray-500 my-4">No placements added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementsPage;