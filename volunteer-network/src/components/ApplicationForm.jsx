import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import ApplicationsList from './ApplicationsList';
import { sendApplicationNotificationEmail } from '../lib/emailService';

const ApplicationForm = ({ opportunity, onApplicationSubmitted, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            setFormData(prev => ({
              ...prev,
              name: profile.full_name || '',
              email: user.email || '',
            }));
          } else {
            // If no profile exists, just set the email
            setFormData(prev => ({
              ...prev,
              email: user.email || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('You must be logged in to apply');

      const applicationData = {
        opportunity_id: opportunity.id,
        user_id: user.id,
        applicant_name: formData.name,
        applicant_email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        status: 'pending'
      };

      console.log('Submitting application:', applicationData);
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      console.log('Application submitted successfully:', data);

      // Send email notification to the opportunity creator
      console.log('Sending new application email to creator:', {
        applicantEmail: user.email,
        creatorEmail: opportunity.contact_email,
        type: 'new_application'
      });
      
      await sendApplicationNotificationEmail(
        user.email,
        opportunity.contact_email,
        opportunity.title,
        'new_application'
      );

      onApplicationSubmitted();
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Det oppstod en feil ved innsending av søknaden. Vennligst prøv igjen.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Navn</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Skriv inn ditt navn"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="din@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (valgfritt)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Skriv inn ditt telefonnummer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Søknadstekst</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Fortell litt om hvorfor du ønsker å delta..."
            className="min-h-[120px]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Avbryt
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className="bg-[#1a365d] hover:bg-[#2a4365]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sender søknad...
            </>
          ) : (
            'Send Søknad'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
