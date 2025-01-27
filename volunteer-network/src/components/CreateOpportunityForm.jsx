import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '../lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const CATEGORIES = [
  'Miljø og Natur',
  'Barn og Ungdom',
  'Eldre og Omsorg',
  'Sport og Fritid',
  'Kultur og Kunst',
  'Utdanning',
  'Helse',
  'Annet'
];

const CreateOpportunityForm = ({ onOpportunityCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    required_skills: [],
    date: '',
    time_slot: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    category: 'Annet'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          ...formData,
          creator_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      if (data) {
        onOpportunityCreated();
        setFormData({
          title: '',
          organization: '',
          description: '',
          required_skills: [],
          date: '',
          time_slot: '',
          contact_email: '',
          contact_phone: '',
          location: '',
          category: 'Annet'
        });
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grunnleggende Informasjon</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Tittel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Skriv inn tittel på muligheten"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Navn/Organisasjon</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Skriv inn ditt navn eller organisasjonsnavn"
                className="w-full"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Sted</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Skriv inn full adresse (f.eks. Storgata 1, Oslo)"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beskrivelse</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beskriv den frivillige muligheten i detalj..."
            className="min-h-[120px] w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Velg en kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Krav</h3>
        <div className="space-y-2">
          <Label htmlFor="required_skills">Nødvendige Ferdigheter (valgfritt, kommaseparert)</Label>
          <Input
            id="required_skills"
            value={formData.required_skills.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              required_skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
            })}
            placeholder="f.eks. Førstehjelp, Undervisning, Kommunikasjon"
          />
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeplan</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Dato</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time_slot">Tidspunkt</Label>
            <Input
              id="time_slot"
              value={formData.time_slot}
              onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
              placeholder="f.eks. 09:00 - 14:00"
              className="w-full"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktinformasjon</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">E-post</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="contact@organization.com"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telefon (valgfritt)</Label>
            <Input
              id="contact_phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="(123) 456-7890"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpportunityCreated()}
          className="px-4"
        >
          Avbryt
        </Button>
        <Button type="submit" className="px-4">
          Opprett Mulighet
        </Button>
      </div>
    </form>
  );
};

export default CreateOpportunityForm;
