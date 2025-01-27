import React, { useState } from 'react';
import { UserCircle, Trophy } from 'lucide-react';
import ViewProfile from './ViewProfile';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([
    {
      userId: '1',
      count: 12,
      profile: {
        full_name: 'Emma Hansen',
        bio: 'Engasjert frivillig med fokus på miljø og bærekraft',
        avatar_url: null
      }
    },
    {
      userId: '2',
      count: 10,
      profile: {
        full_name: 'Lars Pedersen',
        bio: 'Aktiv i lokalmiljøet og brenner for ungdomsarbeid',
        avatar_url: null
      }
    },
    {
      userId: '3',
      count: 8,
      profile: {
        full_name: 'Sofia Berg',
        bio: 'Erfaren frivillig innen kultur og kunst',
        avatar_url: null
      }
    },
    {
      userId: '4',
      count: 7,
      profile: {
        full_name: 'Anders Nilsen',
        bio: 'Dedikert til å hjelpe eldre i nærmiljøet',
        avatar_url: null
      }
    },
    {
      userId: '5',
      count: 6,
      profile: {
        full_name: 'Maria Johansen',
        bio: 'Engasjert i sports- og fritidsaktiviteter for barn',
        avatar_url: null
      }
    },
    {
      userId: '6',
      count: 5,
      profile: {
        full_name: 'Thomas Olsen',
        bio: 'Fokuserer på utdanning og mentoring',
        avatar_url: null
      }
    },
    {
      userId: '7',
      count: 4,
      profile: {
        full_name: 'Kristine Dahl',
        bio: 'Aktiv innen helsefremmende arbeid',
        avatar_url: null
      }
    },
    {
      userId: '8',
      count: 3,
      profile: {
        full_name: 'Erik Solberg',
        bio: 'Bidrar til lokalsamfunnet gjennom diverse prosjekter',
        avatar_url: null
      }
    }
  ]);

  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleProfileClick = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true);
  };

  const getTrophyColor = (index) => {
    switch (index) {
      case 0: return 'text-yellow-400'; // Gold
      case 1: return 'text-gray-400';   // Silver
      case 2: return 'text-amber-600';  // Bronze
      default: return 'text-gray-300';  // Others
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <div 
            key={user.userId}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleProfileClick(user.userId)}
          >
            <div className="flex-shrink-0 w-8 text-center font-semibold">
              {index + 1}.
            </div>
            
            <div className="flex-shrink-0">
              {user.profile?.avatar_url ? (
                <img
                  src={user.profile.avatar_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="flex-grow">
              <div className="font-medium">{user.profile?.full_name || 'Anonym bruker'}</div>
              {user.profile?.bio && (
                <p className="text-sm text-gray-500 line-clamp-1">{user.profile.bio}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${getTrophyColor(index)}`} />
              <span className="font-semibold text-gray-700">
                {user.count} {user.count === 1 ? 'bidrag' : 'bidrag'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ViewProfile
        isOpen={showProfile}
        onClose={() => {
          setShowProfile(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </div>
  );
};

export default Leaderboard; 