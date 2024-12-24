import React, { useState, useEffect } from 'react';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';

const PlacementsPage = () => {
  const [placement, setPlacement] = useState(null);
  const usn = useSelector(state=>state.auth.data)

  useEffect(() => {
    const fetchPlacement = async () => {
      const resp = await otherService.fetchPlacementDetails(usn);
      if(!resp.success){
        setErrorMsg(resp.error)
        return;
      }
      setPlacement(resp.data);
    };
    fetchPlacement();
  }, []);

  if (!placement) {
    return <div>No placement offer yet.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Placement</h1>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">{placement.employers.company_name}</h2>
        <p><strong>Package:</strong> {placement.package_offered}</p>
        <p><strong>Placement Date:</strong> {placement.placement_date}</p>
        <p><strong>Joining Date:</strong> {placement.joining_date}</p>
        <p><strong>Industry Type:</strong> {placement.employers.industry_type}</p>
        <p><strong>Location:</strong> {placement.employers.location}</p>
        <p className="mt-4">{placement.offerDetails}</p>
      </div>
    </div>
  );
};

export default PlacementsPage;

