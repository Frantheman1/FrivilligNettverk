import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import MessageDialog from './MessageDialog';
import { UserCircle } from 'lucide-react';
import ViewProfile from './ViewProfile';
import { sendApplicationNotificationEmail } from '../lib/emailService';

const ApplicationsList = ({ opportunityId, opportunity, onApplicationUpdated }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log('Fetching applications for opportunity:', opportunityId);
        console.log('Opportunity object:', opportunity);

        // If we already have the applications in the opportunity object, use those
        if (opportunity?.all_applications) {
          console.log('Using existing applications:', opportunity.all_applications);
          setApplications(opportunity.all_applications);
          setLoading(false);
          return;
        }

        // Otherwise fetch them
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            profile:profiles!user_id(
              user_id,
              full_name,
              bio,
              skills,
              avatar_url
            )
          `)
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Fetched applications:', data);
        console.log('Applications length:', data?.length);
        setApplications(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    if (opportunityId) {
      fetchApplications();
    } else {
      console.warn('No opportunityId provided');
    }

    // Set up real-time subscription
    const subscription = supabase
      .channel(`applications-${opportunityId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'applications',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setApplications(prev => [payload.new, ...prev]);
              break;
            case 'UPDATE':
              setApplications(prev => prev.map(app => 
                app.id === payload.new.id ? payload.new : app
              ));
              break;
            case 'DELETE':
              setApplications(prev => prev.filter(app => app.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [opportunityId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      console.log('Updating application status:', { applicationId, newStatus });
      
      // First update local state for immediate feedback
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));

      // Update the application status without trying to join profiles
      const { data, error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      // Get the profile data in a separate query
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user_id)
        .single();

      // Send email notification to the applicant
      if (profileData?.contact_email) {
        console.log('Sending status update email:', {
          applicantEmail: profileData.contact_email,
          type: newStatus === 'approved' ? 'application_approved' : 'application_rejected'
        });

        await sendApplicationNotificationEmail(
          profileData.contact_email,
          null,
          opportunity.title,
          newStatus === 'approved' ? 'application_approved' : 'application_rejected'
        );
      }

      // Notify parent to refresh the list quietly
      if (onApplicationUpdated) {
        onApplicationUpdated({ 
          closeDialog: false, 
          quiet: true 
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      // Revert local state if there was an error
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'pending' }
          : app
      ));
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleProfileClick = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a365d]"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Ingen søknader ennå for denne muligheten.
      </div>
    );
  }

  const isCreator = currentUser?.id === opportunity.creator_id;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Søknader ({applications.length})</h3>
      <div className="grid gap-4">
        {applications.map((application) => (
          <div 
            key={application.id} 
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div 
                  className="flex-shrink-0 cursor-pointer group"
                  onClick={() => handleProfileClick(application.user_id)}
                >
                  {application.profile?.avatar_url ? (
                    <img
                      src={application.profile.avatar_url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <UserCircle className="w-12 h-12 text-gray-400 transition-transform group-hover:scale-105" />
                  )}
                </div>
                <div>
                  <h4 
                    className="font-medium cursor-pointer hover:text-[#1a365d] transition-colors"
                    onClick={() => handleProfileClick(application.user_id)}
                  >
                    {application.profile?.full_name || application.applicant_name}
                  </h4>
                  <p className="text-sm text-gray-500">{application.applicant_email}</p>
                  {application.phone && (
                    <p className="text-sm text-gray-500">{application.phone}</p>
                  )}
                  {application.profile?.bio && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{application.profile.bio}</p>
                  )}
                  {application.profile?.skills && application.profile.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {application.profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isCreator ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleStatusChange(application.id, 'approved')}
                      disabled={application.status === 'approved'}
                    >
                      {application.status === 'approved' ? 'Godkjent' : 'Godkjenn'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                      disabled={application.status === 'rejected'}
                    >
                      {application.status === 'rejected' ? 'Avvist' : 'Avvis'}
                    </Button>
                  </>
                ) : (
                  <Badge className={getStatusBadgeStyle(application.status)}>
                    {application.status === 'approved' ? 'Godkjent' :
                     application.status === 'rejected' ? 'Avvist' :
                     'Venter'}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 pl-16">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Søknadstekst:</h5>
                <p className="text-gray-700">{application.message}</p>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Søkt den: {new Date(application.created_at).toLocaleDateString('nb-NO')}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedApplication && (
        <MessageDialog
          isOpen={showMessageDialog}
          onClose={() => {
            setShowMessageDialog(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          opportunity={opportunity}
        />
      )}
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

export default ApplicationsList; 