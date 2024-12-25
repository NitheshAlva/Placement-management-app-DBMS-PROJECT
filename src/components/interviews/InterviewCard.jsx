import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function InterviewCard({ interview }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{interview.jobs.title}</h3>
            <p className="text-sm text-gray-500">{interview.jobs.employers.company_name}</p>
          </div>
          <Badge variant={interview.result ? 'success' : 'warning'}>
            {interview.result || 'Scheduled'}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">{new Date(interview.date).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mode</p>
            <p className="font-medium">{interview.interview_mode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Round</p>
            <p className="font-medium">{interview.round}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}