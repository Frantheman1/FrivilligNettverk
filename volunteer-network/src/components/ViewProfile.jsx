import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { UserCircle, Mail, Phone } from 'lucide-react';

const ViewProfile = ({ isOpen, onClose, userId, creator }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!creator) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="flex items-center space-x-4">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.full_name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold">{creator.full_name}</h2>
              {creator.contact_email && (
                <p className="text-gray-600">
                  <Mail className="inline-block w-4 h-4 mr-1" />
                  {creator.contact_email}
                </p>
              )}
              {creator.phone && (
                <p className="text-gray-600">
                  <Phone className="inline-block w-4 h-4 mr-1" />
                  {creator.phone}
                </p>
              )}
            </div>
          </div>

          {creator.bio && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Om meg</h3>
              <p className="text-gray-700">{creator.bio}</p>
            </div>
          )}

          {creator.skills?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Ferdigheter</h3>
              <div className="flex flex-wrap gap-2">
                {creator.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProfile; 