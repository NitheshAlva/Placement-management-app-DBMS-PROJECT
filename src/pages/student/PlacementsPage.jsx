import React, { useState, useEffect } from 'react';
import { PlacementCard } from '../../components/placements/PlacementCard';
import otherService from '../../supabase/OtherService';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usn = useSelector(state => state.auth.data);

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        const resp = await otherService.fetchPlacementDetails(usn);
        if (!resp.success) {
          throw new Error(resp.error);
        }
        setPlacements(resp.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacement();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Placement</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {placements.length>0 ? (
        placements.map(placement=>(
          <PlacementCard  key={placement.placement_id} placement={placement} />
        ))
      ) : (
        <Card>
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No placement offer yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Keep applying to jobs and attending interviews!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}