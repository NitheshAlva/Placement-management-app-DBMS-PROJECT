import React from 'react';
import { Card } from '../ui/Card';

export function PlacementCard({ placement }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{placement.employers.company_name}</h3>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Package Offered</p>
            <p className="text-lg font-semibold text-green-600">{placement.package_offered}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{placement.employers.industry_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{placement.employers.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="font-medium">{new Date(placement.joining_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}