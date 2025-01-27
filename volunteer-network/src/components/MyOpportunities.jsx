import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import ApplicationsList from './ApplicationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import EditOpportunityForm from './EditOpportunityForm';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

const MyOpportunities = ({ isOpen, onClose }) => {
  const [postedOpportunities, setPostedOpportunities] = useState([]);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        fetchMyOpportunities(user.id);

        // Set up real-time subscription
        const channel = supabase.channel('db-changes')
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'opportunities',
              filter: `creator_id=eq.${user.id}`
            },
            async (payload) => {
              console.log('Opportunity change:', payload);
              if (payload.eventType === 'UPDATE') {
                // Fetch fresh data after update
                const { data: freshData, error } = await supabase
                  .from('opportunities')
                  .select('*, applications(count)')
                  .eq('id', payload.new.id)
                  .single();

                if (!error && freshData) {
                  setPostedOpportunities(prev => 
                    prev.map(opp => opp.id === freshData.id ? freshData : opp)
                  );
                }
              } else if (payload.eventType === 'DELETE') {
                setPostedOpportunities(prev => 
                  prev.filter(opp => opp.id !== payload.old.id)
                );
              } else if (payload.eventType === 'INSERT') {
                fetchMyOpportunities(user.id);
              }
            }
          )
          .subscribe();

        return () => {
          channel.unsubscribe();
        };
      }
    };
    
    if (isOpen) {
      getCurrentUser();
    }
  }, [isOpen]);

  const fetchMyOpportunities = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch opportunities created by the user
      const { data: posted, error: postedError } = await supabase
        .from('opportunities')
        .select(`
          *,
          applications(
            id,
            user_id,
            applicant_name,
            applicant_email,
            phone,
            message,
            status,
            created_at
          ),
          applications_count:applications(count)
        `)
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (postedError) throw postedError;
      console.log('Posted opportunities:', posted);

      // Now fetch profiles for each application's user
      const opportunitiesWithProfiles = await Promise.all(
        posted.map(async (opportunity) => {
          const applicationsWithProfiles = await Promise.all(
            (opportunity.applications || []).map(async (application) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, bio, skills, avatar_url')
                .eq('user_id', application.user_id)
                .single();

              return {
                ...application,
                profile
              };
            })
          );

          return {
            ...opportunity,
            applications: [{ count: opportunity.applications_count[0]?.count || 0 }],
            all_applications: applicationsWithProfiles
          };
        })
      );
      
      console.log('Transformed opportunities:', opportunitiesWithProfiles);
      setPostedOpportunities(opportunitiesWithProfiles);

      const { data: applied, error: appliedError } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          opportunity:opportunities (
            *
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (appliedError) throw appliedError;
      setAppliedOpportunities(applied || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (opportunityId) => {
    try {
      // First check if the opportunity exists and get related counts
      const { data: checkData, error: checkError } = await supabase
        .from('opportunities')
        .select(`
          id,
          applications (count),
          messages (count)
        `)
        .eq('id', opportunityId)
        .single();

      if (checkError) {
        console.error('Check error:', checkError);
        throw checkError;
      }

      // Delete the opportunity and all related records in a single transaction
      const { data, error: deleteError } = await supabase.rpc('delete_opportunity', {
        opportunity_id: opportunityId
      });

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Update the local state
      setPostedOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    } catch (error) {
      console.error('Detailed error:', error);
      alert(`Feil ved sletting: ${error.message || error}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Mine Muligheter</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="posted" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posted">
              Lagt Ut ({postedOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="applied">
              Søkt På ({appliedOpportunities.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a365d]"></div>
            </div>
          ) : (
            <>
              <TabsContent value="posted" className="space-y-6 py-4">
                {postedOpportunities.length === 0 ? (
                  <div className="text-center text-gray-500">
                    Du har ikke lagt ut noen muligheter ennå.
                  </div>
                ) : (
                  postedOpportunities.map((opportunity) => (
                    <div 
                      key={opportunity.id}
                      className="bg-white p-6 rounded-lg shadow-sm border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-gray-500">{opportunity.organization}</p>
                          <p className="text-sm text-gray-500">
                            Lagt ut: {new Date(opportunity.created_at).toLocaleDateString('nb-NO')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOpportunity(opportunity);
                              setShowApplications(true);
                            }}
                          >
                            Se Søknader ({opportunity.applications[0].count})
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingOpportunity(opportunity);
                              setShowEditForm(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Dette vil slette muligheten og alle tilhørende søknader og meldinger. Denne handlingen kan ikke angres.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleDelete(opportunity.id)}
                                >
                                  Slett
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="applied" className="space-y-6 py-4">
                {appliedOpportunities.length === 0 ? (
                  <div className="text-center text-gray-500">
                    Du har ikke søkt på noen muligheter ennå.
                  </div>
                ) : (
                  appliedOpportunities.map((application) => (
                    <div 
                      key={application.id}
                      className="bg-white p-6 rounded-lg shadow-sm border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{application.opportunity.title}</h3>
                          <p className="text-sm text-gray-500">{application.opportunity.organization}</p>
                          <p className="text-sm text-gray-500">
                            Søkt: {new Date(application.created_at).toLocaleDateString('nb-NO')}
                          </p>
                        </div>
                        <Badge 
                          className={
                            application.status === 'approved' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                        </Badge>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Date:</span>
                          <span>{new Date(application.opportunity.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Time:</span>
                          <span>{application.opportunity.time_slot}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Applications Dialog */}
        {selectedOpportunity && (
          <Dialog 
            open={showApplications} 
            onOpenChange={(open) => {
              setShowApplications(open);
              if (!open) setSelectedOpportunity(null);
            }}
          >
            <DialogContent className="w-[90vw] max-w-[700px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                    Søknader for: {selectedOpportunity.title}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <ApplicationsList 
                  opportunityId={selectedOpportunity.id}
                  opportunity={selectedOpportunity}
                  onApplicationUpdated={({ closeDialog, quiet } = {}) => {
                    // Only do a full refresh if not quiet
                    if (!quiet) {
                      fetchMyOpportunities(currentUser.id);
                    }
                    // Only close dialog if explicitly requested
                    if (closeDialog) {
                      setShowApplications(false);
                      setSelectedOpportunity(null);
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Dialog */}
        {editingOpportunity && (
          <Dialog 
            open={showEditForm} 
            onOpenChange={(open) => {
              setShowEditForm(open);
              if (!open) setEditingOpportunity(null);
            }}
          >
            <DialogContent className="w-[90vw] max-w-[700px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Rediger Mulighet
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <EditOpportunityForm 
                  opportunity={editingOpportunity}
                  onOpportunityUpdated={async (updatedOpportunity) => {
                    try {
                      // Update local state immediately with the updated opportunity
                      setPostedOpportunities(prev => 
                        prev.map(opp => opp.id === updatedOpportunity.id ? {
                          ...opp,
                          ...updatedOpportunity,
                          applications: opp.applications, // Preserve applications data
                          all_applications: opp.all_applications // Preserve application profiles
                        } : opp)
                      );

                      // Close the dialog
                      setShowEditForm(false);
                      setEditingOpportunity(null);
                    } catch (error) {
                      console.error('Error updating opportunity:', error);
                    }
                  }}
                  onClose={() => {
                    setShowEditForm(false);
                    setEditingOpportunity(null);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MyOpportunities; 