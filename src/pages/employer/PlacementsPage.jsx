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
  }, [employerId]);

  const handleNewPlacementChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewPlacement = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const resp = await empService.insertPlacement(newPlacement,employerId);
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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Placement Offers</h2>
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Student USN</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Package Offered</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joining Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {placements.map(placement => (
                    <tr key={placement.placement_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{placement.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{placement.usn}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{placement.package_offered}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{placement.joining_date}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => {
                            const newPackage = prompt('Enter new package:', placement.package_offered);
                            if (newPackage) handleUpdatePlacement(placement.placement_id, { ...placement, package_offered: newPackage });
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Update Package<span className="sr-only">, {placement.usn}</span>
                        </button>
                        <button 
                          onClick={() => {
                            const newDate = prompt('Enter new joining date (YYYY-MM-DD):', placement.joining_date);
                            if (newDate) handleUpdatePlacement(placement.placement_id, { ...placement, joining_date: newDate });
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Update Date<span className="sr-only">, {placement.usn}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {placements.length === 0 && (
          <p className="text-center text-gray-500 my-4">No placements added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlacementsPage;

