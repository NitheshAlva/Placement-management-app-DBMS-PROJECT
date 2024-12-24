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
  const [errorMsg,setErrorMsg] = useState('')
  const employerId = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchPlacements = async () => {
      const resp = await empService.getJobsAndPlacementsByEmployer(null,employerId);
      if(!resp.success){
        setErrorMsg(resp.error)
        return ;
      }
      setPlacements(resp.data);
    };

    fetchPlacements();
  }, []);

  const handleNewPlacementChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewPlacement = async (e) => {
    e.preventDefault();
    const resp = await empService.insertPlacement(newPlacement);
    if(!resp.success){
      setErrorMsg(resp.error)
      return ;
    }
    setPlacements(prev => [...prev, resp.data]);
    setNewPlacement({
      usn: '',
      job_id: '',
      package_offered: '',
      joining_date: ''
    });
  };

  const handleUpdatePlacement = async (placementId,updatedData) => {
    const resp = await empService.updatePlacement(updatedData);
    if(!resp.success){
      setErrorMsg(resp.error)
      return ;
    }
    setPlacements(prev => prev.map(placement => 
      placement.placement_id === placementId ? { ...placement, ...updatedData } : placement
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Placements</h1>
      <p>{errorMsg}</p>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Placement</h2>
        <form onSubmit={handleSubmitNewPlacement} className="space-y-4">
          <div>
            <label className="block mb-1">Student USN</label>
            <input
              type="text"
              name="usn"
              value={newPlacement.usn}
              onChange={handleNewPlacementChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Job ID</label>
            <input
              type="text"
              name="job_id"
              value={newPlacement.job_id}
              onChange={handleNewPlacementChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Package Offered</label>
            <input
              type="text"
              name="package_offered"
              value={newPlacement.package_offered}
              onChange={handleNewPlacementChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Joining Date</label>
            <input
              type="date"
              name="joining_date"
              value={newPlacement.joining_date}
              onChange={handleNewPlacementChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Placement
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Placement Offers</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Job Title</th>
              <th className="p-2 text-left">Student USN</th>
              <th className="p-2 text-left">Package Offered</th>
              <th className="p-2 text-left">Joining Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {placements.map(placement => (
              <tr key={placement.placement_id} className="border-t">
                <td className="p-2">{placement.title}</td>
                <td className="p-2">{placement.usn}</td>
                <td className="p-2">{placement.package_offered}</td>
                <td className="p-2">{placement.joining_date}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleUpdatePlacement(placement.placement_id, { ...placement, package_offered: prompt('Enter new package:') })}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Update Package
                  </button>
                  <button 
                    onClick={() => handleUpdatePlacement(placement.placement_id, { ...placement, joining_date: prompt('Enter new joining date:') })}
                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                  >
                    Update Joining Date
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementsPage;

