import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ApplicationForm from './ApplicationForm';

const OpportunityCard = ({ opportunity }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{opportunity.title}</span>
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">{opportunity.organization}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{opportunity.description}</p>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-sm text-gray-700">Required Skills:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {opportunity.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>📅 {new Date(opportunity.date).toLocaleDateString()}</span>
            <span>⏰ {opportunity.time_slot}</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Apply Now</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for {opportunity.title}</DialogTitle>
              </DialogHeader>
              <ApplicationForm 
                opportunity={opportunity} 
                onClose={() => {}} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
